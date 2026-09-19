import { deepFreeze, type ScenarioKnowledgeReference, type TrainingScenarioVersion } from './types';
import type { TrainingRepository } from './repository';
import type { ObjectiveProgress, RiskHit, ScenarioRuntimeState, ScenarioRuntimeView, ScenarioTransitionResult, TrainingEventCandidate, TrainingEventCandidateType } from './engine-types';
import { MockConversationAdapter, type MockConversationInput } from './mock-conversation-adapter';
import { ScenarioEngine } from './scenario-engine';
import type { TrainingSessionEvent, TrainingSessionEventBase, TrainingSessionEventPayloadMap, TrainingSessionEventType } from './session-events';
import { InMemoryTrainingSessionRepository, type TrainingSessionRepository } from './session-repository';
import { TrainingSessionReplay, type SessionReplayResult } from './session-replay';
import { isTerminalSessionStatus, sessionSnapshotFromRecord, sessionSnapshotFromRuntime, type SimulationSessionRecord, type SessionStateSnapshot, type TrainingContextSnapshot, type TrainingProviderTraceMetadata, type TrainingSessionStatus } from './session-types';

export interface TrainingClock {
  now(): string;
}

export const systemTrainingClock: TrainingClock = {
  now: () => new Date().toISOString(),
};

export type TrainingSessionServiceDependencies = {
  scenarioRepository: TrainingRepository;
  sessionRepository?: TrainingSessionRepository;
  scenarioEngine?: ScenarioEngine;
  conversationAdapter?: MockConversationAdapter;
  clock?: TrainingClock;
  sessionIdFactory?: () => string;
};

export type StartTrainingSessionInput = {
  scenarioId: string;
  scenarioVersionId?: string;
  organizationId?: string;
  agentRef?: string;
  sessionId?: string;
};

export type SubmitTrainingInteractionInput = MockConversationInput & {
  commandId: string;
};

export type TraineeTimelineEvent = Pick<TrainingSessionEvent, 'eventId' | 'sessionId' | 'sequence' | 'timestamp' | 'actor' | 'eventType' | 'message'>;

export type TraineeScenarioView = Omit<ScenarioRuntimeView, 'npc' | 'objectiveProgress' | 'riskHits'> & {
  npc: Omit<ScenarioRuntimeView['npc'], 'negotiationPosition'>;
  objectiveProgress: readonly Pick<ObjectiveProgress, 'objectiveId' | 'label' | 'status'>[];
  riskHits: readonly Pick<RiskHit, 'severity' | 'verificationState'>[];
};

export type TraineeSessionView = {
  sessionId: string;
  status: TrainingSessionStatus;
  startedAt: string;
  endedAt?: string;
  scenario: TraineeScenarioView;
  timeline: readonly TraineeTimelineEvent[];
};

export type SubmitTrainingInteractionResult = {
  duplicate: boolean;
  transition: ScenarioTransitionResult;
  events: readonly TrainingSessionEvent[];
  session: SimulationSessionRecord;
  view: TraineeSessionView;
};

export class TrainingSessionServiceError extends Error {
  constructor(readonly code: 'SESSION_NOT_FOUND' | 'SESSION_NOT_ACTIVE' | 'COMMAND_ID_REQUIRED' | 'SESSION_NOT_SUCCESS_CANDIDATE', message: string) {
    super(message);
    this.name = 'TrainingSessionServiceError';
  }
}

const MOCK_TRACE = (sessionId: string): TrainingProviderTraceMetadata => ({ providerId: 'mock-training-conversation', isMock: true, traceRef: `mock-training-conversation:${sessionId}`, verificationState: 'NEEDS_VERIFICATION' });

function contextSnapshot(version: TrainingScenarioVersion, capturedAt: string): readonly TrainingContextSnapshot[] {
  const references: TrainingContextSnapshot[] = [
    { kind: 'PROPERTY', refId: version.propertyRef, source: 'MOCK', capturedAt, verificationState: 'UNKNOWN', summary: `Mock property snapshot: ${version.propertyRef}` },
    { kind: 'MARKET', refId: version.marketSnapshotRef, source: 'MOCK', capturedAt, verificationState: 'UNKNOWN', summary: `Mock market snapshot: ${version.marketSnapshotRef}` },
    { kind: 'REGION', refId: version.regionRef, source: 'MOCK', capturedAt, verificationState: 'UNKNOWN', summary: `Mock region snapshot: ${version.regionRef}` },
  ];
  const knowledge = version.knowledgeRefs.map((reference: ScenarioKnowledgeReference) => ({ kind: 'KNOWLEDGE' as const, refId: reference.refId, source: 'MOCK' as const, capturedAt, version: reference.version, effectiveDate: reference.effectiveDate, verifiedAt: reference.verifiedAt, verificationState: reference.verificationState, summary: `Knowledge reference: ${reference.ruleId}` }));
  return Object.freeze([...references, ...knowledge]);
}

function snapshotForEvent(runtime: ScenarioRuntimeState, status: TrainingSessionStatus): SessionStateSnapshot {
  return sessionSnapshotFromRuntime(runtime, status);
}

function eventFactory<Type extends TrainingSessionEventType>(
  eventId: string,
  sessionId: string,
  sequence: number,
  timestamp: string,
  actor: TrainingSessionEventBase<Type>['actor'],
  eventType: Type,
  message: string,
  stateBefore: SessionStateSnapshot,
  stateAfter: SessionStateSnapshot,
  payload: TrainingSessionEventPayloadMap[Type],
  ruleHits: readonly string[] = [],
  evidenceRefs: readonly string[] = [],
): TrainingSessionEventBase<Type> {
  return deepFreeze({ eventId, sessionId, sequence, timestamp, actor, eventType, message, stateBefore, stateAfter, ruleHits: [...ruleHits], evidenceRefs: [...evidenceRefs], payload });
}

function candidateEventType(candidate: TrainingEventCandidateType): TrainingSessionEventType {
  return candidate;
}

function candidateEvent(
  candidate: TrainingEventCandidate,
  sessionId: string,
  sequence: number,
  timestamp: string,
  before: SessionStateSnapshot,
  after: SessionStateSnapshot,
  revealedInformationIds: readonly string[],
  objectiveIds: readonly string[],
  riskHits: readonly RiskHit[],
): TrainingSessionEvent {
  const eventType = candidateEventType(candidate.eventType);
  if (eventType === 'HIDDEN_NEED_REVEALED') return eventFactory(`${sessionId}:event:${sequence}`, sessionId, sequence, timestamp, candidate.actor, eventType, candidate.message, before, after, { informationIds: revealedInformationIds }, candidate.ruleIds);
  if (eventType === 'OBJECTIVE_PROGRESS') return eventFactory(`${sessionId}:event:${sequence}`, sessionId, sequence, timestamp, candidate.actor, eventType, candidate.message, before, after, { objectiveIds }, candidate.ruleIds);
  if (eventType === 'RISK_WARNING') return eventFactory(`${sessionId}:event:${sequence}`, sessionId, sequence, timestamp, candidate.actor, eventType, candidate.message, before, after, { riskHits: [...riskHits] }, candidate.ruleIds);
  return eventFactory(`${sessionId}:event:${sequence}`, sessionId, sequence, timestamp, candidate.actor, eventType as Exclude<TrainingSessionEventType, 'SESSION_STARTED' | 'TRAINEE_ACTION' | 'NPC_RESPONSE' | 'STATE_CHANGED' | 'HIDDEN_NEED_REVEALED' | 'OBJECTIVE_PROGRESS' | 'RISK_WARNING' | 'SUCCESS_CANDIDATE' | 'FAILURE_CANDIDATE' | 'SESSION_COMPLETED' | 'SESSION_FAILED' | 'SESSION_CANCELLED'>, candidate.message, before, after, { candidateId: candidate.candidateId, candidateType: eventType as TrainingSessionEvent['payload'] extends infer Payload ? Payload extends { candidateType: infer CandidateType } ? CandidateType : never : never, ruleIds: candidate.ruleIds, verificationState: candidate.verificationState }, candidate.ruleIds);
}

function eventIds(events: readonly TrainingSessionEvent[]): readonly string[] {
  return events.map((event) => event.eventId);
}

export class TrainingSessionApplicationService {
  readonly scenarioEngine: ScenarioEngine;
  readonly sessionRepository: TrainingSessionRepository;
  readonly conversationAdapter: MockConversationAdapter;
  private readonly clock: TrainingClock;
  private readonly sessionIdFactory: () => string;
  private readonly replayEngine: TrainingSessionReplay;

  constructor(dependencies: TrainingSessionServiceDependencies) {
    this.scenarioEngine = dependencies.scenarioEngine ?? new ScenarioEngine(dependencies.scenarioRepository);
    this.sessionRepository = dependencies.sessionRepository ?? new InMemoryTrainingSessionRepository(dependencies.scenarioRepository);
    this.conversationAdapter = dependencies.conversationAdapter ?? new MockConversationAdapter(this.scenarioEngine);
    this.clock = dependencies.clock ?? systemTrainingClock;
    this.sessionIdFactory = dependencies.sessionIdFactory ?? (() => `mock-session-${Date.now().toString(36)}`);
    this.replayEngine = new TrainingSessionReplay(this.scenarioEngine, this.sessionRepository);
  }

  startSession(input: StartTrainingSessionInput): SimulationSessionRecord {
    const resolved = this.scenarioEngine.resolveScenario(input.scenarioId, input.scenarioVersionId);
    const startedAt = this.clock.now();
    const sessionId = input.sessionId ?? this.sessionIdFactory();
    const runtime = this.scenarioEngine.createRuntime({ scenarioId: input.scenarioId, scenarioVersionId: resolved.version.scenarioVersionId, organizationId: input.organizationId ?? 'mock-org', agentRef: input.agentRef ?? 'mock-agent-01' });
    const providerTrace = MOCK_TRACE(sessionId);
    const snapshot = contextSnapshot(resolved.version, startedAt);
    const session: SimulationSessionRecord = {
      sessionId,
      organizationId: runtime.organizationId,
      agentRef: runtime.agentRef,
      scenarioId: runtime.scenarioId,
      scenarioVersionId: runtime.scenarioVersionId,
      status: 'ACTIVE',
      startedAt,
      initialNpcState: { ...runtime.npcState },
      npcState: { ...runtime.npcState },
      runtimeState: runtime,
      contextSnapshot: snapshot,
      allowedContextSnapshot: [resolved.version.propertyRef, resolved.version.marketSnapshotRef, resolved.version.regionRef, ...resolved.version.knowledgeRefs.map((reference) => reference.refId)],
      providerTrace,
      providerTraceRef: providerTrace.traceRef,
      eventSequence: 1,
      commandReceipts: [],
    };
    const startedEvent = eventFactory(`${sessionId}:event:1`, sessionId, 1, startedAt, 'SYSTEM', 'SESSION_STARTED', 'Mock Training Session started.', snapshotForEvent(runtime, 'CREATED'), snapshotForEvent(runtime, 'ACTIVE'), { scenarioId: runtime.scenarioId, scenarioVersionId: runtime.scenarioVersionId, initialNpcState: { ...runtime.npcState }, contextSnapshot: snapshot, providerTrace });
    return this.sessionRepository.createSession(session, startedEvent);
  }

  getSession(sessionId: string): SimulationSessionRecord {
    const session = this.sessionRepository.getSession(sessionId);
    if (!session) throw new TrainingSessionServiceError('SESSION_NOT_FOUND', `Unknown training session: ${sessionId}`);
    return session;
  }

  submitTraineeMessage(sessionId: string, input: SubmitTrainingInteractionInput): SubmitTrainingInteractionResult {
    if (!input.commandId.trim()) throw new TrainingSessionServiceError('COMMAND_ID_REQUIRED', 'A commandId is required for idempotent interaction submission.');
    const session = this.getSession(sessionId);
    if (isTerminalSessionStatus(session.status)) throw new TrainingSessionServiceError('SESSION_NOT_ACTIVE', `Session ${sessionId} is already ${session.status}.`);
    const existingReceipt = session.commandReceipts.find((receipt) => receipt.commandId === input.commandId);
    if (existingReceipt) {
      const acceptedEvents = this.sessionRepository.listEvents(sessionId).filter((event) => existingReceipt.eventIds.includes(event.eventId));
      return { duplicate: true, transition: existingReceipt.transition, events: acceptedEvents, session, view: this.getSessionView(sessionId) };
    }
    const transition = this.conversationAdapter.interact(session.runtimeState, input);
    const now = this.clock.now();
    const activeBefore = snapshotForEvent(session.runtimeState, 'ACTIVE');
    const activeAfter = snapshotForEvent(transition.nextState, 'ACTIVE');
    const eventList: TrainingSessionEvent[] = [];
    let sequence = session.eventSequence + 1;
    eventList.push(eventFactory(`${sessionId}:event:${sequence}`, sessionId, sequence, now, 'AGENT', 'TRAINEE_ACTION', input.text, activeBefore, activeBefore, { commandId: input.commandId, action: { ...transition.action } }));
    sequence += 1;
    eventList.push(eventFactory(`${sessionId}:event:${sequence}`, sessionId, sequence, now, 'NPC', 'NPC_RESPONSE', transition.response, activeBefore, activeBefore, { response: transition.response, providerTrace: session.providerTrace }));
    sequence += 1;
    eventList.push(eventFactory(`${sessionId}:event:${sequence}`, sessionId, sequence, now, 'SYSTEM', 'STATE_CHANGED', 'NPC state changed after trainee interaction.', activeBefore, activeAfter, { stateDelta: transition.stateDelta }));
    sequence += 1;
    const revealedIds = transition.revealedInformation.map((information) => information.informationId);
    const objectiveIds = transition.objectiveProgress.filter((objective) => objective.status === 'MET').map((objective) => objective.objectiveId);
    for (const candidate of transition.triggeredEvents) {
      eventList.push(candidateEvent(candidate, sessionId, sequence, now, activeAfter, activeAfter, revealedIds, objectiveIds, transition.riskHits));
      sequence += 1;
    }
    let nextStatus: TrainingSessionStatus = 'ACTIVE';
    let endReason: string | undefined;
    if (transition.outcome === 'SUCCESS_CANDIDATE') {
      eventList.push(eventFactory(`${sessionId}:event:${sequence}`, sessionId, sequence, now, 'SYSTEM', 'SUCCESS_CANDIDATE', 'Scenario success conditions are a candidate for completion.', activeAfter, activeAfter, { reason: 'Scenario objectives and trust conditions satisfied.' }));
      sequence += 1;
      nextStatus = 'COMPLETED';
      endReason = 'Scenario success candidate accepted.';
      eventList.push(eventFactory(`${sessionId}:event:${sequence}`, sessionId, sequence, now, 'SYSTEM', 'SESSION_COMPLETED', endReason, activeAfter, snapshotForEvent(transition.nextState, 'COMPLETED'), { reason: endReason }));
      sequence += 1;
    } else if (transition.outcome === 'FAILURE_CANDIDATE') {
      eventList.push(eventFactory(`${sessionId}:event:${sequence}`, sessionId, sequence, now, 'SYSTEM', 'FAILURE_CANDIDATE', 'Scenario failure conditions are a candidate for failure.', activeAfter, activeAfter, { reason: 'Scenario risk or failure condition was triggered.' }));
      sequence += 1;
      nextStatus = 'FAILED';
      endReason = 'Scenario failure candidate accepted.';
      eventList.push(eventFactory(`${sessionId}:event:${sequence}`, sessionId, sequence, now, 'SYSTEM', 'SESSION_FAILED', endReason, activeAfter, snapshotForEvent(transition.nextState, 'FAILED'), { reason: endReason }));
      sequence += 1;
    }
    const receipt = { commandId: input.commandId, eventIds: eventIds(eventList), transition };
    const nextSession: SimulationSessionRecord = {
      ...session,
      status: nextStatus,
      endedAt: nextStatus === 'ACTIVE' ? undefined : now,
      endReason,
      npcState: { ...transition.nextState.npcState },
      runtimeState: transition.nextState,
      eventSequence: sequence - 1,
      commandReceipts: [...session.commandReceipts, receipt],
    };
    const stored = this.sessionRepository.commitSessionUpdate(sessionId, nextSession, eventList);
    return { duplicate: false, transition, events: eventList, session: stored, view: this.getSessionView(sessionId) };
  }

  cancelSession(sessionId: string, reason = 'Session cancelled by trainee.'): SimulationSessionRecord {
    const session = this.getSession(sessionId);
    if (session.status === 'CANCELLED') return session;
    if (isTerminalSessionStatus(session.status)) throw new TrainingSessionServiceError('SESSION_NOT_ACTIVE', `Session ${sessionId} is already ${session.status}.`);
    const timestamp = this.clock.now();
    const before = sessionSnapshotFromRecord(session);
    const after = { ...before, status: 'CANCELLED' as const };
    const event = eventFactory(`${sessionId}:event:${session.eventSequence + 1}`, sessionId, session.eventSequence + 1, timestamp, 'SYSTEM', 'SESSION_CANCELLED', reason, before, after, { reason });
    const nextSession: SimulationSessionRecord = { ...session, status: 'CANCELLED', endedAt: timestamp, endReason: reason, eventSequence: session.eventSequence + 1 };
    return this.sessionRepository.commitSessionUpdate(sessionId, nextSession, [event]);
  }

  completeSession(sessionId: string, reason = 'Scenario success candidate accepted.'): SimulationSessionRecord {
    const session = this.getSession(sessionId);
    if (session.status === 'COMPLETED') return session;
    if (session.status !== 'ACTIVE') throw new TrainingSessionServiceError('SESSION_NOT_ACTIVE', `Session ${sessionId} is already ${session.status}.`);
    if (session.runtimeState.status !== 'SUCCESS_CANDIDATE') throw new TrainingSessionServiceError('SESSION_NOT_SUCCESS_CANDIDATE', 'Only a SUCCESS_CANDIDATE runtime may be completed.');
    const timestamp = this.clock.now();
    const before = sessionSnapshotFromRecord(session);
    const after = { ...before, status: 'COMPLETED' as const };
    const event = eventFactory(`${sessionId}:event:${session.eventSequence + 1}`, sessionId, session.eventSequence + 1, timestamp, 'SYSTEM', 'SESSION_COMPLETED', reason, before, after, { reason });
    const nextSession: SimulationSessionRecord = { ...session, status: 'COMPLETED', endedAt: timestamp, endReason: reason, eventSequence: session.eventSequence + 1 };
    return this.sessionRepository.commitSessionUpdate(sessionId, nextSession, [event]);
  }

  getSessionView(sessionId: string): TraineeSessionView {
    const session = this.getSession(sessionId);
    const runtimeView = this.scenarioEngine.getRuntimeView(session.runtimeState);
    const scenario: TraineeScenarioView = {
      ...runtimeView,
      npc: {
        npcId: runtimeView.npc.npcId,
        emotion: runtimeView.npc.emotion,
        trust: runtimeView.npc.trust,
        interest: runtimeView.npc.interest,
        pressure: runtimeView.npc.pressure,
        intent: runtimeView.npc.intent,
      },
      objectiveProgress: runtimeView.objectiveProgress.map(({ objectiveId, label, status }) => ({ objectiveId, label, status })),
      riskHits: runtimeView.riskHits.map(({ severity, verificationState }) => ({ severity, verificationState })),
    };
    const timeline = this.getTimeline(sessionId);
    return deepFreeze({ sessionId, status: session.status, startedAt: session.startedAt, endedAt: session.endedAt, scenario, timeline });
  }

  getTimeline(sessionId: string): readonly TraineeTimelineEvent[] {
    this.getSession(sessionId);
    return Object.freeze(this.sessionRepository.listEvents(sessionId).map((event) => ({ eventId: event.eventId, sessionId: event.sessionId, sequence: event.sequence, timestamp: event.timestamp, actor: event.actor, eventType: event.eventType, message: event.message })));
  }

  replaySession(sessionId: string): SessionReplayResult {
    return this.replayEngine.replay(sessionId);
  }
}

export const createMockTrainingSessionService = (scenarioRepository: TrainingRepository): TrainingSessionApplicationService => new TrainingSessionApplicationService({ scenarioRepository });
