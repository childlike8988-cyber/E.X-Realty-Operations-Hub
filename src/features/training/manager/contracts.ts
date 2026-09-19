import type { DimensionId, EvaluationEvidence, OverallState, TrainingResult } from '../evaluation/contracts';
import type { AgentSkillProfileProjection } from '../evaluation/skill-profile';
import type { TrainingSessionEvent } from '../session-events';
import type { TrainingDifficulty, VerificationState } from '../types';

/** Manager data is a read-only projection over canonical Training results and events. */
export type SyntheticTrainingAgent = {
  agentRef: string;
  displayName: string;
  trainingStage: '新進訓練' | '情境練習' | '進階演練';
  isSynthetic: true;
};

export type ManagerScenarioMetadata = {
  scenarioId: string;
  scenarioVersionId: string;
  name: string;
  persona: string;
  difficulty: TrainingDifficulty;
  skillFocus: readonly string[];
};

export type ManagerTrainingDataSource = {
  organizationId: string;
  isSynthetic: true;
  agents: readonly SyntheticTrainingAgent[];
  scenarios: readonly ManagerScenarioMetadata[];
  results: readonly TrainingResult[];
  events: readonly TrainingSessionEvent[];
};

export type ManagerAgentFilter = 'ALL' | 'NEEDS_COACHING' | 'RISK_REVIEW' | 'RECENTLY_ACTIVE';

export type ManagerRiskStatus = 'NONE' | 'NEEDS_VERIFICATION' | 'REQUIRES_REVIEW';

export type ManagerResultSummary = {
  resultId: string;
  sessionId: string;
  scenarioId: string;
  scenarioName: string;
  createdAt: string;
  overallState: OverallState;
  overallScore: number | null;
  objectiveResult: TrainingResult['objectiveResult'];
  verificationState: VerificationState;
  riskStatus: ManagerRiskStatus;
  evidenceCount: number;
};

export type ManagerSkillState = 'STRONG' | 'DEVELOPING' | 'NEEDS_PRACTICE' | 'INSUFFICIENT_EVIDENCE';

export type ManagerSkillMatrixRow = {
  dimensionId: DimensionId;
  label: string;
  score: number | null;
  state: ManagerSkillState;
  trend: AgentSkillProfileProjection['dimensions'][number]['trend'];
  resultRefs: AgentSkillProfileProjection['dimensions'][number]['resultRefs'];
};

export type ManagerAgentSummary = {
  agent: SyntheticTrainingAgent;
  completedScenarioCount: number;
  recentTrainingAt: string | null;
  keyStrength: DimensionId | null;
  primaryWeakness: DimensionId | null;
  riskStatus: ManagerRiskStatus;
  latestResult: ManagerResultSummary | null;
};

export type ManagerEvidenceEvent = Pick<TrainingSessionEvent, 'sequence' | 'timestamp' | 'actor' | 'eventType' | 'message'>;

export type ManagerEvidenceDrilldown = {
  evidenceId: string;
  finding: string;
  kind: EvaluationEvidence['kind'];
  dimensionId: DimensionId;
  dimensionLabel: string;
  verificationState: VerificationState;
  result: ManagerResultSummary;
  events: readonly ManagerEvidenceEvent[];
  sourceLabels: readonly string[];
};

export type ManagerRiskEvent = {
  riskId: string;
  agent: SyntheticTrainingAgent;
  scenarioId: string;
  scenarioName: string;
  createdAt: string;
  severity: Extract<ManagerRiskStatus, 'NEEDS_VERIFICATION' | 'REQUIRES_REVIEW'>;
  summary: string;
  verificationState: VerificationState;
  resultId: string;
  evidenceId: string;
};

export type ManagerTrainingRecommendation = {
  scenarioId: string;
  scenarioName: string;
  dimensionId: DimensionId | null;
  reason: string;
  supportingResultIds: readonly string[];
  supportingEvidenceRefs: readonly string[];
};

export type ManagerAgentDetail = {
  summary: ManagerAgentSummary;
  profile: AgentSkillProfileProjection;
  skillMatrix: readonly ManagerSkillMatrixRow[];
  results: readonly ManagerResultSummary[];
  risks: readonly ManagerRiskEvent[];
  recommendation: ManagerTrainingRecommendation | null;
};

export type ManagerTrainingOverview = {
  organizationId: string;
  isSynthetic: true;
  agentCount: number;
  completedScenarioCount: number;
  recentCompletionCount: number;
  needsCoachingCount: number;
  riskReviewCount: number;
  recommendedAgent: ManagerAgentSummary | null;
};
