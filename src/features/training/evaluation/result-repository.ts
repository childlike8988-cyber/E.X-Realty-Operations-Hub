import { deepFreeze, type TrainingScenarioVersion } from '../types';
import { assertDimension, assertScore, type TrainingResult, type TrainingSessionReader } from './contracts';

export interface TrainingResultRepository {
  appendResult(result: TrainingResult): TrainingResult;
  listResultsBySession(sessionId: string): readonly TrainingResult[];
  getLatestResult(sessionId: string): TrainingResult | undefined;
  getResultRevision(sessionId: string, revision: number): TrainingResult | undefined;
}
export type ExactVersionReader = (scenarioId: string, versionId: string) => TrainingScenarioVersion | undefined;

export class InMemoryTrainingResultRepository implements TrainingResultRepository {
  private readonly results = new Map<string, TrainingResult>();
  constructor(private readonly sessions: TrainingSessionReader, private readonly versionReader: ExactVersionReader) {}

  appendResult(input: TrainingResult): TrainingResult {
    // Clone first: caller mutation (including nested policy data) cannot revise history.
    const result = structuredClone(input);
    if (this.results.has(result.resultId) || this.getResultRevision(result.sessionId, result.revision)) throw new Error('RESULT_REVISION_EXISTS');
    for (const stored of this.results.values()) {
      if (stored.evaluationPolicyId === result.evaluationPolicyId && stored.evaluationPolicyVersion === result.evaluationPolicyVersion && JSON.stringify(stored.policySnapshot) !== JSON.stringify(result.policySnapshot)) throw new Error('POLICY_VERSION_CONFLICT');
    }
    if (!Number.isInteger(result.revision) || result.revision !== (this.getLatestResult(result.sessionId)?.revision ?? 0) + 1) throw new Error('RESULT_REVISION_INVALID');
    const session = this.sessions.getSession(result.sessionId);
    const replay = this.sessions.getReplayState(result.sessionId);
    if (session.status === 'ACTIVE' || session.status === 'CREATED') throw new Error('SESSION_NOT_TERMINAL');
    if (replay.eventsApplied !== session.eventSequence || replay.status !== session.status) throw new Error('REPLAY_MISMATCH');
    if (session.agentRef !== result.agentRef || session.organizationId !== result.organizationId || session.scenarioId !== result.scenarioId || session.scenarioVersionId !== result.scenarioVersionId) throw new Error('RESULT_SCOPE_MISMATCH');
    const version = this.versionReader(result.scenarioId, result.scenarioVersionId);
    if (!version || version.status !== 'PUBLISHED') throw new Error('EXACT_VERSION_REQUIRED');
    if (!result.evaluationPolicyId || !Number.isInteger(result.evaluationPolicyVersion) || result.evaluationPolicyVersion < 1 || result.policySnapshot.policyId !== result.evaluationPolicyId || result.policySnapshot.version !== result.evaluationPolicyVersion) throw new Error('POLICY_VERSION_REQUIRED');
    if (!Number.isFinite(Date.parse(result.createdAt))) throw new Error('RESULT_TIME_INVALID');
    const events = this.sessions.getEvents(result.sessionId);
    const eventMap = new Map(events.map(event => [event.eventId, event]));
    const ids = new Set(result.evidence.map(item => item.evidenceId));
    if (ids.size !== result.evidence.length) throw new Error('EVIDENCE_ID_DUPLICATE');
    for (const item of result.evidence) {
      if (!item.references.length) throw new Error('EVIDENCE_REFERENCE_REQUIRED');
      for (const ref of item.references) {
        if (ref.kind === 'EVENT' && eventMap.get(ref.eventId)?.sequence !== ref.sequence) throw new Error('EVENT_REFERENCE_INVALID');
        if (ref.kind === 'OBJECTIVE' && (ref.scenarioVersionId !== version.scenarioVersionId || !version.objectives.some(objective => objective.objectiveId === ref.objectiveId))) throw new Error('OBJECTIVE_REFERENCE_INVALID');
        if (ref.kind === 'RULE_HIT' && (!version.riskRules.some(rule => rule.ruleId === ref.ruleId) || !eventMap.get(ref.eventId)?.ruleHits.includes(ref.ruleId))) throw new Error('RULE_REFERENCE_INVALID');
        if (ref.kind === 'KNOWLEDGE' && !version.knowledgeRefs.some(knowledge => knowledge.refId === ref.refId && knowledge.version === ref.version)) throw new Error('KNOWLEDGE_REFERENCE_INVALID');
      }
    }
    const dimensions = new Set<string>();
    for (const dimension of result.dimensionResults) {
      assertDimension(dimension);
      if (dimensions.has(dimension.dimensionId)) throw new Error('DIMENSION_DUPLICATE');
      dimensions.add(dimension.dimensionId);
      if (dimension.evidenceRefs.some(ref => !result.evidence.some(item => item.evidenceId === ref && item.dimensionId === dimension.dimensionId))) throw new Error('DIMENSION_EVIDENCE_INVALID');
    }
    if (result.evidenceRefs.length !== ids.size || new Set(result.evidenceRefs).size !== ids.size || result.evidenceRefs.some(ref => !ids.has(ref))) throw new Error('RESULT_EVIDENCE_INVALID');
    if (result.riskSummary.evidenceRefs.some(ref => !result.evidence.some(item => item.evidenceId === ref && item.kind === 'RISK'))) throw new Error('RISK_EVIDENCE_INVALID');
    if (result.overallScore !== null) {
      assertScore(result.overallScore);
      if (!result.dimensionResults.some(item => item.state === 'SCORED')) throw new Error('OVERALL_EVIDENCE_REQUIRED');
    }
    const stored = deepFreeze(result);
    this.results.set(stored.resultId, stored);
    return stored;
  }

  listResultsBySession(sessionId: string): readonly TrainingResult[] {
    return Object.freeze([...this.results.values()].filter(result => result.sessionId === sessionId).sort((a, b) => a.revision - b.revision));
  }
  getLatestResult(sessionId: string): TrainingResult | undefined { return this.listResultsBySession(sessionId).at(-1); }
  getResultRevision(sessionId: string, revision: number): TrainingResult | undefined {
    return this.listResultsBySession(sessionId).find(result => result.revision === revision);
  }
}
