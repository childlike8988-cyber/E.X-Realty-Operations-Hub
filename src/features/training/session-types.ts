import type { AppliedNpcStateDelta, NpcRuntimeState, ObjectiveProgress, RiskHit, ScenarioRuntimeState, ScenarioTransitionResult } from './engine-types';
import type { VerificationState } from './types';

/** Canonical Stage 3 lifecycle. A session may only move forward to a terminal state. */
export type TrainingSessionStatus = 'CREATED' | 'ACTIVE' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export type TrainingSessionTerminalStatus = Exclude<TrainingSessionStatus, 'CREATED' | 'ACTIVE'>;

export type SessionContextKind = 'PROPERTY' | 'MARKET' | 'REGION' | 'KNOWLEDGE';

/** Minimal, replayable context captured at session start. It is not a source-domain database copy. */
export type TrainingContextSnapshot = {
  kind: SessionContextKind;
  refId: string;
  source: 'MOCK' | 'VERIFIED' | 'UNKNOWN';
  capturedAt: string;
  version?: string;
  effectiveDate?: string;
  verifiedAt?: string;
  verificationState: VerificationState;
  summary?: string;
};

export type TrainingProviderTraceMetadata = {
  providerId: string;
  isMock: boolean;
  traceRef: string;
  verificationState: VerificationState;
};

/** The state snapshot stored on every audit event. It contains no scenario answer key. */
export type SessionStateSnapshot = {
  status: TrainingSessionStatus;
  npcState: NpcRuntimeState;
  revealedInformationIds: readonly string[];
  objectiveProgress: readonly ObjectiveProgress[];
  riskHits: readonly RiskHit[];
  turnCount: number;
};

export type SessionCommandReceipt = {
  commandId: string;
  eventIds: readonly string[];
  transition: ScenarioTransitionResult;
};

/** Internal persisted session record used by the Stage 3 Mock store. */
export type SimulationSessionRecord = {
  sessionId: string;
  organizationId: string;
  agentRef: string;
  scenarioId: string;
  scenarioVersionId: string;
  status: TrainingSessionStatus;
  startedAt: string;
  endedAt?: string;
  endReason?: string;
  initialNpcState: NpcRuntimeState;
  npcState: NpcRuntimeState;
  runtimeState: ScenarioRuntimeState;
  contextSnapshot: readonly TrainingContextSnapshot[];
  allowedContextSnapshot: readonly string[];
  providerTrace?: TrainingProviderTraceMetadata;
  providerTraceRef?: string;
  eventSequence: number;
  commandReceipts: readonly SessionCommandReceipt[];
};

export type TrainingSession = SimulationSessionRecord;

/** Public alias used by application code without changing the Stage 1 SimulationSession contract. */
export type Stage3SimulationSession = SimulationSessionRecord;

export type SessionLifecycleTransition = {
  from: TrainingSessionStatus;
  to: TrainingSessionStatus;
};

export type SessionInteractionStateDelta = AppliedNpcStateDelta;

export function isTerminalSessionStatus(status: TrainingSessionStatus): status is TrainingSessionTerminalStatus {
  return status === 'COMPLETED' || status === 'FAILED' || status === 'CANCELLED';
}

export function isValidSessionLifecycleTransition(from: TrainingSessionStatus, to: TrainingSessionStatus): boolean {
  if (from === to) return true;
  if (from === 'CREATED' && to === 'ACTIVE') return true;
  return from === 'ACTIVE' && isTerminalSessionStatus(to);
}

export function sessionSnapshotFromRecord(session: SimulationSessionRecord): SessionStateSnapshot {
  return {
    status: session.status,
    npcState: { ...session.npcState },
    revealedInformationIds: [...session.runtimeState.revealedInformationIds],
    objectiveProgress: session.runtimeState.objectiveProgress.map((objective) => ({ ...objective, evidence: [...objective.evidence] })),
    riskHits: session.runtimeState.riskHits.map((risk) => ({ ...risk })),
    turnCount: session.runtimeState.turnCount,
  };
}

export function sessionSnapshotFromRuntime(runtime: ScenarioRuntimeState, status: TrainingSessionStatus): SessionStateSnapshot {
  return {
    status,
    npcState: { ...runtime.npcState },
    revealedInformationIds: [...runtime.revealedInformationIds],
    objectiveProgress: runtime.objectiveProgress.map((objective) => ({ ...objective, evidence: [...objective.evidence] })),
    riskHits: runtime.riskHits.map((risk) => ({ ...risk })),
    turnCount: runtime.turnCount,
  };
}

export function stateDeltaFromSnapshots(before: SessionStateSnapshot, after: SessionStateSnapshot): SessionInteractionStateDelta {
  return {
    trust: after.npcState.trust - before.npcState.trust,
    interest: after.npcState.interest - before.npcState.interest,
    pressure: after.npcState.pressure - before.npcState.pressure,
    emotion: after.npcState.emotion === before.npcState.emotion ? undefined : after.npcState.emotion,
    intent: after.npcState.intent === before.npcState.intent ? undefined : after.npcState.intent,
    negotiationPosition: after.npcState.negotiationPosition === before.npcState.negotiationPosition ? undefined : after.npcState.negotiationPosition,
  };
}
