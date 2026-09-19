import { deepFreeze } from '../types';
import type { VerifiedKnowledgeReader } from '../ports';
import type { TrainingAIProvider, TrainingAdvisoryInput } from '../providers/training-ai-provider';
import { MockTrainingAIProvider } from '../providers/mock-training-ai-provider';
import type { TrainingClock } from '../session-service';
import { systemTrainingClock } from '../session-service';
import { DIMENSION_IDS, type AdvisoryEvaluation, type DimensionEvaluation, type EvaluationEvidence, type EvaluationPolicy, type TrainingResult, type TrainingSessionReader } from './contracts';
import { type ExactVersionReader, type TrainingResultRepository } from './result-repository';
import { createTrainingAdvisoryInput } from './advisory-adapter';
import { evaluateRules, evaluateObjectives, evaluateEventOutcomes, componentScore } from './components';
import { verifyEvaluationKnowledge } from './knowledge';
import { assertPolicy, evaluationPolicyFor } from './policy';

export type EvaluationDependencies = {
  sessions: TrainingSessionReader; versions: ExactVersionReader; results: TrainingResultRepository;
  knowledge: VerifiedKnowledgeReader; provider?: TrainingAIProvider; clock?: TrainingClock;
};
export async function evaluateAIAdvisory(provider: TrainingAIProvider, input: TrainingAdvisoryInput, policy: EvaluationPolicy): Promise<AdvisoryEvaluation> {
  if (!provider.isMock) throw new Error('STAGE4_MOCK_PROVIDER_REQUIRED');
  const unavailable: AdvisoryEvaluation = { providerId: provider.providerId, traceRef: 'unavailable:' + input.sessionId, isMock: true,
    confidence: 0, advisory: '', rationale: 'Advisory unavailable; persisted evidence remains authoritative.',
    verificationState: 'NEEDS_VERIFICATION', disposition: 'UNAVAILABLE' };
  try {
    const response = await provider.evaluateConversation(input);
    if (response.isMock !== true || response.providerId !== provider.providerId || !response.traceRef || typeof response.advisory !== 'string' || typeof response.rationale !== 'string' || !Number.isFinite(response.confidence) || response.confidence < 0 || response.confidence > 1) return unavailable;
    // Explicit output allowlist: extra provider fields never enter scoring or evidence.
    return { providerId: response.providerId, traceRef: response.traceRef, isMock: true,
      advisory: response.advisory, rationale: response.rationale, confidence: response.confidence,
      verificationState: 'NEEDS_VERIFICATION',
      disposition: response.confidence < policy.advisoryMinimumConfidence ? 'LOW_CONFIDENCE' : 'ADVISORY_ONLY' };
  } catch { return unavailable; }
}

export class HybridEvaluationEngine {
  private readonly provider: TrainingAIProvider;
  private readonly clock: TrainingClock;
  constructor(private readonly dependencies: EvaluationDependencies) {
    this.provider = dependencies.provider ?? new MockTrainingAIProvider();
    this.clock = dependencies.clock ?? systemTrainingClock;
  }
  async evaluate(sessionId: string, requestedPolicy?: EvaluationPolicy): Promise<TrainingResult> {
    const { sessions, versions, knowledge, results } = this.dependencies;
    const session = sessions.getSession(sessionId);
    if (session.status === 'CREATED' || session.status === 'ACTIVE') throw new Error('EVALUATION_REQUIRES_TERMINAL_SESSION');
    const events = sessions.getEvents(sessionId);
    const replay = sessions.getReplayState(sessionId); // Stage 3 integrity validation, no interaction re-run
    if (replay.sessionId !== sessionId || replay.scenarioVersionId !== session.scenarioVersionId || replay.status !== session.status || replay.eventsApplied !== events.length || session.eventSequence !== events.length) throw new Error('EVALUATION_REPLAY_MISMATCH');
    const version = versions(session.scenarioId, session.scenarioVersionId);
    if (!version || version.scenarioVersionId !== session.scenarioVersionId || version.scenarioId !== session.scenarioId || version.status !== 'PUBLISHED') throw new Error('EXACT_VERSION_REQUIRED');
    const policy = deepFreeze(structuredClone(requestedPolicy ?? evaluationPolicyFor(version.scenarioId, version.scenarioVersionId)));
    assertPolicy(policy);
    if (Object.keys(policy.objectives).some(id => !version.objectives.some(objective => objective.objectiveId === id))) throw new Error('POLICY_OBJECTIVE_MISMATCH');
    const createdAt = this.clock.now();
    const knowledgeChecks = await verifyEvaluationKnowledge(version.knowledgeRefs, session.contextSnapshot, knowledge, createdAt, policy);
    const knowledgeVerified = knowledgeChecks.every(check => check.state === 'VERIFIED');
    const verificationState = knowledgeVerified ? 'VERIFIED' as const : 'NEEDS_VERIFICATION' as const;
    const rule = evaluateRules(events, policy);
    const objective = evaluateObjectives(events, replay, version, policy);
    const event = evaluateEventOutcomes(events, policy);
    const evidence: EvaluationEvidence[] = [...rule, ...objective, ...event].map(finding => finding.evidence);
    for (const hit of replay.riskHits) {
      const definition = version.riskRules.find(rule => rule.ruleId === hit.ruleId);
      const sourceEvent = events.find(event => event.ruleHits.includes(hit.ruleId));
      if (!definition || !sourceEvent || definition.severity !== hit.severity) throw new Error('RISK_EVIDENCE_MISSING');
      for (const dimensionId of ['RISK_AWARENESS', 'PROFESSIONALISM'] as const) {
        evidence.push({ evidenceId: 'risk:' + hit.ruleId + ':' + dimensionId, dimensionId, kind: 'RISK',
          finding: '已觸發風險：' + hit.message + '；此為訓練風險提示，需依來源確認。',
          references: [{ kind: 'RULE_HIT', ruleId: hit.ruleId, eventId: sourceEvent.eventId }, { kind: 'EVENT', eventId: sourceEvent.eventId, sequence: sourceEvent.sequence }],
          verificationState: hit.verificationState === 'VERIFIED' && knowledgeVerified ? 'VERIFIED' : 'NEEDS_VERIFICATION' });
      }
    }
    for (const reference of version.knowledgeRefs) evidence.push({
      evidenceId: 'knowledge:' + reference.refId, dimensionId: 'RISK_AWARENESS', kind: 'CONTEXT',
      finding: '知識來源檢核：' + (knowledgeChecks.find(check => check.refId === reference.refId)?.reason ?? 'MISSING'),
      references: [{ kind: 'KNOWLEDGE', refId: reference.refId, version: reference.version }], verificationState,
    });
    const requiresReview = replay.riskHits.some(hit => policy.riskOverrides.reviewSeverities.includes(hit.severity));
    const advisoryInput = createTrainingAdvisoryInput(sessions, sessionId, version.knowledgeRefs.filter(ref => knowledgeChecks.some(check => check.refId === ref.refId && check.state === 'VERIFIED')));
    const aiAdvisory = await evaluateAIAdvisory(this.provider, advisoryInput, policy);
    const dimensionResults: DimensionEvaluation[] = DIMENSION_IDS.map(dimensionId => {
      const relevant = evidence.filter(item => item.dimensionId === dimensionId);
      const sources = new Set(relevant.filter(item => item.kind !== 'CONTEXT').flatMap(item => item.references.flatMap(ref => ref.kind === 'EVENT' ? [ref.eventId] : [])));
      const base = { dimensionId, evidenceRefs: relevant.map(item => item.evidenceId), verificationState, aiAdvisory };
      const ruleScore = componentScore(rule, dimensionId);
      const objectiveScore = componentScore(objective, dimensionId);
      const eventScore = componentScore(event, dimensionId);
      const available = [
        { score: ruleScore, weight: policy.componentWeights.rule },
        { score: objectiveScore, weight: policy.componentWeights.objective },
        { score: eventScore, weight: policy.componentWeights.event },
      ].filter((item): item is { score: number; weight: number } => item.score !== null && item.weight > 0);
      if (sources.size < policy.minimumEvidence || !available.length) return { ...base, state: 'INSUFFICIENT_EVIDENCE', reason: '尚無足夠的獨立事件證據可評分。' };
      const raw = available.reduce((sum, item) => sum + item.score * item.weight, 0) / available.reduce((sum, item) => sum + item.weight, 0);
      const capped = requiresReview && policy.riskOverrides.dimensions.includes(dimensionId) ? Math.min(raw, policy.riskOverrides.dimensionCap) : raw;
      return { ...base, state: 'SCORED', score: Math.round(capped * 100) / 100,
        confidence: Math.min(1, sources.size / policy.confidenceEvidenceTarget), ruleScore, objectiveScore, eventScore };
    });
    const scored = dimensionResults.filter((item): item is Extract<DimensionEvaluation, { state: 'SCORED' }> => item.state === 'SCORED' && policy.dimensionWeights[item.dimensionId] > 0);
    const denominator = scored.reduce((sum, item) => sum + policy.dimensionWeights[item.dimensionId], 0);
    const overallScore = denominator ? Math.round(scored.reduce((sum, item) => sum + item.score * policy.dimensionWeights[item.dimensionId], 0) / denominator * 100) / 100 : null;
    const pendingRisk = evidence.some(item => item.kind === 'RISK' && item.verificationState !== 'VERIFIED');
    const overallState = requiresReview ? 'REQUIRES_REVIEW' : !knowledgeVerified || pendingRisk ? 'NEEDS_VERIFICATION' : overallScore === null ? 'INSUFFICIENT_EVIDENCE' : overallScore >= policy.thresholds.strong ? 'STRONG' : overallScore >= policy.thresholds.developing ? 'DEVELOPING' : 'NEEDS_PRACTICE';
    const met = replay.objectiveProgress.filter(item => item.status === 'MET').length;
    const revision = (results.getLatestResult(sessionId)?.revision ?? 0) + 1;
    return results.appendResult({
      resultId: sessionId + ':evaluation:' + revision, sessionId, organizationId: session.organizationId, agentRef: session.agentRef,
      scenarioId: version.scenarioId, scenarioVersionId: version.scenarioVersionId,
      evaluationPolicyId: policy.policyId, evaluationPolicyVersion: policy.version, policySnapshot: policy,
      revision, createdAt, overallState, overallScore, dimensionResults,
      objectiveResult: met === version.objectives.length ? 'MET' : met > 0 ? 'PARTIAL' : 'NOT_MET',
      riskSummary: { requiresReview, ruleIds: replay.riskHits.map(hit => hit.ruleId), evidenceRefs: evidence.filter(item => item.kind === 'RISK').map(item => item.evidenceId) },
      evidence, evidenceRefs: evidence.map(item => item.evidenceId),
      verificationState: pendingRisk ? 'NEEDS_VERIFICATION' : verificationState, aiAdvisory, knowledgeChecks,
    });
  }
}
