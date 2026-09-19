import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { InMemoryTrainingRepository } from '@/features/training/repository';
import { TrainingSessionApplicationService } from '@/features/training/session-service';
import { TrainingSessionReplay } from '@/features/training/session-replay';
import { createTrainingSessionReader } from '@/features/training/evaluation/session-reader';
import { createTrainingAdvisoryInput } from '@/features/training/evaluation/advisory-adapter';
import { InMemoryTrainingResultRepository } from '@/features/training/evaluation/result-repository';
import { DIMENSION_IDS, DIMENSION_LABELS, assertDimension, type DimensionEvaluation, type TrainingResult, type EvaluationPolicy } from '@/features/training/evaluation/contracts';
import { MockTrainingAIProvider } from '@/features/training/providers/mock-training-ai-provider';

export function alignmentFixture() {
  const catalog = new InMemoryTrainingRepository();
  const service = new TrainingSessionApplicationService({ scenarioRepository: catalog, clock: { now: () => '2026-09-19T00:00:00Z' } });
  const session = service.startSession({ scenarioId: 'S01', sessionId: 'alignment-session' });
  service.cancelSession(session.sessionId);
  const reader = createTrainingSessionReader(service.sessionRepository, new TrainingSessionReplay(service.scenarioEngine, service.sessionRepository));
  const repository = new InMemoryTrainingResultRepository(reader, (id, version) => catalog.getScenarioVersion(id, version));
  const policy: EvaluationPolicy = {
    policyId: 'fixture-only', version: 1, dimensionWeights: Object.fromEntries(DIMENSION_IDS.map(id => [id, 1])) as EvaluationPolicy['dimensionWeights'],
    componentWeights: { rule: 1, objective: 1, event: 1 }, minimumEvidence: 1, confidenceEvidenceTarget: 4,
    advisoryMinimumConfidence: 0.5, knowledgeMaxAgeDays: 90, thresholds: { strong: 80, developing: 60 },
    riskOverrides: { reviewSeverities: ['HIGH'], dimensionCap: 35, dimensions: ['RISK_AWARENESS'] },
    actionRules: [], eventRules: [], objectives: {},
  };
  const result: TrainingResult = {
    resultId: 'fixture-result-1', sessionId: session.sessionId, organizationId: session.organizationId, agentRef: session.agentRef,
    scenarioId: session.scenarioId, scenarioVersionId: session.scenarioVersionId, evaluationPolicyId: policy.policyId,
    evaluationPolicyVersion: 1, policySnapshot: policy, revision: 1, createdAt: '2026-09-19T00:01:00Z',
    overallState: 'INSUFFICIENT_EVIDENCE', overallScore: null,
    dimensionResults: DIMENSION_IDS.map(dimensionId => ({ dimensionId, state: 'INSUFFICIENT_EVIDENCE', reason: 'Fixture without interaction', evidenceRefs: [], verificationState: 'NEEDS_VERIFICATION' })),
    evidence: [], evidenceRefs: [], objectiveResult: 'NOT_MET', verificationState: 'NEEDS_VERIFICATION',
    riskSummary: { requiresReview: false, ruleIds: [], evidenceRefs: [] }, knowledgeChecks: [],
    aiAdvisory: { providerId: 'mock', isMock: true, traceRef: 'fixture', confidence: 0, verificationState: 'NEEDS_VERIFICATION', advisory: '', rationale: '', disposition: 'LOW_CONFIDENCE' },
  };
  return { catalog, service, session, reader, repository, result };
}

describe('Stage 4-A minimal contract alignment', () => {
  it('separates eight stable dimension IDs from labels', () => {
    expect(DIMENSION_IDS).toHaveLength(8);
    expect(DIMENSION_IDS.every(id => /^[A-Z_]+$/.test(id))).toBe(true);
    expect(DIMENSION_LABELS.NEEDS_DISCOVERY).toBe('需求探索');
  });
  it('represents insufficient evidence without a fake score or confidence', () => {
    const dimension = alignmentFixture().result.dimensionResults[0];
    expect(() => assertDimension(dimension)).not.toThrow();
    expect(dimension).not.toHaveProperty('score');
    expect(dimension).not.toHaveProperty('confidence');
    expect(() => assertDimension({ ...dimension, score: 0 } as DimensionEvaluation)).toThrow();
  });
  it.each([-1, 101, NaN, Infinity])('rejects out of range score %s', score => {
    expect(() => assertDimension({ state: 'SCORED', dimensionId: 'COMMUNICATION', score, confidence: 0.5, ruleScore: 50, objectiveScore: null, eventScore: null, evidenceRefs: ['e'], verificationState: 'UNKNOWN' })).toThrow();
  });
  it('requires evidence for a scored professional dimension', () => {
    expect(() => assertDimension({ state: 'SCORED', dimensionId: 'COMMUNICATION', score: 50, confidence: 0.5, ruleScore: 50, objectiveScore: null, eventScore: null, evidenceRefs: [], verificationState: 'UNKNOWN' })).toThrow(/EVIDENCE/);
  });
  it('refuses overwrites and duplicate revisions', () => {
    const { repository, result } = alignmentFixture();
    repository.appendResult(result);
    expect(() => repository.appendResult(result)).toThrow(/EXISTS/);
    expect(() => repository.appendResult({ ...result, resultId: 'other' })).toThrow(/EXISTS/);
  });
  it('retains immutable history and coexisting revisions', () => {
    const { repository, result } = alignmentFixture();
    const first = repository.appendResult(result);
    result.policySnapshot.minimumEvidence = 9;
    result.evaluationPolicyVersion = 2;
    result.policySnapshot.version = 2;
    const second = repository.appendResult({ ...result, resultId: 'fixture-result-2', revision: 2 });
    expect(first.policySnapshot.minimumEvidence).toBe(1);
    expect(() => { first.revision = 99; }).toThrow();
    expect(repository.getResultRevision(result.sessionId, 1)).toBe(first);
    expect(repository.getLatestResult(result.sessionId)).toBe(second);
    expect(repository.listResultsBySession(result.sessionId)).toHaveLength(2);
  });
  it('reads canonical Stage 3 session, events and replay through a read-only bridge', () => {
    const { reader, service, session } = alignmentFixture();
    expect(reader.getSession(session.sessionId)).toBe(service.getSession(session.sessionId));
    expect(reader.getEvents(session.sessionId)[0]).toBe(service.sessionRepository.listEvents(session.sessionId)[0]);
    expect(reader.getReplayState(session.sessionId).status).toBe('CANCELLED');
    expect(Object.keys(reader).sort()).toEqual(['getEvents', 'getReplayState', 'getSession']);
    expect(readFileSync('src/features/training/evaluation/result-repository.ts', 'utf8')).not.toMatch(/Map<string,\s*SimulationSession|saveSession|createSession/);
  });
  it('sanitizes and freezes advisory input without changing canonical data', () => {
    const { reader, session } = alignmentFixture();
    const input = createTrainingAdvisoryInput(reader, session.sessionId, []);
    expect(Object.isFrozen(input.structuredEvents[0])).toBe(true);
    expect(() => Object.assign(input.structuredEvents[0], { sequence: 99 })).toThrow();
    expect(JSON.stringify(input)).not.toMatch(/hiddenInformation|negotiationBoundary|negotiationPosition|successEvidence|stateBefore|commandReceipts/);
  });
  it('provider evaluation and explanation contain advisory only', async () => {
    const { reader, session } = alignmentFixture();
    const input = createTrainingAdvisoryInput(reader, session.sessionId, []);
    const provider = new MockTrainingAIProvider();
    for (const result of [await provider.evaluateConversation(input), await provider.explainEvaluation(input)]) {
      expect(result.isMock).toBe(true);
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(Object.keys(result).sort()).toEqual(['advisory', 'confidence', 'isMock', 'providerId', 'rationale', 'traceRef', 'verificationState']);
      expect(result).not.toHaveProperty('finalScore');
      expect(result).not.toHaveProperty('riskOverrideDecision');
    }
  });
  it('keeps Stage 2 engines and Stage 3 canonical lifecycle/replay byte-for-byte unchanged', () => {
    const baseline = [{"Path":"src/features/training/engine-types.ts","Hash":"2B7AD8C3AFD3725B012FCC14DD828743CCEA973216EC165FB824671A150253C8"},{"Path":"src/features/training/npc-engine.ts","Hash":"01BFA5075C7324631283DC6AAE5CFF4A0B50A7127776D5FF980D8CCD660FCA4F"},{"Path":"src/features/training/scenario-engine.ts","Hash":"76E86DECB0FD58E17F42F2A01E6ED80A6E92791F7C23528801205975A7846A83"},{"Path":"src/features/training/session-events.ts","Hash":"FA79B1FF45FD5E7A5D77723F02C103E0BF3C7B48EC5532E40B4AEB9AF5ECC26D"},{"Path":"src/features/training/session-replay.ts","Hash":"F39763231C47AB18441C31E1E6147BD56F4BEE2A34586805CCE619C81B58927D"},{"Path":"src/features/training/session-repository.ts","Hash":"A3A8615E674CBB441A69770DE5D88CD9B2FC2AADB4FB3A729FD4C209CC0E2010"},{"Path":"src/features/training/session-service.ts","Hash":"7D68A256D5710E6099262CDF651F0F48935C54C30B04E3F4A675D727BBC823CD"},{"Path":"src/features/training/session-types.ts","Hash":"2AE1BE264362140FDD89DCC11661B09649326253EBA327B07C0644719CB94022"}];
    for (const file of baseline) expect(createHash('sha256').update(readFileSync(file.Path)).digest('hex').toUpperCase()).toBe(file.Hash);
  });
});
