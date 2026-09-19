import type { ScenarioObjective, ScenarioRiskRule, TrainingDifficulty, TrainingDimension, TrainingEventActor, TrainingScenarioVersion, VerificationState } from './types';

export type TraineeActionKind =
  | 'ASK_NEEDS'
  | 'ASK_BUDGET'
  | 'ASK_FINANCING'
  | 'EXPLAIN_PROPERTY'
  | 'EXPLAIN_MARKET'
  | 'HANDLE_OBJECTION'
  | 'NEGOTIATE'
  | 'BUILD_TRUST'
  | 'PRESSURE_CLOSE'
  | 'DISCLOSE_RISK'
  | 'UNKNOWN';

export type TraineeAction = {
  kind: TraineeActionKind;
  text?: string;
};

export type ScenarioInformationVisibility = 'PUBLIC' | 'BRIEFING' | 'DISCOVERABLE' | 'HIDDEN' | 'SYSTEM_ONLY';

export type ScenarioRevealCondition = {
  actionKinds?: readonly TraineeActionKind[];
  minimumTrust?: number;
  requiredInformationIds?: readonly string[];
};

export type ScenarioInformation = {
  informationId: string;
  label: string;
  content: string;
  visibility: ScenarioInformationVisibility;
  revealWhen?: ScenarioRevealCondition;
};

export type NpcStateDelta = {
  trust?: number;
  interest?: number;
  pressure?: number;
  emotion?: TrainingEmotion;
  intent?: TrainingIntent;
  negotiationPosition?: NegotiationPosition;
};

export type AppliedNpcStateDelta = {
  trust: number;
  interest: number;
  pressure: number;
  emotion?: TrainingEmotion;
  intent?: TrainingIntent;
  negotiationPosition?: NegotiationPosition;
};

export type ScenarioActionRule = {
  action: TraineeActionKind;
  response: string;
  stateDelta: NpcStateDelta;
  revealInformationIds?: readonly string[];
  objectiveIds?: readonly string[];
  eventTypes?: readonly TrainingEventCandidateType[];
  riskRuleIds?: readonly string[];
  requiresTrustAtLeast?: number;
  requiresInformationIds?: readonly string[];
};

export type ScenarioFailureRule = {
  ruleId: string;
  type: 'TRUST_AT_OR_BELOW' | 'RISK_RULE_HIT' | 'ACTION_USED';
  threshold?: number;
  riskRuleId?: string;
  actionKind?: TraineeActionKind;
};

export type ScenarioSuccessRule = {
  objectiveIds: readonly string[];
  minimumTrust: number;
  disallowedRiskRuleIds: readonly string[];
};

export type ScenarioBehaviorDefinition = {
  scenarioId: string;
  scenarioVersionId: string;
  briefing: string;
  information: readonly ScenarioInformation[];
  actionRules: Partial<Record<TraineeActionKind, ScenarioActionRule>>;
  success: ScenarioSuccessRule;
  failure: readonly ScenarioFailureRule[];
};

export type TrainingEmotion = 'GUARDED' | 'CURIOUS' | 'RELIEVED' | 'FRUSTRATED' | 'CAUTIOUS' | 'ENGAGED' | 'DISENGAGING';

export type TrainingIntent = 'EXPLORE' | 'CONTINUE' | 'DISCOVER' | 'COMPARE' | 'NEGOTIATE' | 'DEFER' | 'DISENGAGE';

export type NegotiationPosition = 'NOT_READY' | 'EXPLORING' | 'OPEN' | 'BOUNDARY_SET';

export type NpcRuntimeState = {
  npcId: string;
  emotion: TrainingEmotion;
  trust: number;
  interest: number;
  pressure: number;
  intent: TrainingIntent;
  negotiationPosition: NegotiationPosition;
};

export type NpcTransitionResult = {
  previousState: NpcRuntimeState;
  action: TraineeAction;
  response: string;
  stateDelta: AppliedNpcStateDelta;
  nextState: NpcRuntimeState;
};

export type TrainingEventCandidateType =
  | 'TRUST_GAINED'
  | 'TRUST_DROPPED'
  | 'HIDDEN_NEED_REVEALED'
  | 'PRICE_OBJECTION_TRIGGERED'
  | 'NEGOTIATION_OPENED'
  | 'RISK_WARNING'
  | 'NEEDS_VERIFICATION'
  | 'CUSTOMER_DISENGAGING'
  | 'SECOND_VIEW_INTEREST'
  | 'OBJECTIVE_PROGRESS';

export type TrainingEventCandidate = {
  candidateId: string;
  sequence: number;
  actor: TrainingEventActor;
  eventType: TrainingEventCandidateType;
  message: string;
  ruleIds: readonly string[];
  verificationState: VerificationState;
};

export type ObjectiveProgressStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'MET';

export type ObjectiveProgress = {
  objectiveId: string;
  label: string;
  status: ObjectiveProgressStatus;
  evidence: readonly string[];
};

export type RiskHit = {
  ruleId: string;
  severity: ScenarioRiskRule['severity'];
  message: string;
  verificationState: VerificationState;
};

export type ScenarioRuntimeStatus = 'IN_PROGRESS' | 'SUCCESS_CANDIDATE' | 'FAILURE_CANDIDATE';

export type ScenarioRuntimeState = {
  organizationId: string;
  agentRef: string;
  scenarioId: string;
  scenarioVersionId: string;
  scenarioName: string;
  difficulty: TrainingDifficulty;
  trainingTags: readonly string[];
  allowedContextSnapshot: readonly string[];
  npcDefinitionRef: string;
  npcState: NpcRuntimeState;
  objectiveProgress: readonly ObjectiveProgress[];
  revealedInformationIds: readonly string[];
  riskHits: readonly RiskHit[];
  eventCandidates: readonly TrainingEventCandidate[];
  status: ScenarioRuntimeStatus;
  turnCount: number;
};

export type ScenarioRuntimeInformation = Pick<ScenarioInformation, 'informationId' | 'label' | 'content'> & {
  visibility: 'PUBLIC' | 'BRIEFING' | 'DISCOVERED';
};

/** Safe trainee-facing projection. It intentionally has no hidden or system-only information collection. */
export type ScenarioRuntimeView = {
  scenarioId: string;
  scenarioVersionId: string;
  scenarioName: string;
  difficulty: TrainingDifficulty;
  trainingTags: readonly string[];
  briefing: string;
  visibleInformation: readonly ScenarioRuntimeInformation[];
  hiddenInformationCount: number;
  systemInformationCount: number;
  npc: Pick<NpcRuntimeState, 'npcId' | 'emotion' | 'trust' | 'interest' | 'pressure' | 'intent' | 'negotiationPosition'>;
  objectiveProgress: readonly ObjectiveProgress[];
  riskHits: readonly Pick<RiskHit, 'ruleId' | 'severity' | 'verificationState'>[];
  status: ScenarioRuntimeStatus;
  turnCount: number;
};

export type ScenarioTransitionResult = {
  previousState: ScenarioRuntimeState;
  action: TraineeAction;
  response: string;
  stateDelta: AppliedNpcStateDelta;
  nextState: ScenarioRuntimeState;
  revealedInformation: readonly ScenarioRuntimeInformation[];
  triggeredEvents: readonly TrainingEventCandidate[];
  objectiveProgress: readonly ObjectiveProgress[];
  riskHits: readonly RiskHit[];
  outcome: ScenarioRuntimeStatus;
};

export type ScenarioEngineResolution = {
  scenarioId: string;
  version: TrainingScenarioVersion;
  behavior: ScenarioBehaviorDefinition;
};

export type ScenarioEvaluationContext = {
  action: TraineeAction;
  runtime: ScenarioRuntimeState;
  version: TrainingScenarioVersion;
  objectives: readonly ScenarioObjective[];
};

export type TrainingDimensionEvidenceKey = TrainingDimension | string;
