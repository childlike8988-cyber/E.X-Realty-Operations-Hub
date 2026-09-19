export type TrainingDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export type TrainingStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export type VerificationState = 'VERIFIED' | 'NEEDS_VERIFICATION' | 'UNKNOWN';

export type SimulationSessionStatus = 'READY' | 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';

export type TrainingEventActor = 'AGENT' | 'NPC' | 'SYSTEM';

export type TrainingEventType = 'MESSAGE' | 'EVIDENCE_ACCESSED' | 'STATE_CHANGE' | 'RISK_DETECTED' | 'SESSION_MARKED_COMPLETE';

export type TrainingDimension =
  | 'Needs Discovery'
  | 'Communication'
  | 'Property Knowledge'
  | 'Market Interpretation'
  | 'Objection Handling'
  | 'Negotiation'
  | 'Risk Awareness'
  | 'Professionalism';

export type ScenarioObjective = {
  objectiveId: string;
  label: string;
  weight: number;
  successEvidence: readonly string[];
};

export type ScenarioRiskRule = {
  ruleId: string;
  trigger: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  action: 'FLAG' | 'STOP' | 'NEEDS_VERIFICATION';
  verificationState: VerificationState;
};

export type ScenarioKnowledgeReference = {
  refId: string;
  source: string;
  version: string;
  effectiveDate: string;
  verifiedAt: string;
  ruleId: string;
  verificationState: VerificationState;
};

export type TrainingNpc = {
  npcId: string;
  persona: string;
  personality: string;
  budget: string;
  knowledgeLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  trueNeeds: readonly string[];
  hiddenNeeds: readonly string[];
  objections: readonly string[];
  emotion: string;
  trust: number;
  interest: number;
  pressure: number;
  intent: string;
  negotiationBoundary: string;
};

export type TrainingScenarioVersion = {
  scenarioVersionId: string;
  scenarioId: string;
  version: number;
  propertyRef: string;
  regionRef: string;
  npcRefs: readonly string[];
  budget: string;
  objectives: readonly ScenarioObjective[];
  hiddenInformation: readonly string[];
  events: readonly string[];
  successConditions: readonly string[];
  failureConditions: readonly string[];
  riskRules: readonly ScenarioRiskRule[];
  knowledgeRefs: readonly ScenarioKnowledgeReference[];
  marketSnapshotRef: string;
  status: TrainingStatus;
};

export type TrainingScenario = {
  scenarioId: string;
  name: string;
  difficulty: TrainingDifficulty;
  trainingTags: readonly string[];
  propertyRef: string;
  regionRef: string;
  npcRefs: readonly string[];
  budget: string;
  objectives: readonly ScenarioObjective[];
  hiddenInformation: readonly string[];
  events: readonly string[];
  successConditions: readonly string[];
  failureConditions: readonly string[];
  riskRules: readonly ScenarioRiskRule[];
  knowledgeRefs: readonly ScenarioKnowledgeReference[];
  marketSnapshotRef: string;
  version: number;
  status: TrainingStatus;
  npc: TrainingNpc;
  currentVersionId: string;
  versions: readonly TrainingScenarioVersion[];
};

export type SimulationSession = {
  sessionId: string;
  organizationId: string;
  scenarioId: string;
  scenarioVersionId: string;
  agentRef: string;
  startedAt: string;
  endedAt?: string;
  status: SimulationSessionStatus;
  npcState: TrainingNpc;
  objectiveState: readonly string[];
  riskState: readonly string[];
  eventSequence: number;
  allowedContextSnapshot: readonly string[];
  providerTraceRef?: string;
};

export type TrainingEvent = {
  eventId: string;
  sessionId: string;
  sequence: number;
  timestamp: string;
  actor: TrainingEventActor;
  eventType: TrainingEventType;
  message: string;
  stateBefore: Readonly<Record<string, unknown>>;
  stateAfter: Readonly<Record<string, unknown>>;
  ruleHits: readonly string[];
  evidenceRefs: readonly string[];
};

export type TrainingEvaluationEvidence = {
  evidenceId: string;
  sessionId: string;
  eventIds: readonly string[];
  dimension: TrainingDimension;
  statement: string;
  excerpt: string;
  source: 'EVENT' | 'RULE' | 'AI_EXPLANATION';
  verificationState: VerificationState;
  createdAt: string;
};

export type TrainingDimensionResult = {
  dimension: TrainingDimension;
  score: number;
  evidenceRefs: readonly string[];
  objectiveResult: 'MET' | 'PARTIAL' | 'NOT_MET';
  ruleHits: readonly string[];
  aiRationale: string;
  confidence: number;
  verificationState: VerificationState;
};

export type TrainingResult = {
  resultId: string;
  sessionId: string;
  scenarioId: string;
  scenarioVersionId: string;
  agentRef: string;
  dimensionResults: readonly TrainingDimensionResult[];
  evidence: readonly TrainingEvaluationEvidence[];
  objectiveResult: 'MET' | 'PARTIAL' | 'NOT_MET';
  overallScore: number;
  verificationState: VerificationState;
  createdAt: string;
};

export type AgentSkillDimension = {
  dimension: TrainingDimension;
  score: number;
  resultCount: number;
  trend: 'IMPROVING' | 'STABLE' | 'NEEDS_ATTENTION';
};

export type AgentSkillProfile = {
  organizationId: string;
  agentRef: string;
  dimensions: readonly AgentSkillDimension[];
  sourceResultIds: readonly string[];
  projectionOf: 'TRAINING_RESULTS';
  generatedAt: string;
};

export type TrainingRecommendation = {
  recommendationId: string;
  organizationId: string;
  agentRef: string;
  scenarioId: string;
  reason: string;
  sourceResultIds: readonly string[];
  createdAt: string;
};

/** Small runtime guard used by evaluation code to keep unverified knowledge fail-closed. */
export function canUseAsAuthoritativeKnowledge(reference: ScenarioKnowledgeReference): boolean {
  return reference.verificationState === 'VERIFIED';
}

/** Freezes nested training contracts so published versions cannot be changed in memory. */
export function deepFreeze<T>(value: T): T {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const child of Object.values(value as Record<string, unknown>)) {
    if (child !== null && typeof child === 'object') deepFreeze(child);
  }
  return value;
}
