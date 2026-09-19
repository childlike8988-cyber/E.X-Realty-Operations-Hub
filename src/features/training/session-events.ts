import type { AppliedNpcStateDelta, NpcRuntimeState, RiskHit, TraineeAction } from './engine-types';
import type { TrainingEventActor, VerificationState } from './types';
import type { SessionStateSnapshot, TrainingContextSnapshot, TrainingProviderTraceMetadata } from './session-types';

export type TrainingSessionEventType =
  | 'SESSION_STARTED'
  | 'TRAINEE_ACTION'
  | 'NPC_RESPONSE'
  | 'STATE_CHANGED'
  | 'HIDDEN_NEED_REVEALED'
  | 'OBJECTIVE_PROGRESS'
  | 'RISK_WARNING'
  | 'SUCCESS_CANDIDATE'
  | 'FAILURE_CANDIDATE'
  | 'SESSION_COMPLETED'
  | 'SESSION_FAILED'
  | 'SESSION_CANCELLED'
  | 'TRUST_GAINED'
  | 'TRUST_DROPPED'
  | 'PRICE_OBJECTION_TRIGGERED'
  | 'NEGOTIATION_OPENED'
  | 'NEEDS_VERIFICATION'
  | 'CUSTOMER_DISENGAGING'
  | 'SECOND_VIEW_INTEREST';

export type SessionCandidatePayload = {
  candidateId: string;
  candidateType: Exclude<TrainingSessionEventType, 'SESSION_STARTED' | 'TRAINEE_ACTION' | 'NPC_RESPONSE' | 'STATE_CHANGED' | 'HIDDEN_NEED_REVEALED' | 'OBJECTIVE_PROGRESS' | 'RISK_WARNING' | 'SUCCESS_CANDIDATE' | 'FAILURE_CANDIDATE' | 'SESSION_COMPLETED' | 'SESSION_FAILED' | 'SESSION_CANCELLED'>;
  ruleIds: readonly string[];
  verificationState: VerificationState;
};

export type TrainingSessionEventPayloadMap = {
  SESSION_STARTED: {
    scenarioId: string;
    scenarioVersionId: string;
    initialNpcState: NpcRuntimeState;
    contextSnapshot: readonly TrainingContextSnapshot[];
    providerTrace?: TrainingProviderTraceMetadata;
  };
  TRAINEE_ACTION: { commandId: string; action: TraineeAction };
  NPC_RESPONSE: { response: string; providerTrace?: TrainingProviderTraceMetadata };
  STATE_CHANGED: { stateDelta: AppliedNpcStateDelta };
  HIDDEN_NEED_REVEALED: { informationIds: readonly string[] };
  OBJECTIVE_PROGRESS: { objectiveIds: readonly string[] };
  RISK_WARNING: { riskHits: readonly RiskHit[] };
  SUCCESS_CANDIDATE: { reason: string };
  FAILURE_CANDIDATE: { reason: string };
  SESSION_COMPLETED: { reason: string };
  SESSION_FAILED: { reason: string };
  SESSION_CANCELLED: { reason: string };
  TRUST_GAINED: SessionCandidatePayload;
  TRUST_DROPPED: SessionCandidatePayload;
  PRICE_OBJECTION_TRIGGERED: SessionCandidatePayload;
  NEGOTIATION_OPENED: SessionCandidatePayload;
  NEEDS_VERIFICATION: SessionCandidatePayload;
  CUSTOMER_DISENGAGING: SessionCandidatePayload;
  SECOND_VIEW_INTEREST: SessionCandidatePayload;
};

export type TrainingSessionEventBase<Type extends TrainingSessionEventType> = {
  eventId: string;
  sessionId: string;
  sequence: number;
  timestamp: string;
  actor: TrainingEventActor;
  eventType: Type;
  message: string;
  stateBefore: SessionStateSnapshot;
  stateAfter: SessionStateSnapshot;
  ruleHits: readonly string[];
  evidenceRefs: readonly string[];
  payload: TrainingSessionEventPayloadMap[Type];
};

/** Discriminated, append-only audit event. Payload type follows eventType. */
export type TrainingSessionEvent = {
  [Type in TrainingSessionEventType]: TrainingSessionEventBase<Type>;
}[TrainingSessionEventType];
