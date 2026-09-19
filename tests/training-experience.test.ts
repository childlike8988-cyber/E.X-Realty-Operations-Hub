import { afterEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { InMemoryTrainingRepository } from '@/features/training/repository';
import { TrainingSessionApplicationService } from '@/features/training/session-service';
import { TrainingSessionReplay } from '@/features/training/session-replay';
import { createTrainingSessionReader } from '@/features/training/evaluation/session-reader';
import { InMemoryTrainingResultRepository } from '@/features/training/evaluation/result-repository';
import { HybridEvaluationEngine } from '@/features/training/evaluation/engine';
import { TrainingExperienceService } from '@/features/training/training-experience';
import { mvpTrainingScenarios } from '@/features/training/scenarios';
import { getScenarioBehavior } from '@/features/training/scenario-behaviors';

afterEach(() => vi.unstubAllGlobals());

function fixedClock() {
  let tick = 0;
  return { now: () => '2026-09-19T00:00:' + String(tick++).padStart(2, '0') + '.000Z' };
}

function setup() {
  const catalog = new InMemoryTrainingRepository();
  let sessionNumber = 0;
  const sessions = new TrainingSessionApplicationService({
    scenarioRepository: catalog,
    clock: fixedClock(),
    sessionIdFactory: () => 'experience-session-' + (++sessionNumber),
  });
  const versions = (scenarioId: string, versionId: string) => catalog.getScenarioVersion(scenarioId, versionId);
  const reader = createTrainingSessionReader(sessions.sessionRepository, new TrainingSessionReplay(sessions.scenarioEngine, sessions.sessionRepository));
  const results = new InMemoryTrainingResultRepository(reader, versions);
  const evaluation = new HybridEvaluationEngine({
    sessions: reader,
    versions,
    results,
    knowledge: { getKnowledgeReference: async () => null },
    clock: fixedClock(),
  });
  return { catalog, sessions, reader, results, experience: new TrainingExperienceService({ catalog, sessions, evaluation, results }) };
}

const positiveMessages: Readonly<Record<string, readonly string[]>> = {
  S01: ['想先了解家庭需求與通勤。', '想了解月付與貸款負擔。'],
  S02: ['想說明物件採光與格局。', '我理解你的疑慮。'],
  S03: ['想先看附近成交行情。', '我理解你擔心太貴的疑慮。'],
  S04: ['想確認月付與貸款安排。', '可以一起討論議價條件。'],
  S05: ['想先了解需求與搬遷時程。', '可以用市場行情整理選項。'],
};

function runPositivePath(experience: TrainingExperienceService, scenarioId: string) {
  const workspace = experience.startSession(scenarioId, 'positive-' + scenarioId);
  let sessionId = workspace.session.sessionId;
  for (const [index, message] of positiveMessages[scenarioId].entries()) {
    const next = experience.submitMessage(sessionId, 'positive-' + scenarioId + '-' + index, message);
    sessionId = next.workspace.session.sessionId;
  }
  return sessionId;
}

describe('Stage 5A Five MVP Scenario Experience', () => {
  it('lists exactly the five scenario cards with persona, focus, duration and available completion state', () => {
    const { experience } = setup();
    const cards = experience.listScenarios(new Set(['S01']));
    expect(cards).toHaveLength(5);
    expect(cards.map((card) => card.scenarioId)).toEqual(['S01', 'S02', 'S03', 'S04', 'S05']);
    expect(cards.every((card) => card.persona && card.skillFocus.length > 0 && card.estimatedDurationMinutes > 0)).toBe(true);
    expect(cards.find((card) => card.scenarioId === 'S01')?.completionState).toBe('COMPLETED');
    expect(cards.find((card) => card.scenarioId === 'S02')?.completionState).toBe('NOT_STARTED');
  });

  it('returns a trainee-safe briefing for every scenario without hidden or system-only information', () => {
    const { experience } = setup();
    for (const scenario of mvpTrainingScenarios) {
      const briefing = experience.getBriefing(scenario.scenarioId);
      const serialized = JSON.stringify(briefing);
      const behavior = getScenarioBehavior(scenario.scenarioId, scenario.currentVersionId);
      expect(briefing.objectives.length).toBeGreaterThan(0);
      expect(briefing.knownInformation.every((item) => item.visibility === 'PUBLIC' || item.visibility === 'BRIEFING')).toBe(true);
      for (const information of behavior.information.filter((item) => item.visibility === 'HIDDEN' || item.visibility === 'DISCOVERABLE' || item.visibility === 'SYSTEM_ONLY')) {
        expect(serialized).not.toContain(information.content);
        expect(serialized).not.toContain(information.label);
      }
      expect(serialized).not.toContain(scenario.npc.negotiationBoundary);
    }
  });

  it('starts all five through the canonical Session service and records SESSION_STARTED', () => {
    const { experience, reader } = setup();
    for (const scenario of mvpTrainingScenarios) {
      const workspace = experience.startSession(scenario.scenarioId, 'start-' + scenario.scenarioId);
      expect(workspace.session.status).toBe('ACTIVE');
      expect(reader.getEvents(workspace.session.sessionId)[0]?.eventType).toBe('SESSION_STARTED');
    }
  });

  it('accepts free text through the Mock Conversation Adapter and persists canonical events', () => {
    const { experience, reader } = setup();
    const workspace = experience.startSession('S01', 'text-s01');
    const interaction = experience.submitMessage(workspace.session.sessionId, 'text-command', '想先了解家庭需求與通勤。');
    expect(interaction.reaction.action).toBe('ASK_NEEDS');
    expect(interaction.reaction.response).not.toBe('');
    expect(interaction.reaction.revealedInformation.map((item) => item.informationId)).toContain('S01-SCHOOL-PRIORITY');
    expect(reader.getEvents(workspace.session.sessionId).map((event) => event.eventType)).toContain('TRAINEE_ACTION');
    expect(reader.getEvents(workspace.session.sessionId).map((event) => event.eventType)).toContain('NPC_RESPONSE');
    expect(reader.getEvents(workspace.session.sessionId).map((event) => event.eventType)).toContain('HIDDEN_NEED_REVEALED');
  });

  it('uses one shared experience service for positive S01–S05 paths, terminal sessions and actual evaluation results', async () => {
    const { experience, reader, results } = setup();
    for (const scenario of mvpTrainingScenarios) {
      const sessionId = runPositivePath(experience, scenario.scenarioId);
      expect(experience.getWorkspace(sessionId).session.status).toBe('COMPLETED');
      const result = await experience.evaluateSession(sessionId);
      expect(result.sessionId).toBe(sessionId);
      expect(result.scenarioId).toBe(scenario.scenarioId);
      expect(results.getLatestResult(sessionId)?.resultId).toBe(result.resultId);
      expect(result.evidence.some((evidence) => evidence.references.some((reference) => reference.kind === 'EVENT'))).toBe(true);
      expect(reader.getEvents(sessionId).map((event) => event.eventType)).toContain('HIDDEN_NEED_REVEALED');
      expect(reader.getEvents(sessionId).map((event) => event.eventType)).toContain('OBJECTIVE_PROGRESS');
      expect(reader.getEvents(sessionId).at(-1)?.eventType).toBe('SESSION_COMPLETED');
    }
  });

  it('projects allowed context only from the canonical session snapshot and never exposes raw session data', () => {
    const { experience } = setup();
    const workspace = experience.startSession('S03', 'context-s03');
    expect(workspace.contextTools.map((tool) => tool.kind)).toEqual(expect.arrayContaining(['PROPERTY', 'MARKET', 'REGION', 'KNOWLEDGE']));
    expect(workspace.contextTools.every((tool) => tool.reference && tool.summary)).toBe(true);
    expect(JSON.stringify(workspace)).not.toContain('negotiationBoundary');
    expect(JSON.stringify(workspace)).not.toContain('S03-SYSTEM-RISK');
  });

  it('renders a risk outcome from a real failed Session and recommends review of the same scenario', async () => {
    const { experience, reader } = setup();
    const workspace = experience.startSession('S03', 'risk-s03');
    const interaction = experience.submitMessage(workspace.session.sessionId, 'risk-command', '我保證現在買一定會漲。');
    expect(interaction.workspace.session.status).toBe('FAILED');
    expect(reader.getEvents(workspace.session.sessionId).map((event) => event.eventType)).toContain('RISK_WARNING');
    const result = await experience.evaluateSession(workspace.session.sessionId);
    expect(result.overallState).toBe('REQUIRES_REVIEW');
    expect(result.riskSummary.requiresReview).toBe(true);
    expect(experience.suggestNextScenario(result).scenarioId).toBe('S03');
  });

  it('gives every MVP scenario a shared negative/risk path without a separate UI implementation', () => {
    const { experience, reader } = setup();
    for (const scenario of mvpTrainingScenarios) {
      const workspace = experience.startSession(scenario.scenarioId, 'negative-' + scenario.scenarioId);
      const interaction = experience.submitMessage(workspace.session.sessionId, 'negative-command-' + scenario.scenarioId, '我保證現在買一定會漲。');
      expect(interaction.workspace.session.status).toBe('FAILED');
      expect(interaction.reaction.eventTypes).toContain('RISK_WARNING');
      expect(reader.getEvents(workspace.session.sessionId).at(-1)?.eventType).toBe('SESSION_FAILED');
    }
  });

  it('keeps a zero-interaction cancelled Session evidence-insufficient while preserving the knowledge fail-closed overall state', async () => {
    const { experience } = setup();
    const workspace = experience.startSession('S02', 'insufficient-s02');
    experience.cancelSession(workspace.session.sessionId);
    const result = await experience.evaluateSession(workspace.session.sessionId);
    expect(result.overallState).toBe('NEEDS_VERIFICATION');
    expect(result.overallScore).toBeNull();
    expect(result.dimensionResults.every((dimension) => dimension.state === 'INSUFFICIENT_EVIDENCE')).toBe(true);
  });

  it('cancels through the canonical lifecycle and does not fabricate a completed Result', async () => {
    const { experience, reader } = setup();
    const workspace = experience.startSession('S01', 'cancel-s01');
    const cancelled = experience.cancelSession(workspace.session.sessionId);
    expect(cancelled.session.status).toBe('CANCELLED');
    expect(reader.getEvents(workspace.session.sessionId).at(-1)?.eventType).toBe('SESSION_CANCELLED');
    const result = await experience.evaluateSession(workspace.session.sessionId);
    expect(result.objectiveResult).not.toBe('MET');
    expect(result.sessionId).toBe(workspace.session.sessionId);
  });

  it('does not create Customer mutations, migrations or external AI/network calls', async () => {
    const { experience } = setup();
    const fetchSpy = vi.fn(() => { throw new Error('NETWORK_FORBIDDEN'); });
    vi.stubGlobal('fetch', fetchSpy);
    const sessionId = runPositivePath(experience, 'S01');
    await experience.evaluateSession(sessionId);
    expect(fetchSpy).not.toHaveBeenCalled();
    const root = process.cwd();
    const domainSource = readFileSync(path.join(root, 'src/features/training/training-experience.ts'), 'utf8');
    const uiSource = readFileSync(path.join(root, 'src/components/training/training-scenario-experience.tsx'), 'utf8');
    expect(domainSource + uiSource).not.toMatch(/CustomerSnapshotReader|saveCustomer|updateCustomer|prisma|fetch\(/);
  });

  it('keeps the UI on the application service boundary rather than mutating events or evaluation directly', () => {
    const root = process.cwd();
    const source = readFileSync(path.join(root, 'src/components/training/training-scenario-experience.tsx'), 'utf8');
    expect(source).toContain('experience.submitMessage');
    expect(source).toContain('experience.evaluateSession');
    expect(source).not.toMatch(/appendEvent\(|applyAction\(|evaluateRules\(/);
  });
});
