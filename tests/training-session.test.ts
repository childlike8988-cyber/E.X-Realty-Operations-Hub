import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { InMemoryTrainingRepository, type TrainingRepository } from '@/features/training/repository';
import { mvpTrainingScenarios } from '@/features/training/scenarios';
import { isValidSessionLifecycleTransition } from '@/features/training/session-types';
import type { TrainingSessionEvent } from '@/features/training/session-events';
import { InMemoryTrainingSessionRepository, TrainingSessionRepositoryError } from '@/features/training/session-repository';
import { SessionReplayIntegrityError, TrainingSessionReplay } from '@/features/training/session-replay';
import { TrainingSessionApplicationService } from '@/features/training/session-service';
import { MockTrainingAIProvider } from '@/features/training/providers/mock-training-ai-provider';

function fixedClock() {
  let tick = 0;
  return { now: () => `2026-02-01T00:00:${String(tick++).padStart(2, '0')}.000Z` };
}

function setup() {
  const scenarioRepository = new InMemoryTrainingRepository();
  const sessionRepository = new InMemoryTrainingSessionRepository(scenarioRepository);
  let sessionNumber = 0;
  const service = new TrainingSessionApplicationService({
    scenarioRepository,
    sessionRepository,
    clock: fixedClock(),
    sessionIdFactory: () => `stage3-session-${++sessionNumber}`,
  });
  return { scenarioRepository, sessionRepository, service };
}

function start(service: TrainingSessionApplicationService, scenarioId = 'S01') {
  return service.startSession({ scenarioId, organizationId: 'mock-org', agentRef: 'mock-agent-01' });
}

function cloneEvent(event: TrainingSessionEvent, overrides: Partial<TrainingSessionEvent> = {}): TrainingSessionEvent {
  return { ...event, ...overrides } as TrainingSessionEvent;
}

function switchingRepository() {
  const base = new InMemoryTrainingRepository();
  let currentVersionChanged = false;
  const repository: TrainingRepository = {
    listScenarios: () => base.listScenarios(),
    getScenario: (scenarioId) => {
      const scenario = base.getScenario(scenarioId);
      return scenario && currentVersionChanged && scenarioId === 'S01' ? { ...scenario, currentVersionId: 'S01-v2' } : scenario;
    },
    getScenarioVersion: (scenarioId, versionId) => base.getScenarioVersion(scenarioId, versionId),
    saveSession: (session) => base.saveSession(session),
    getSession: (sessionId) => base.getSession(sessionId),
    appendEvent: (event) => base.appendEvent(event),
    listEvents: (sessionId) => base.listEvents(sessionId),
    saveResult: (result) => base.saveResult(result),
    getResult: (resultId) => base.getResult(resultId),
    saveSkillProfile: (profile) => base.saveSkillProfile(profile),
    getSkillProfile: (organizationId, agentRef) => base.getSkillProfile(organizationId, agentRef),
    saveRecommendation: (recommendation) => base.saveRecommendation(recommendation),
    listRecommendations: (organizationId, agentRef) => base.listRecommendations(organizationId, agentRef),
  };
  return { repository, switchCurrentVersion: () => { currentVersionChanged = true; } };
}

describe('Training Stage 3 Simulation Session + append-only events', () => {
  it('starts a session with an exact published scenario version and first event', () => {
    const { service, sessionRepository } = setup();
    const session = service.startSession({ scenarioId: 'S03', scenarioVersionId: 'S03-v1', sessionId: 'session-exact' });
    expect(session.status).toBe('ACTIVE');
    expect(session.scenarioVersionId).toBe('S03-v1');
    expect(session.initialNpcState).toEqual(session.npcState);
    expect(session.contextSnapshot.length).toBeGreaterThanOrEqual(4);
    expect(sessionRepository.listEvents(session.sessionId)[0].eventType).toBe('SESSION_STARTED');
  });

  it('keeps an existing session on its locked version when the catalog current version changes', () => {
    const changing = switchingRepository();
    const sessionRepository = new InMemoryTrainingSessionRepository(changing.repository);
    const service = new TrainingSessionApplicationService({ scenarioRepository: changing.repository, sessionRepository, clock: fixedClock(), sessionIdFactory: () => 'session-version-lock' });
    const session = service.startSession({ scenarioId: 'S01', scenarioVersionId: 'S01-v1' });
    changing.switchCurrentVersion();
    expect(service.getSession(session.sessionId).scenarioVersionId).toBe('S01-v1');
    expect(service.replaySession(session.sessionId).state.scenarioVersionId).toBe('S01-v1');
  });

  it('accepts only the explicit forward lifecycle transitions', () => {
    expect(isValidSessionLifecycleTransition('CREATED', 'ACTIVE')).toBe(true);
    expect(isValidSessionLifecycleTransition('ACTIVE', 'COMPLETED')).toBe(true);
    expect(isValidSessionLifecycleTransition('ACTIVE', 'FAILED')).toBe(true);
    expect(isValidSessionLifecycleTransition('ACTIVE', 'CANCELLED')).toBe(true);
    expect(isValidSessionLifecycleTransition('COMPLETED', 'ACTIVE')).toBe(false);
    expect(isValidSessionLifecycleTransition('CANCELLED', 'FAILED')).toBe(false);
  });

  it('rejects an arbitrary lifecycle mutation through the session repository', () => {
    const { service, sessionRepository } = setup();
    const session = start(service);
    expect(() => sessionRepository.commitSessionUpdate(session.sessionId, { ...session, status: 'CREATED' }, [])).toThrow(TrainingSessionRepositoryError);
  });

  it('does not reactivate a terminal session', () => {
    const { service, sessionRepository } = setup();
    const session = start(service);
    service.cancelSession(session.sessionId);
    const cancelled = service.getSession(session.sessionId);
    expect(cancelled.status).toBe('CANCELLED');
    expect(() => sessionRepository.commitSessionUpdate(session.sessionId, { ...cancelled, status: 'ACTIVE' }, [])).toThrow(/cannot transition/i);
  });

  it('keeps event sequences strictly increasing', () => {
    const { service, sessionRepository } = setup();
    const session = start(service);
    service.submitTraineeMessage(session.sessionId, { commandId: 'command-1', text: '探索需求', action: { kind: 'ASK_NEEDS' } });
    const events = sessionRepository.listEvents(session.sessionId);
    expect(events.map((event) => event.sequence)).toEqual(events.map((_, index) => index + 1));
  });

  it('rejects a duplicate append sequence', () => {
    const { service, sessionRepository } = setup();
    const session = start(service);
    const result = service.submitTraineeMessage(session.sessionId, { commandId: 'command-1', text: '探索需求', action: { kind: 'ASK_NEEDS' } });
    const current = service.getSession(session.sessionId);
    const duplicate = cloneEvent(result.events[0], { eventId: 'duplicate-sequence', sequence: current.eventSequence - 1 });
    expect(() => sessionRepository.appendEventBatch(session.sessionId, [duplicate])).toThrow(/append at sequence/i);
  });

  it('rejects an event id that was already appended in an earlier batch', () => {
    const { service, sessionRepository } = setup();
    const session = start(service);
    const first = service.submitTraineeMessage(session.sessionId, { commandId: 'command-1', text: '探索需求', action: { kind: 'ASK_NEEDS' } });
    const current = service.getSession(session.sessionId);
    expect(() => sessionRepository.appendEventBatch(session.sessionId, [cloneEvent(first.events[0], { sequence: current.eventSequence + 1 })])).toThrow(/event id already exists/i);
  });

  it('exposes no updateEvent or deleteEvent repository methods', () => {
    const { sessionRepository } = setup();
    expect('updateEvent' in sessionRepository).toBe(false);
    expect('deleteEvent' in sessionRepository).toBe(false);
  });

  it('rejects any event after a terminal session', () => {
    const { service, sessionRepository } = setup();
    const session = start(service);
    service.cancelSession(session.sessionId);
    const terminal = sessionRepository.listEvents(session.sessionId).at(-1);
    expect(terminal).toBeDefined();
    expect(() => sessionRepository.appendEventBatch(session.sessionId, [cloneEvent(terminal as TrainingSessionEvent, { eventId: 'after-terminal', sequence: terminal!.sequence + 1 })])).toThrow(/terminal/i);
  });

  it('persists one ordered event batch for an interaction', () => {
    const { service, sessionRepository } = setup();
    const session = start(service);
    const result = service.submitTraineeMessage(session.sessionId, { commandId: 'command-1', text: '請問家庭需求？', action: { kind: 'ASK_NEEDS' } });
    expect(result.events.slice(0, 3).map((event) => event.eventType)).toEqual(['TRAINEE_ACTION', 'NPC_RESPONSE', 'STATE_CHANGED']);
    expect(sessionRepository.listEvents(session.sessionId).length).toBe(result.events.length + 1);
  });

  it('validates the whole batch before appending anything', () => {
    const { service, sessionRepository } = setup();
    const session = start(service);
    const first = service.submitTraineeMessage(session.sessionId, { commandId: 'command-1', text: '探索需求', action: { kind: 'ASK_NEEDS' } });
    const current = service.getSession(session.sessionId);
    const template = first.events[0];
    const invalidBatch = [
      cloneEvent(template, { eventId: 'atomic-a', sequence: current.eventSequence + 1 }),
      cloneEvent(template, { eventId: 'atomic-b', sequence: current.eventSequence + 3 }),
    ];
    const before = sessionRepository.listEvents(session.sessionId);
    expect(() => sessionRepository.appendEventBatch(session.sessionId, invalidBatch)).toThrow(TrainingSessionRepositoryError);
    expect(sessionRepository.listEvents(session.sessionId)).toEqual(before);
  });

  it('does not duplicate an interaction when the command id is retried', () => {
    const { service, sessionRepository } = setup();
    const session = start(service);
    const input = { commandId: 'retryable-command', text: '探索需求', action: { kind: 'ASK_NEEDS' as const } };
    const first = service.submitTraineeMessage(session.sessionId, input);
    const count = sessionRepository.listEvents(session.sessionId).length;
    const retry = service.submitTraineeMessage(session.sessionId, input);
    expect(retry.duplicate).toBe(true);
    expect(retry.transition.nextState).toEqual(first.transition.nextState);
    expect(sessionRepository.listEvents(session.sessionId)).toHaveLength(count);
  });

  it('accepts a different command id as a new interaction', () => {
    const { service, sessionRepository } = setup();
    const session = start(service);
    service.submitTraineeMessage(session.sessionId, { commandId: 'command-1', text: '探索需求', action: { kind: 'ASK_NEEDS' } });
    const before = sessionRepository.listEvents(session.sessionId).length;
    const second = service.submitTraineeMessage(session.sessionId, { commandId: 'command-2', text: '詢問付款', action: { kind: 'ASK_FINANCING' } });
    expect(second.duplicate).toBe(false);
    expect(sessionRepository.listEvents(session.sessionId).length).toBeGreaterThan(before);
  });

  it('replays NPC state, revealed information, and objective progress from structured events', () => {
    const { service } = setup();
    const session = start(service);
    service.submitTraineeMessage(session.sessionId, { commandId: 'command-1', text: '探索需求', action: { kind: 'ASK_NEEDS' } });
    service.submitTraineeMessage(session.sessionId, { commandId: 'command-2', text: '詢問付款', action: { kind: 'ASK_FINANCING' } });
    const stored = service.getSession(session.sessionId);
    const replayed = service.replaySession(session.sessionId);
    expect(replayed.state.status).toBe('COMPLETED');
    expect(replayed.state.npcState).toEqual(stored.npcState);
    expect(replayed.state.revealedInformationIds).toEqual(stored.runtimeState.revealedInformationIds);
    expect(replayed.state.objectiveProgress).toEqual(stored.runtimeState.objectiveProgress);
    expect(replayed.state.eventsApplied).toBe(stored.eventSequence);
  });

  it('replays risk state and FAILED terminal status without provider calls', () => {
    const { service } = setup();
    const session = start(service, 'S04');
    service.submitTraineeMessage(session.sessionId, { commandId: 'risk-command', text: '現在買就一定會漲', action: { kind: 'PRESSURE_CLOSE' } });
    const replayed = service.replaySession(session.sessionId);
    expect(replayed.state.status).toBe('FAILED');
    expect(replayed.state.riskHits).toHaveLength(1);
    expect(replayed.state.riskHits[0].verificationState).toBe('NEEDS_VERIFICATION');
    const source = readFileSync(path.join(process.cwd(), 'src/features/training/session-replay.ts'), 'utf8');
    expect(source).not.toMatch(/MockConversationAdapter|classifyMockAction|TrainingAIProvider/);
  });

  it('reconstructs a CANCELLED terminal status and terminal event', () => {
    const { service, sessionRepository } = setup();
    const session = start(service);
    service.cancelSession(session.sessionId, 'Manual exit');
    const replayed = service.replaySession(session.sessionId);
    expect(replayed.state.status).toBe('CANCELLED');
    expect(sessionRepository.listEvents(session.sessionId).at(-1)?.eventType).toBe('SESSION_CANCELLED');
  });

  it('keeps SUCCESS_CANDIDATE, COMPLETED, and the terminal event aligned', () => {
    const { service, sessionRepository } = setup();
    const session = start(service, 'S01');
    service.submitTraineeMessage(session.sessionId, { commandId: 'needs', text: '探索需求', action: { kind: 'ASK_NEEDS' } });
    service.submitTraineeMessage(session.sessionId, { commandId: 'finance', text: '詢問付款', action: { kind: 'ASK_FINANCING' } });
    const stored = service.getSession(session.sessionId);
    const events = sessionRepository.listEvents(session.sessionId);
    expect(stored.status).toBe('COMPLETED');
    expect(events.some((event) => event.eventType === 'SUCCESS_CANDIDATE')).toBe(true);
    expect(events.at(-1)?.eventType).toBe('SESSION_COMPLETED');
    expect(events.at(-1)?.stateAfter.status).toBe('COMPLETED');
  });

  it('keeps FAILURE_CANDIDATE, FAILED, and the terminal event aligned', () => {
    const { service, sessionRepository } = setup();
    const session = start(service, 'S05');
    service.submitTraineeMessage(session.sessionId, { commandId: 'risk', text: '現在買就一定會漲', action: { kind: 'PRESSURE_CLOSE' } });
    const events = sessionRepository.listEvents(session.sessionId);
    expect(service.getSession(session.sessionId).status).toBe('FAILED');
    expect(events.some((event) => event.eventType === 'FAILURE_CANDIDATE')).toBe(true);
    expect(events.at(-1)?.eventType).toBe('SESSION_FAILED');
    expect(events.at(-1)?.stateAfter.status).toBe('FAILED');
  });

  it('uses the injected deterministic clock for session and event timestamps', () => {
    const { service, sessionRepository } = setup();
    const session = start(service);
    const started = sessionRepository.listEvents(session.sessionId)[0];
    expect(session.startedAt).toBe('2026-02-01T00:00:00.000Z');
    expect(started.timestamp).toBe(session.startedAt);
    service.submitTraineeMessage(session.sessionId, { commandId: 'clock-command', text: '建立信任', action: { kind: 'BUILD_TRUST' } });
    expect(sessionRepository.listEvents(session.sessionId).at(-1)?.timestamp).toBe('2026-02-01T00:00:01.000Z');
  });

  it('fails closed when a sequence is missing during replay', () => {
    const { service, sessionRepository } = setup();
    const session = start(service);
    service.submitTraineeMessage(session.sessionId, { commandId: 'command-1', text: '探索需求', action: { kind: 'ASK_NEEDS' } });
    const events = sessionRepository.listEvents(session.sessionId);
    const replay = new TrainingSessionReplay(service.scenarioEngine, sessionRepository);
    expect(() => replay.replayEvents(session, events.filter((event) => event.sequence !== 2))).toThrowError(new SessionReplayIntegrityError('MISSING_SEQUENCE', 'Missing event sequence 2.'));
  });

  it('fails closed when a sequence is duplicated during replay', () => {
    const { service, sessionRepository } = setup();
    const session = start(service);
    service.submitTraineeMessage(session.sessionId, { commandId: 'command-1', text: '探索需求', action: { kind: 'ASK_NEEDS' } });
    const events = sessionRepository.listEvents(session.sessionId);
    const replay = new TrainingSessionReplay(service.scenarioEngine, sessionRepository);
    const duplicate = cloneEvent(events[1], { eventId: 'duplicate-seq' });
    expect(() => replay.replayEvents(session, [...events, duplicate])).toThrow(/Duplicate event sequence/);
  });

  it('fails closed when events are out of order', () => {
    const { service, sessionRepository } = setup();
    const session = start(service);
    service.submitTraineeMessage(session.sessionId, { commandId: 'command-1', text: '探索需求', action: { kind: 'ASK_NEEDS' } });
    const events = [...sessionRepository.listEvents(session.sessionId)];
    [events[1], events[2]] = [events[2], events[1]];
    const replay = new TrainingSessionReplay(service.scenarioEngine, sessionRepository);
    expect(() => replay.replayEvents(session, events)).toThrow(/out of order/i);
  });

  it('fails closed for an event belonging to another session', () => {
    const { service, sessionRepository } = setup();
    const session = start(service);
    service.submitTraineeMessage(session.sessionId, { commandId: 'command-1', text: '探索需求', action: { kind: 'ASK_NEEDS' } });
    const events = sessionRepository.listEvents(session.sessionId);
    const replay = new TrainingSessionReplay(service.scenarioEngine, sessionRepository);
    expect(() => replay.replayEvents(session, [events[0], cloneEvent(events[1], { eventId: 'wrong-session', sessionId: 'other-session' }), ...events.slice(2)])).toThrow(/another session/i);
  });

  it('fails closed when a state transition payload is tampered with', () => {
    const { service, sessionRepository } = setup();
    const session = start(service);
    service.submitTraineeMessage(session.sessionId, { commandId: 'command-1', text: '探索需求', action: { kind: 'ASK_NEEDS' } });
    const events = [...sessionRepository.listEvents(session.sessionId)];
    const index = events.findIndex((event) => event.eventType === 'STATE_CHANGED');
    const stateChanged = events[index];
    const stateDelta = (stateChanged as Extract<TrainingSessionEvent, { eventType: 'STATE_CHANGED' }>).payload.stateDelta;
    events[index] = cloneEvent(stateChanged, { payload: { stateDelta: { ...stateDelta, trust: 999 } } });
    const replay = new TrainingSessionReplay(service.scenarioEngine, sessionRepository);
    expect(() => replay.replayEvents(session, events)).toThrow(/does not match/i);
  });

  it('keeps the trainee view free of unrevealed, system-only, and negotiation-boundary data', () => {
    const { service } = setup();
    const session = start(service);
    const view = service.getSessionView(session.sessionId);
    const serialized = JSON.stringify(view);
    expect(serialized).not.toContain('月付負擔敏感');
    expect(serialized).not.toContain('系統判定資料');
    expect(serialized).not.toContain('需要先建立信任與需求脈絡');
    expect(serialized).not.toContain('negotiationPosition');
    expect(serialized).not.toContain('ruleId');
    expect(view.scenario.visibleInformation.some((item) => item.informationId.includes('SYSTEM'))).toBe(false);
  });

  it('keeps the safe timeline projection free of internal snapshots and rule ids', () => {
    const { service } = setup();
    const session = start(service);
    service.submitTraineeMessage(session.sessionId, { commandId: 'risk-command', text: '現在買就一定會漲', action: { kind: 'PRESSURE_CLOSE' } });
    const timeline = service.getTimeline(session.sessionId);
    expect(JSON.stringify(timeline)).not.toContain('stateBefore');
    expect(JSON.stringify(timeline)).not.toContain('S01-R1');
  });

  it('captures minimal replay context with source, time, and verification metadata', () => {
    const { service } = setup();
    const session = start(service);
    expect(session.contextSnapshot.every((item) => item.refId && item.capturedAt && item.verificationState)).toBe(true);
    expect(session.contextSnapshot.some((item) => item.kind === 'KNOWLEDGE' && item.verificationState === 'NEEDS_VERIFICATION')).toBe(true);
  });

  it('keeps provider output from owning session lifecycle state', async () => {
    const provider = new MockTrainingAIProvider();
    const session = start(setup().service);
    const output = await provider.generateNpcResponse({ session: { sessionId: session.sessionId, organizationId: session.organizationId, scenarioId: session.scenarioId, scenarioVersionId: session.scenarioVersionId, agentRef: session.agentRef, startedAt: session.startedAt, status: 'IN_PROGRESS', npcState: mvpTrainingScenarios[0].npc, objectiveState: [], riskState: [], eventSequence: 1, allowedContextSnapshot: session.allowedContextSnapshot }, npc: mvpTrainingScenarios[0].npc, traineeMessage: '測試' });
    expect(output).not.toHaveProperty('status');
    expect(output.isMock).toBe(true);
  });

  it('keeps Customer/PII and persistence changes outside the Stage 3 modules', () => {
    const files = ['session-types.ts', 'session-events.ts', 'session-repository.ts', 'session-replay.ts', 'session-service.ts'].map((file) => readFileSync(path.join(process.cwd(), 'src/features/training', file), 'utf8')).join('\n');
    expect(files).not.toMatch(/TrainingCustomer|CustomerTrainingProfile|TrainingCRM/);
    expect(files).not.toMatch(/phone|email|identityNumber|privateCrm/i);
    expect(files).not.toMatch(/prisma|migration/i);
  });

  it('retains Stage 1 and Stage 2 scenario catalog and engine contracts', () => {
    const { service, scenarioRepository } = setup();
    expect(scenarioRepository.listScenarios()).toHaveLength(5);
    const session = start(service, 'S05');
    const result = service.submitTraineeMessage(session.sessionId, { commandId: 'stage2-action', text: '建立信任', action: { kind: 'BUILD_TRUST' } });
    expect(result.transition.nextState.npcState.trust).toBeGreaterThan(result.transition.previousState.npcState.trust);
  });
});
