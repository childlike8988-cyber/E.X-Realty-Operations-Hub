import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { mvpTrainingScenarios } from '@/features/training/scenarios';
import { InMemoryTrainingRepository } from '@/features/training/repository';
import { MockConversationAdapter, classifyMockAction } from '@/features/training/mock-conversation-adapter';
import { ScenarioEngine } from '@/features/training/scenario-engine';
import type { ScenarioRuntimeState } from '@/features/training/engine-types';
import type { SimulationSession } from '@/features/training/types';

function setup() {
  const repository = new InMemoryTrainingRepository();
  return { repository, engine: new ScenarioEngine(repository) };
}

function runtimeFor(engine: ScenarioEngine, scenarioId: string): ScenarioRuntimeState {
  return engine.createRuntime({ scenarioId, organizationId: 'mock-org', agentRef: 'mock-agent-01' });
}

describe('Training Stage 2 Scenario + NPC Engine', () => {
  it('resolves an exact published scenario version', () => {
    const { engine } = setup();
    expect(engine.resolveScenario('S03', 'S03-v1').version.scenarioVersionId).toBe('S03-v1');
    expect(() => engine.resolveScenario('S03', 'S01-v1')).toThrow(/scenario version/i);
  });

  it('keeps the published definition immutable', () => {
    const { repository } = setup();
    const version = repository.getScenarioVersion('S01', 'S01-v1');
    expect(version && Object.isFrozen(version)).toBe(true);
    expect(() => { (version as unknown as { status: string }).status = 'DRAFT'; }).toThrow();
  });

  it('omits hidden information from the initial safe view', () => {
    const { engine } = setup();
    const view = engine.getRuntimeView(runtimeFor(engine, 'S01'));
    expect(view.visibleInformation.some((item) => item.informationId === 'S01-MONTHLY-PAYMENT')).toBe(false);
    expect(view.visibleInformation.some((item) => item.content.includes('月付負擔敏感'))).toBe(false);
    expect(view.hiddenInformationCount).toBeGreaterThan(0);
  });

  it('never exposes SYSTEM_ONLY information to the trainee view', () => {
    const { engine } = setup();
    const view = engine.getRuntimeView(runtimeFor(engine, 'S01'));
    expect(view.visibleInformation.some((item) => item.informationId.includes('SYSTEM'))).toBe(false);
    expect(view.visibleInformation.some((item) => item.content.includes('系統判定資料'))).toBe(false);
    expect(view.systemInformationCount).toBeGreaterThan(0);
  });

  it('reveals a qualifying hidden need through the correct action', () => {
    const { engine } = setup();
    const transition = engine.applyAction(runtimeFor(engine, 'S01'), { kind: 'ASK_FINANCING', text: '主要擔心每月負擔嗎？' });
    expect(transition.revealedInformation.map((item) => item.informationId)).toContain('S01-MONTHLY-PAYMENT');
    expect(transition.nextState.revealedInformationIds).toContain('S01-MONTHLY-PAYMENT');
  });

  it('does not reveal a trust-gated need for an insufficient action context', () => {
    const { engine } = setup();
    const transition = engine.applyAction(runtimeFor(engine, 'S01'), { kind: 'ASK_BUDGET' });
    expect(transition.revealedInformation.some((item) => item.informationId === 'S01-MONTHLY-PAYMENT')).toBe(false);
    expect(transition.nextState.revealedInformationIds).not.toContain('S01-MONTHLY-PAYMENT');
  });

  it('clamps trust, interest, and pressure to 0..100', () => {
    const { engine } = setup();
    let runtime = runtimeFor(engine, 'S01');
    for (let index = 0; index < 20; index += 1) runtime = engine.applyAction(runtime, { kind: 'BUILD_TRUST' }).nextState;
    expect(runtime.npcState.trust).toBeLessThanOrEqual(100);
    for (let index = 0; index < 20; index += 1) runtime = engine.applyAction(runtime, { kind: 'PRESSURE_CLOSE' }).nextState;
    expect(runtime.npcState.trust).toBeGreaterThanOrEqual(0);
    expect(runtime.npcState.interest).toBeGreaterThanOrEqual(0);
    expect(runtime.npcState.pressure).toBeLessThanOrEqual(100);
  });

  it('does not mutate the immutable NPC definition', () => {
    const { engine } = setup();
    const definition = mvpTrainingScenarios[0].npc;
    const before = JSON.stringify(definition);
    engine.applyAction(runtimeFor(engine, 'S01'), { kind: 'ASK_FINANCING' });
    expect(JSON.stringify(definition)).toBe(before);
    expect(definition.trust).toBe(35);
  });

  it('produces the same deterministic output for the same input', () => {
    const { engine } = setup();
    const action = { kind: 'ASK_NEEDS' as const, text: '請問家庭需求？' };
    const first = engine.applyAction(runtimeFor(engine, 'S02'), action);
    const second = engine.applyAction(runtimeFor(engine, 'S02'), action);
    expect(first.response).toBe(second.response);
    expect(first.stateDelta).toEqual(second.stateDelta);
    expect(first.nextState).toEqual(second.nextState);
  });

  it('returns previous state, next state, and an auditable state delta', () => {
    const { engine } = setup();
    const transition = engine.applyAction(runtimeFor(engine, 'S01'), { kind: 'BUILD_TRUST' });
    expect(transition.previousState.npcState.trust).toBe(35);
    expect(transition.nextState.npcState.trust).toBe(transition.previousState.npcState.trust + transition.stateDelta.trust);
    expect(transition.nextState.turnCount).toBe(1);
  });

  it('emits a hidden-need event candidate when information is revealed', () => {
    const { engine } = setup();
    const transition = engine.applyAction(runtimeFor(engine, 'S01'), { kind: 'ASK_NEEDS' });
    expect(transition.triggeredEvents.some((event) => event.eventType === 'HIDDEN_NEED_REVEALED')).toBe(true);
  });

  it('emits risk and NEEDS_VERIFICATION candidates for a risky action', () => {
    const { engine } = setup();
    const transition = engine.applyAction(runtimeFor(engine, 'S03'), { kind: 'PRESSURE_CLOSE', text: '現在買就一定會漲' });
    expect(transition.riskHits).toHaveLength(1);
    expect(transition.riskHits[0].verificationState).toBe('NEEDS_VERIFICATION');
    expect(transition.triggeredEvents.map((event) => event.eventType)).toEqual(expect.arrayContaining(['RISK_WARNING', 'NEEDS_VERIFICATION']));
  });

  it('advances an objective after a positive action', () => {
    const { engine } = setup();
    const transition = engine.applyAction(runtimeFor(engine, 'S01'), { kind: 'ASK_NEEDS' });
    expect(transition.objectiveProgress.find((objective) => objective.objectiveId === 'S01-O1')?.status).toBe('MET');
    expect(transition.triggeredEvents.some((event) => event.eventType === 'OBJECTIVE_PROGRESS')).toBe(true);
  });

  it('degrades trust on a negative pressure-close action', () => {
    const { engine } = setup();
    const transition = engine.applyAction(runtimeFor(engine, 'S01'), { kind: 'PRESSURE_CLOSE' });
    expect(transition.stateDelta.trust).toBeLessThan(0);
    expect(transition.triggeredEvents.some((event) => event.eventType === 'TRUST_DROPPED')).toBe(true);
  });

  it('requires scenario objectives before returning a success candidate', () => {
    const { engine } = setup();
    const first = engine.applyAction(runtimeFor(engine, 'S01'), { kind: 'ASK_NEEDS' });
    expect(first.outcome).toBe('IN_PROGRESS');
    const second = engine.applyAction(first.nextState, { kind: 'ASK_FINANCING' });
    expect(second.outcome).toBe('SUCCESS_CANDIDATE');
  });

  it('returns a failure candidate when a scenario failure condition is met', () => {
    const { engine } = setup();
    const transition = engine.applyAction(runtimeFor(engine, 'S05'), { kind: 'PRESSURE_CLOSE' });
    expect(transition.outcome).toBe('FAILURE_CANDIDATE');
  });

  it('runs all five MVP scenarios through the same engine architecture', () => {
    const { engine } = setup();
    for (const scenario of mvpTrainingScenarios) {
      const runtime = runtimeFor(engine, scenario.scenarioId);
      const transition = engine.applyAction(runtime, { kind: 'ASK_NEEDS' });
      expect(transition.nextState.scenarioId).toBe(scenario.scenarioId);
      expect(transition.nextState.npcState.npcId).toBe(scenario.npc.npcId);
    }
  });

  it('keeps Customer outside the Stage 2 engine boundary', () => {
    const trainingFiles = [
      'src/features/training/engine-types.ts',
      'src/features/training/npc-engine.ts',
      'src/features/training/scenario-engine.ts',
      'src/features/training/scenario-behaviors.ts',
    ].map((file) => readFileSync(path.join(process.cwd(), file), 'utf8')).join('\n');
    expect(trainingFiles).not.toMatch(/from\s+['"].*customer/i);
    expect(trainingFiles).not.toMatch(/TrainingCustomer|CustomerTrainingProfile|TrainingCRM/);
  });

  it('keeps external AI SDKs and network calls out of the engine', () => {
    const engineFiles = ['engine-types.ts', 'npc-engine.ts', 'scenario-engine.ts', 'scenario-behaviors.ts', 'mock-conversation-adapter.ts'].map((file) => readFileSync(path.join(process.cwd(), 'src/features/training', file), 'utf8')).join('\n');
    expect(engineFiles).not.toMatch(/openai|anthropic|@google\/generative-ai|fetch\s*\(/i);
  });

  it('marks compliance risk context as NEEDS_VERIFICATION rather than authoritative', () => {
    const { engine } = setup();
    const transition = engine.applyAction(runtimeFor(engine, 'S04'), { kind: 'DISCLOSE_RISK' });
    expect(transition.triggeredEvents.some((event) => event.eventType === 'NEEDS_VERIFICATION' && event.verificationState === 'NEEDS_VERIFICATION')).toBe(true);
  });

  it('accepts structured actions and deterministic text classification in the Mock adapter', () => {
    const { repository, engine } = setup();
    const adapter = new MockConversationAdapter(engine);
    const runtime = runtimeFor(engine, 'S01');
    expect(adapter.isMock).toBe(true);
    expect(classifyMockAction('想了解貸款和月付負擔')).toBe('ASK_FINANCING');
    const transition = adapter.interact(runtime, { text: '請先問需求', action: { kind: 'ASK_NEEDS', text: '請先問需求' } });
    expect(transition.action.kind).toBe('ASK_NEEDS');
    expect(repository.listScenarios()).toHaveLength(5);
  });

  it('preserves the Stage 1 repository lifecycle contract', () => {
    const repository = new InMemoryTrainingRepository();
    const scenario = mvpTrainingScenarios[1];
    const session: SimulationSession = {
      sessionId: 'stage2-regression-session',
      organizationId: 'mock-org',
      scenarioId: scenario.scenarioId,
      scenarioVersionId: scenario.currentVersionId,
      agentRef: 'mock-agent-01',
      startedAt: '2026-01-01T00:00:00.000Z',
      status: 'IN_PROGRESS',
      npcState: scenario.npc,
      objectiveState: [],
      riskState: [],
      eventSequence: 0,
      allowedContextSnapshot: [scenario.propertyRef, scenario.regionRef],
    };
    const saved = repository.saveSession(session);
    expect(repository.getSession(saved.sessionId)?.scenarioVersionId).toBe('S02-v1');
    expect(repository.listEvents(session.sessionId)).toEqual([]);
  });
});
