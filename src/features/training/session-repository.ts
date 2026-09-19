import { deepFreeze } from './types';
import { InMemoryTrainingRepository, type TrainingRepository } from './repository';
import type { TrainingSessionEvent } from './session-events';
import type { SimulationSessionRecord, TrainingSessionStatus } from './session-types';
import { isTerminalSessionStatus, isValidSessionLifecycleTransition, sessionSnapshotFromRecord } from './session-types';

export type SessionRepositoryErrorCode =
  | 'SESSION_EXISTS'
  | 'SESSION_NOT_FOUND'
  | 'SCENARIO_VERSION_INVALID'
  | 'SESSION_IDENTITY_LOCKED'
  | 'INVALID_LIFECYCLE_TRANSITION'
  | 'INVALID_EVENT_BATCH'
  | 'EVENT_AFTER_TERMINAL'
  | 'SEQUENCE_MISMATCH'
  | 'DUPLICATE_EVENT_ID';

export class TrainingSessionRepositoryError extends Error {
  constructor(readonly code: SessionRepositoryErrorCode, message: string) {
    super(message);
    this.name = 'TrainingSessionRepositoryError';
  }
}

export interface TrainingSessionRepository {
  getSession(sessionId: string): SimulationSessionRecord | undefined;
  createSession(session: SimulationSessionRecord, startedEvent: TrainingSessionEvent): SimulationSessionRecord;
  commitSessionUpdate(sessionId: string, nextSession: SimulationSessionRecord, events: readonly TrainingSessionEvent[]): SimulationSessionRecord;
  appendEventBatch(sessionId: string, events: readonly TrainingSessionEvent[]): readonly TrainingSessionEvent[];
  listEvents(sessionId: string): readonly TrainingSessionEvent[];
}

function sameJson(left: unknown, right: unknown): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

function validateBoundedState(event: TrainingSessionEvent): void {
  const npc = event.stateAfter.npcState;
  if (![npc.trust, npc.interest, npc.pressure].every((value) => Number.isInteger(value) && value >= 0 && value <= 100)) {
    throw new TrainingSessionRepositoryError('INVALID_EVENT_BATCH', `Event ${event.eventId} contains an out-of-range NPC state.`);
  }
  if (!Number.isInteger(event.stateAfter.turnCount) || event.stateAfter.turnCount < 0) {
    throw new TrainingSessionRepositoryError('INVALID_EVENT_BATCH', `Event ${event.eventId} contains an invalid turn count.`);
  }
}

function terminalEventStatus(eventType: TrainingSessionEvent['eventType']): TrainingSessionStatus | undefined {
  if (eventType === 'SESSION_COMPLETED') return 'COMPLETED';
  if (eventType === 'SESSION_FAILED') return 'FAILED';
  if (eventType === 'SESSION_CANCELLED') return 'CANCELLED';
  return undefined;
}

/** Process-local session/event store. All validation runs before any map is mutated. */
export class InMemoryTrainingSessionRepository implements TrainingSessionRepository {
  private readonly sessions = new Map<string, SimulationSessionRecord>();
  private readonly events = new Map<string, TrainingSessionEvent[]>();

  constructor(private readonly scenarioRepository: TrainingRepository = new InMemoryTrainingRepository()) {}

  getSession(sessionId: string): SimulationSessionRecord | undefined {
    return this.sessions.get(sessionId);
  }

  createSession(session: SimulationSessionRecord, startedEvent: TrainingSessionEvent): SimulationSessionRecord {
    if (this.sessions.has(session.sessionId)) throw new TrainingSessionRepositoryError('SESSION_EXISTS', `Session already exists: ${session.sessionId}`);
    this.validateScenarioVersion(session);
    if (session.status !== 'ACTIVE' && session.status !== 'CREATED') throw new TrainingSessionRepositoryError('INVALID_LIFECYCLE_TRANSITION', 'A new session must start in CREATED or ACTIVE state.');
    if (startedEvent.eventType !== 'SESSION_STARTED' || startedEvent.sequence !== 1 || startedEvent.sessionId !== session.sessionId) {
      throw new TrainingSessionRepositoryError('INVALID_EVENT_BATCH', 'The first event must be SESSION_STARTED at sequence 1.');
    }
    if (session.eventSequence !== 1) throw new TrainingSessionRepositoryError('SEQUENCE_MISMATCH', 'A new session must have eventSequence 1 after SESSION_STARTED.');
    if (startedEvent.stateBefore.status !== 'CREATED' || startedEvent.stateAfter.status !== session.status) throw new TrainingSessionRepositoryError('INVALID_EVENT_BATCH', 'SESSION_STARTED must begin from CREATED and match the session status.');
    if (startedEvent.payload.scenarioVersionId !== session.scenarioVersionId || startedEvent.payload.scenarioId !== session.scenarioId) {
      throw new TrainingSessionRepositoryError('INVALID_EVENT_BATCH', 'SESSION_STARTED payload does not match the exact scenario version.');
    }
    this.validateEvents(undefined, session, [startedEvent], true);
    const storedSession = deepFreeze({ ...session, commandReceipts: [...session.commandReceipts] });
    const storedEvent = deepFreeze({ ...startedEvent });
    this.sessions.set(session.sessionId, storedSession);
    this.events.set(session.sessionId, [storedEvent]);
    return storedSession;
  }

  commitSessionUpdate(sessionId: string, nextSession: SimulationSessionRecord, events: readonly TrainingSessionEvent[]): SimulationSessionRecord {
    const current = this.sessions.get(sessionId);
    if (!current) throw new TrainingSessionRepositoryError('SESSION_NOT_FOUND', `Unknown session: ${sessionId}`);
    this.validateSessionIdentity(current, nextSession);
    if (!isValidSessionLifecycleTransition(current.status, nextSession.status)) {
      throw new TrainingSessionRepositoryError('INVALID_LIFECYCLE_TRANSITION', `${current.status} cannot transition to ${nextSession.status}.`);
    }
    if (events.length === 0) throw new TrainingSessionRepositoryError('INVALID_EVENT_BATCH', 'A session update must include an event batch.');
    this.validateEvents(current, nextSession, events, false);
    const expectedSequence = current.eventSequence + events.length;
    if (nextSession.eventSequence !== expectedSequence) throw new TrainingSessionRepositoryError('SEQUENCE_MISMATCH', `Session eventSequence must advance to ${expectedSequence}.`);
    const storedSession = deepFreeze({ ...nextSession, commandReceipts: [...nextSession.commandReceipts] });
    const storedEvents = events.map((event) => deepFreeze({ ...event }));
    const existingEvents = this.events.get(sessionId) ?? [];
    this.sessions.set(sessionId, storedSession);
    this.events.set(sessionId, [...existingEvents, ...storedEvents]);
    return storedSession;
  }

  appendEventBatch(sessionId: string, events: readonly TrainingSessionEvent[]): readonly TrainingSessionEvent[] {
    const current = this.sessions.get(sessionId);
    if (!current) throw new TrainingSessionRepositoryError('SESSION_NOT_FOUND', `Unknown session: ${sessionId}`);
    if (isTerminalSessionStatus(current.status)) throw new TrainingSessionRepositoryError('EVENT_AFTER_TERMINAL', 'Terminal sessions cannot receive more events.');
    if (events.length === 0) return [];
    const nextSession = { ...current, eventSequence: current.eventSequence + events.length };
    this.validateEvents(current, nextSession, events, false);
    const storedEvents = events.map((event) => deepFreeze({ ...event }));
    const existingEvents = this.events.get(sessionId) ?? [];
    const storedSession = deepFreeze({ ...current, eventSequence: nextSession.eventSequence });
    this.sessions.set(sessionId, storedSession);
    this.events.set(sessionId, [...existingEvents, ...storedEvents]);
    return Object.freeze([...storedEvents]);
  }

  listEvents(sessionId: string): readonly TrainingSessionEvent[] {
    return Object.freeze([...(this.events.get(sessionId) ?? [])]);
  }

  private validateScenarioVersion(session: SimulationSessionRecord): void {
    const version = this.scenarioRepository.getScenarioVersion(session.scenarioId, session.scenarioVersionId);
    if (!version || version.status !== 'PUBLISHED') throw new TrainingSessionRepositoryError('SCENARIO_VERSION_INVALID', 'Session must reference an exact published scenario version.');
  }

  private validateSessionIdentity(current: SimulationSessionRecord, next: SimulationSessionRecord): void {
    if (next.sessionId !== current.sessionId || next.organizationId !== current.organizationId || next.agentRef !== current.agentRef || next.scenarioId !== current.scenarioId || next.scenarioVersionId !== current.scenarioVersionId || next.startedAt !== current.startedAt || !sameJson(next.initialNpcState, current.initialNpcState) || !sameJson(next.contextSnapshot, current.contextSnapshot) || !sameJson(next.allowedContextSnapshot, current.allowedContextSnapshot)) {
      throw new TrainingSessionRepositoryError('SESSION_IDENTITY_LOCKED', 'Session identity, exact version, initial state, and context snapshot are immutable.');
    }
    this.validateScenarioVersion(next);
  }

  private validateEvents(current: SimulationSessionRecord | undefined, next: SimulationSessionRecord, events: readonly TrainingSessionEvent[], creating: boolean): void {
    const expectedStart = current ? current.eventSequence + 1 : 1;
    const ids = new Set<string>();
    const existingIds = current ? new Set((this.events.get(current.sessionId) ?? []).map((event) => event.eventId)) : new Set<string>();
    let terminalSeen = false;
    events.forEach((event, index) => {
      if (ids.has(event.eventId)) throw new TrainingSessionRepositoryError('DUPLICATE_EVENT_ID', `Duplicate event id in batch: ${event.eventId}`);
      if (existingIds.has(event.eventId)) throw new TrainingSessionRepositoryError('DUPLICATE_EVENT_ID', `Event id already exists: ${event.eventId}`);
      ids.add(event.eventId);
      if (event.sessionId !== next.sessionId) throw new TrainingSessionRepositoryError('INVALID_EVENT_BATCH', 'Every event must belong to exactly one session.');
      const expectedSequence = expectedStart + index;
      if (event.sequence !== expectedSequence) throw new TrainingSessionRepositoryError('SEQUENCE_MISMATCH', `Event ${event.eventId} must append at sequence ${expectedSequence}.`);
      validateBoundedState(event);
      if (creating && index === 0 && event.eventType !== 'SESSION_STARTED') throw new TrainingSessionRepositoryError('INVALID_EVENT_BATCH', 'A new session must start with SESSION_STARTED.');
      if (!creating && event.eventType === 'SESSION_STARTED') throw new TrainingSessionRepositoryError('INVALID_EVENT_BATCH', 'SESSION_STARTED cannot be appended after session creation.');
      if (current && isTerminalSessionStatus(current.status)) throw new TrainingSessionRepositoryError('EVENT_AFTER_TERMINAL', 'Events cannot be appended after a terminal session.');
      const terminalStatus = terminalEventStatus(event.eventType);
      if (terminalSeen) throw new TrainingSessionRepositoryError('EVENT_AFTER_TERMINAL', 'No event may follow a terminal event in the same batch.');
      if (terminalStatus) {
        terminalSeen = true;
        if (event.stateBefore.status !== 'ACTIVE' || event.stateAfter.status !== terminalStatus) throw new TrainingSessionRepositoryError('INVALID_EVENT_BATCH', `${event.eventType} must transition ACTIVE to ${terminalStatus}.`);
        if (index !== events.length - 1) throw new TrainingSessionRepositoryError('EVENT_AFTER_TERMINAL', 'The terminal event must be last in its batch.');
        if (next.status !== terminalStatus) throw new TrainingSessionRepositoryError('INVALID_EVENT_BATCH', 'Terminal event and session status must agree.');
      } else if (!(creating && index === 0 && event.eventType === 'SESSION_STARTED') && event.stateBefore.status !== event.stateAfter.status) {
        throw new TrainingSessionRepositoryError('INVALID_EVENT_BATCH', `Non-terminal event ${event.eventId} cannot change session lifecycle status.`);
      }
    });
    if (current) {
      if (!sameJson(events[0].stateBefore, sessionSnapshotFromRecord(current))) throw new TrainingSessionRepositoryError('INVALID_EVENT_BATCH', 'The event batch must begin at the current session snapshot.');
      for (let index = 1; index < events.length; index += 1) {
        if (!sameJson(events[index].stateBefore, events[index - 1].stateAfter)) throw new TrainingSessionRepositoryError('INVALID_EVENT_BATCH', 'Event state snapshots must form a continuous chain.');
      }
      if (!sameJson(events[events.length - 1].stateAfter, sessionSnapshotFromRecord(next))) throw new TrainingSessionRepositoryError('INVALID_EVENT_BATCH', 'The event batch must end at the next session snapshot.');
    }
    if (creating && next.status !== 'ACTIVE' && next.status !== 'CREATED') throw new TrainingSessionRepositoryError('INVALID_LIFECYCLE_TRANSITION', 'Invalid initial session status.');
    if (!terminalSeen && current && next.status !== current.status) throw new TrainingSessionRepositoryError('INVALID_EVENT_BATCH', 'A lifecycle change requires a matching terminal event.');
  }
}
