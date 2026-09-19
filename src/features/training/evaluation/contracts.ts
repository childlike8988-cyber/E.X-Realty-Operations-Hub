import type { TrainingSessionEvent } from '../session-events';
import type { SimulationSessionRecord } from '../session-types';
import type { ReplayedSessionState } from '../session-replay';
import type { VerificationState } from '../types';

export const DIMENSION_LABELS = {
  NEEDS_DISCOVERY: '需求探索', COMMUNICATION: '溝通',
  PROPERTY_KNOWLEDGE: '物件知識', MARKET_INTERPRETATION: '行情解釋',
  OBJECTION_HANDLING: '異議處理', NEGOTIATION: '議價',
  RISK_AWARENESS: '風險意識', PROFESSIONALISM: '專業表現',
} as const;
export type DimensionId = keyof typeof DIMENSION_LABELS;
export const DIMENSION_IDS = Object.keys(DIMENSION_LABELS) as DimensionId[];
export type DeepReadonly<T> = T extends object ? { readonly [K in keyof T]: DeepReadonly<T[K]> } : T;

export interface TrainingSessionReader {
  getSession(sessionId: string): DeepReadonly<SimulationSessionRecord>;
  getEvents(sessionId: string): readonly DeepReadonly<TrainingSessionEvent>[];
  getReplayState(sessionId: string): DeepReadonly<ReplayedSessionState>;
}
export type EvidenceReference =
  | { kind: 'EVENT'; eventId: string; sequence: number }
  | { kind: 'OBJECTIVE'; objectiveId: string; scenarioVersionId: string }
  | { kind: 'RULE_HIT'; ruleId: string; eventId: string }
  | { kind: 'KNOWLEDGE'; refId: string; version: string };
export type EvaluationEvidence = {
  evidenceId: string; dimensionId: DimensionId; kind: 'POSITIVE' | 'NEGATIVE' | 'RISK' | 'CONTEXT';
  finding: string; references: readonly EvidenceReference[]; verificationState: VerificationState;
};
export type AdvisoryEvaluation = {
  providerId: string; traceRef: string; isMock: boolean; confidence: number;
  verificationState: VerificationState; advisory: string; rationale: string;
  disposition: 'ADVISORY_ONLY' | 'LOW_CONFIDENCE' | 'UNAVAILABLE';
};
type DimensionBase = {
  dimensionId: DimensionId; evidenceRefs: readonly string[]; verificationState: VerificationState;
  aiAdvisory?: AdvisoryEvaluation;
};
export type DimensionEvaluation = DimensionBase & (
  | { state: 'SCORED'; score: number; confidence: number;
      ruleScore: number | null; objectiveScore: number | null; eventScore: number | null }
  | { state: 'INSUFFICIENT_EVIDENCE'; reason: string; score?: never; confidence?: never }
);
export type OverallState = 'STRONG' | 'DEVELOPING' | 'NEEDS_PRACTICE' | 'REQUIRES_REVIEW' | 'NEEDS_VERIFICATION' | 'INSUFFICIENT_EVIDENCE';
export type TrainingResult = {
  resultId: string; sessionId: string; organizationId: string; scenarioId: string; scenarioVersionId: string;
  agentRef: string; evaluationPolicyId: string; evaluationPolicyVersion: number; revision: number; createdAt: string;
  overallState: OverallState; overallScore: number | null;
  dimensionResults: readonly DimensionEvaluation[]; objectiveResult: 'MET' | 'PARTIAL' | 'NOT_MET';
  riskSummary: { requiresReview: boolean; ruleIds: readonly string[]; evidenceRefs: readonly string[] };
  evidence: readonly EvaluationEvidence[]; evidenceRefs: readonly string[];
  verificationState: VerificationState; aiAdvisory: AdvisoryEvaluation;
  knowledgeChecks: readonly { refId: string; state: VerificationState; reason: string }[];
  policySnapshot: EvaluationPolicy;
};
export type EvaluationPolicy = {
  policyId: string; version: number; dimensionWeights: Record<DimensionId, number>;
  componentWeights: { rule: number; objective: number; event: number };
  minimumEvidence: number; confidenceEvidenceTarget: number; advisoryMinimumConfidence: number;
  knowledgeMaxAgeDays: number; thresholds: { strong: number; developing: number };
  riskOverrides: { reviewSeverities: readonly ('HIGH' | 'MEDIUM' | 'LOW')[]; dimensionCap: number; dimensions: readonly DimensionId[] };
  actionRules: readonly { action: string; dimensions: readonly DimensionId[]; score: number; positive: boolean }[];
  eventRules: readonly { eventType: TrainingSessionEvent['eventType']; dimensions: readonly DimensionId[]; score: number }[];
  objectives: Readonly<Record<string, readonly DimensionId[]>>;
};
export function assertScore(score: number): void {
  if (!Number.isFinite(score) || score < 0 || score > 100) throw new Error('SCORE_OUT_OF_RANGE');
}
export function assertDimension(dimension: DimensionEvaluation): void {
  if (!DIMENSION_IDS.includes(dimension.dimensionId)) throw new Error('DIMENSION_ID_INVALID');
  if (dimension.state === 'SCORED') {
    assertScore(dimension.score);
    if (!dimension.evidenceRefs.length) throw new Error('SCORED_DIMENSION_REQUIRES_EVIDENCE');
    if (!Number.isFinite(dimension.confidence) || dimension.confidence < 0 || dimension.confidence > 1) throw new Error('CONFIDENCE_INVALID');
    for (const score of [dimension.ruleScore, dimension.objectiveScore, dimension.eventScore]) if (score !== null) assertScore(score);
  } else if (dimension.state !== 'INSUFFICIENT_EVIDENCE' || 'score' in dimension || 'confidence' in dimension || !dimension.reason) {
    throw new Error('INSUFFICIENT_EVIDENCE_MUST_NOT_HAVE_SCORE');
  }
}
