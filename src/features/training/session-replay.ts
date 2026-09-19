import { deepFreeze } from './types';
import type { ScenarioRuntimeState, TrainingEventCandidateType } from './engine-types';
import type { ScenarioEngine } from './scenario-engine';
import type { TrainingSessionEvent } from './session-events';
import type { TrainingSessionRepository } from './session-repository';
import { isTerminalSessionStatus, type SessionStateSnapshot, type SimulationSessionRecord, type TrainingSessionStatus } from './session-types';
import { sessionSnapshotFromRuntime, stateDeltaFromSnapshots } from './session-types';

export type ReplayIntegrityCode =
  | 'SESSION_NOT_FOUND'
  | 'MISSING_SESSION_STARTED'
  | 'MISSING_SEQUENCE'
  | 'DUPLICATE_SEQUENCE'
  | 'OUT_OF_ORDER'
  | 'WRONG_SESSION'
  | 'INVALID_EVENT_PAYLOAD'
  | 'INVALID_STATE_TRANSITION'
  | 'EVENT_AFTER_TERMINAL'
  | 'SESSION_STATE_MISMATCH';

export class SessionReplayIntegrityError extends Error {
  constructor(readonly code: ReplayIntegrityCode, message: string) {
    super(message);
    this.name = 'SessionReplayIntegrityError';
  }
}

export type ReplayedSessionState = {
  sessionId: string;
  scenarioId: string;
  scenarioVersionId: string;
  organizationId: string;
  agentRef: string;
  status: TrainingSessionStatus;
  npcState: SessionStateSnapshot['npcState'];
  revealedInformationIds: readonly string[];
  objectiveProgress: SessionStateSnapshot['objectiveProgress'];
  riskHits: SessionStateSnapshot['riskHits'];
  turnCount: number;
  eventsApplied: number;
};

export type SessionReplayResult = {
  state: ReplayedSessionState;
  runtimeState: ScenarioRuntimeState;
};

function sameValue(left: unknown, right: unknown): boolean {
  if (Object.is(left, right)) return true;
  if (typeof left !== 'object' || typeof right !== 'object' || left === null || right === null) return false;
  if (Array.isArray(left) !== Array.isArray(right)) return false;
  if (Array.isArray(left) && Array.isArray(right)) return left.length === right.length && left.every((value, index) => sameValue(value, right[index]));
  const leftRecord = left as Record<string, unknown>;
  const rightRecord = right as Record<string, unknown>;
  const leftKeys = Object.keys(leftRecord).sort();
  const rightKeys = Object.keys(rightRecord).sort();
  return leftKeys.length === rightKeys.length && leftKeys.every((key, index) => key === rightKeys[index] && sameValue(leftRecord[key], rightRecord[key]));
}

function terminalStatusForEvent(event: TrainingSessionEvent['eventType']): TrainingSessionStatus | undefined {
  if (event === 'SESSION_COMPLETED') return 'COMPLETED';
  if (event === 'SESSION_FAILED') return 'FAILED';
  if (event === 'SESSION_CANCELLED') return 'CANCELLED';
  return undefined;
}

function assertSnapshot(snapshot: SessionStateSnapshot, eventId: string): void {
  const npc = snapshot.npcState;
  if (!Number.isInteger(npc.trust) || npc.trust < 0 || npc.trust > 100 || !Number.isInteger(npc.interest) || npc.interest < 0 || npc.interest > 100 || !Number.isInteger(npc.pressure) || npc.pressure < 0 || npc.pressure > 100 || !Number.isInteger(snapshot.turnCount) || snapshot.turnCount < 0) {
    throw new SessionReplayIntegrityError('INVALID_STATE_TRANSITION', `Event ${eventId} contains an invalid bounded state.`);
  }
}

function activeRuntimeStatus(status: TrainingSessionStatus): ScenarioRuntimeState['status'] {
  if (status === 'COMPLETED') return 'SUCCESS_CANDIDATE';
  if (status === 'FAILED') return 'FAILURE_CANDIDATE';
  return 'IN_PROGRESS';
}

/** Deterministic event replay. It reads structured events only and never calls an AI provider or text classifier. */
export class TrainingSessionReplay {
  constructor(private readonly scenarioEngine: ScenarioEngine, private readonly sessionRepository: TrainingSessionRepository) {}

  replay(sessionId: string): SessionReplayResult {
    const session = this.sessionRepository.getSession(sessionId);
    if (!session) throw new SessionReplayIntegrityError('SESSION_NOT_FOUND', `Unknown session: ${sessionId}`);
    return this.replayEvents(session, this.sessionRepository.listEvents(sessionId));
  }

  replayEvents(session: SimulationSessionRecord, events: readonly TrainingSessionEvent[]): SessionReplayResult {
    const resolved = this.scenarioEngine.resolveScenario(session.scenarioId, session.scenarioVersionId);
    const runtime = this.scenarioEngine.createRuntime({ scenarioId: session.scenarioId, scenarioVersionId: session.scenarioVersionId, organizationId: session.organizationId, agentRef: session.agentRef });
    const eventIds = new Set<string>();
    const first = events[0];
    if (!first || first.eventType !== 'SESSION_STARTED') throw new SessionReplayIntegrityError('MISSING_SESSION_STARTED', 'Replay requires SESSION_STARTED as sequence 1.');
    const preflightSequences = new Set<number>();
    for (const [index, event] of events.entries()) {
      if (preflightSequences.has(event.sequence)) throw new SessionReplayIntegrityError('DUPLICATE_SEQUENCE', `Duplicate event sequence: ${event.sequence}`);
      preflightSequences.add(event.sequence);
      const expected = index + 1;
      if (event.sequence === expected) continue;
      const expectedAppearsLater = events.slice(index + 1).some((later) => later.sequence === expected);
      if (expectedAppearsLater || event.sequence < expected) throw new SessionReplayIntegrityError('OUT_OF_ORDER', `Event sequence ${event.sequence} is out of order.`);
      throw new SessionReplayIntegrityError('MISSING_SEQUENCE', `Missing event sequence ${expected}.`);
    }
    let expectedSequence = 1;
    let current: SessionStateSnapshot = {
      status: 'CREATED',
      npcState: { ...session.initialNpcState },
      revealedInformationIds: [],
      objectiveProgress: runtime.objectiveProgress.map((objective) => ({ ...objective, evidence: [...objective.evidence] })),
      riskHits: [],
      turnCount: 0,
    };

    for (const [index, event] of events.entries()) {
      if (event.sessionId !== session.sessionId) throw new SessionReplayIntegrityError('WRONG_SESSION', `Event ${event.eventId} belongs to another session.`);
      if (eventIds.has(event.eventId)) throw new SessionReplayIntegrityError('INVALID_EVENT_PAYLOAD', `Duplicate event id: ${event.eventId}`);
      eventIds.add(event.eventId);
      if (event.sequence !== expectedSequence) throw new SessionReplayIntegrityError('OUT_OF_ORDER', `Event sequence ${event.sequence} is out of order.`);
      expectedSequence += 1;
      assertSnapshot(event.stateBefore, event.eventId);
      assertSnapshot(event.stateAfter, event.eventId);
      if (!sameValue(event.stateBefore, current)) throw new SessionReplayIntegrityError('INVALID_STATE_TRANSITION', `Event ${event.eventId} stateBefore does not match the replay state.`);
      if (index === 0) {
        if (event.sequence !== 1 || event.eventType !== 'SESSION_STARTED') throw new SessionReplayIntegrityError('MISSING_SESSION_STARTED', 'SESSION_STARTED must be the first event.');
        if (event.payload.scenarioId !== session.scenarioId || event.payload.scenarioVersionId !== session.scenarioVersionId || !sameValue(event.payload.initialNpcState, session.initialNpcState) || !sameValue(event.payload.contextSnapshot, session.contextSnapshot)) {
          throw new SessionReplayIntegrityError('INVALID_EVENT_PAYLOAD', 'SESSION_STARTED payload does not match the locked session snapshot.');
        }
      } else if (event.eventType === 'SESSION_STARTED') {
        throw new SessionReplayIntegrityError('INVALID_EVENT_PAYLOAD', 'SESSION_STARTED may only occur at sequence 1.');
      }

      const terminalStatus = terminalStatusForEvent(event.eventType);
      if (isTerminalSessionStatus(current.status) && !terminalStatus) throw new SessionReplayIntegrityError('EVENT_AFTER_TERMINAL', `Event ${event.eventId} occurs after terminal status ${current.status}.`);
      if (terminalStatus) {
        if (current.status !== 'ACTIVE' || event.stateBefore.status !== 'ACTIVE' || event.stateAfter.status !== terminalStatus || index !== events.length - 1) throw new SessionReplayIntegrityError('INVALID_STATE_TRANSITION', `${event.eventType} has an invalid terminal transition.`);
      } else if (!(index === 0 && event.eventType === 'SESSION_STARTED') && event.stateBefore.status !== event.stateAfter.status) {
        throw new SessionReplayIntegrityError('INVALID_STATE_TRANSITION', `Non-terminal event ${event.eventId} changes lifecycle status.`);
      }
      if (event.eventType === 'STATE_CHANGED') {
        const actualDelta = stateDeltaFromSnapshots(event.stateBefore, event.stateAfter);
        if (!sameValue(actualDelta, event.payload.stateDelta)) throw new SessionReplayIntegrityError('INVALID_STATE_TRANSITION', `STATE_CHANGED payload does not match its snapshots for ${event.eventId}.`);
      }
      current = event.stateAfter;
    }

    if (!sameValue(current, { ...sessionSnapshotForReplay(session), status: session.status })) throw new SessionReplayIntegrityError('SESSION_STATE_MISMATCH', 'Replay state does not match the persisted session record.');
    const replayedRuntime = deepFreeze({
      ...runtime,
      npcState: { ...current.npcState },
      revealedInformationIds: [...current.revealedInformationIds],
      objectiveProgress: current.objectiveProgress.map((objective) => ({ ...objective, evidence: [...objective.evidence] })),
      riskHits: current.riskHits.map((risk) => ({ ...risk })),
      status: activeRuntimeStatus(current.status),
      turnCount: current.turnCount,
      eventCandidates: [],
    });
    return {
      state: deepFreeze({
        sessionId: session.sessionId,
        scenarioId: session.scenarioId,
        scenarioVersionId: resolved.version.scenarioVersionId,
        organizationId: session.organizationId,
        agentRef: session.agentRef,
        status: current.status,
        npcState: { ...current.npcState },
        revealedInformationIds: [...current.revealedInformationIds],
        objectiveProgress: current.objectiveProgress.map((objective) => ({ ...objective, evidence: [...objective.evidence] })),
        riskHits: current.riskHits.map((risk) => ({ ...risk })),
        turnCount: current.turnCount,
        eventsApplied: events.length,
      }),
      runtimeState: replayedRuntime,
    };
  }
}

function sessionSnapshotForReplay(session: SimulationSessionRecord): SessionStateSnapshot {
  return sessionSnapshotFromRuntime(session.runtimeState, session.status);
}

export const replayTrainingSession = (replay: TrainingSessionReplay, sessionId: string): SessionReplayResult => replay.replay(sessionId);

export type TrainingCandidateEventType = TrainingEventCandidateType;
