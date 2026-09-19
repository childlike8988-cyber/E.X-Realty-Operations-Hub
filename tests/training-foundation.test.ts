import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { canUseAsAuthoritativeKnowledge, type SimulationSession, type TrainingEvent, type TrainingResult } from '@/features/training/types';
import { MVP_TRAINING_SCENARIO_IDS, mvpTrainingScenarios } from '@/features/training/scenarios';
import { InMemoryTrainingRepository } from '@/features/training/repository';
import type { AgentScopeReader, MarketSnapshotReader, PropertySnapshotReader, RegionSnapshotReader, VerifiedKnowledgeReader } from '@/features/training/ports';
import { mockTrainingAIProvider } from '@/features/training/providers/mock-training-ai-provider';
import { mockProperties } from '@/features/property-intelligence/mock-properties';
import { mockTransactionRepository } from '@/features/real-price/repositories/mock-transaction-repository';

function sessionFor(index = 0): SimulationSession {
  const scenario = mvpTrainingScenarios[index];
  return {
    sessionId: `training-session-${scenario.scenarioId}`,
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
}

function eventFor(sessionId: string, sequence: number): TrainingEvent {
  return {
    eventId: `${sessionId}-event-${sequence}`,
    sessionId,
    sequence,
    timestamp: `2026-01-01T00:0${sequence}:00.000Z`,
    actor: sequence % 2 === 0 ? 'NPC' : 'AGENT',
    eventType: 'MESSAGE',
    message: `Mock event ${sequence}`,
    stateBefore: {},
    stateAfter: {},
    ruleHits: [],
    evidenceRefs: [],
  };
}

describe('Training Stage 1 domain foundation', () => {
  it('seeds exactly the five approved MVP scenarios with unique IDs', () => {
    expect(mvpTrainingScenarios).toHaveLength(5);
    expect(mvpTrainingScenarios.map((scenario) => scenario.scenarioId)).toEqual([...MVP_TRAINING_SCENARIO_IDS]);
    expect(new Set(mvpTrainingScenarios.map((scenario) => scenario.scenarioId)).size).toBe(5);
    expect(mvpTrainingScenarios.map((scenario) => scenario.name)).toEqual(['首次接待買方', '第一次帶看', '客戶質疑開價高於實價', '買方出低價／議價', '屋主不願降價']);
  });

  it('keeps published scenario versions immutable through repository access', () => {
    const repository = new InMemoryTrainingRepository();
    const version = repository.getScenarioVersion('S01', 'S01-v1');
    expect(version?.status).toBe('PUBLISHED');
    expect(version && Object.isFrozen(version)).toBe(true);
    expect(() => { (version as unknown as { status: string }).status = 'DRAFT'; }).toThrow();
    expect(Object.getOwnPropertyNames(Object.getPrototypeOf(repository))).not.toContain('updateScenarioVersion');
  });

  it('requires sessions to reference an exact published scenario version', () => {
    const repository = new InMemoryTrainingRepository();
    const session = sessionFor();
    expect(repository.saveSession(session).scenarioVersionId).toBe('S01-v1');
    expect(() => repository.saveSession({ ...session, sessionId: 'wrong-version-session', scenarioVersionId: 'S01-v99' })).toThrow(/exact|published|scenario version/i);
  });

  it('appends events in sequence and exposes no update/delete event API', () => {
    const repository = new InMemoryTrainingRepository();
    const session = repository.saveSession(sessionFor());
    repository.appendEvent(eventFor(session.sessionId, 1));
    repository.appendEvent(eventFor(session.sessionId, 2));
    expect(repository.listEvents(session.sessionId).map((event) => event.sequence)).toEqual([1, 2]);
    expect(() => repository.appendEvent(eventFor(session.sessionId, 4))).toThrow(/append/);
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(repository));
    expect(methods).not.toContain('updateEvent');
    expect(methods).not.toContain('deleteEvent');
  });

  it('keeps the repository inside Training and exposes no Customer write', () => {
    const methods = Object.getOwnPropertyNames(InMemoryTrainingRepository.prototype);
    expect(methods.some((method) => /customer|property|market|region/i.test(method))).toBe(false);
    expect(mvpTrainingScenarios[0].npc).not.toHaveProperty('customerRef');
    expect(mvpTrainingScenarios[0].npc).not.toHaveProperty('customerId');
  });

  it('models cross-domain bridges as read-only snapshot readers', () => {
    const propertyReader: PropertySnapshotReader = { getPropertySnapshot: async () => null };
    const marketReader: MarketSnapshotReader = { getMarketSnapshot: async () => null };
    const regionReader: RegionSnapshotReader = { getRegionSnapshot: async () => null };
    const knowledgeReader: VerifiedKnowledgeReader = { getKnowledgeReference: async () => null };
    const agentReader: AgentScopeReader = { getAgentScope: async () => null };
    expect(Object.keys(propertyReader)).toEqual(['getPropertySnapshot']);
    expect(Object.keys(marketReader)).toEqual(['getMarketSnapshot']);
    expect(Object.keys(regionReader)).toEqual(['getRegionSnapshot']);
    expect(Object.keys(knowledgeReader)).toEqual(['getKnowledgeReference']);
    expect(Object.keys(agentReader)).toEqual(['getAgentScope']);
  });

  it('requires evidence for professional result dimensions', () => {
    const repository = new InMemoryTrainingRepository();
    const session = repository.saveSession(sessionFor());
    const invalidResult = {
      resultId: 'invalid-result',
      sessionId: session.sessionId,
      scenarioId: session.scenarioId,
      scenarioVersionId: session.scenarioVersionId,
      agentRef: session.agentRef,
      dimensionResults: [],
      evidence: [],
      objectiveResult: 'NOT_MET' as const,
      overallScore: 0,
      verificationState: 'NEEDS_VERIFICATION' as const,
      createdAt: '2026-01-01T00:10:00.000Z',
    } satisfies TrainingResult;
    expect(() => repository.saveResult(invalidResult)).toThrow(/evidence/i);
  });

  it('keeps Skill Profile as a rebuildable TrainingResult projection', () => {
    const repository = new InMemoryTrainingRepository();
    const profile = repository.saveSkillProfile({ organizationId: 'mock-org', agentRef: 'mock-agent-01', dimensions: [], sourceResultIds: ['result-01'], projectionOf: 'TRAINING_RESULTS', generatedAt: '2026-01-01T00:00:00.000Z' });
    expect(profile.projectionOf).toBe('TRAINING_RESULTS');
    expect(profile.sourceResultIds).toEqual(['result-01']);
    expect(profile).not.toHaveProperty('rawEvents');
  });

  it('keeps unverified knowledge fail-closed', () => {
    const reference = mvpTrainingScenarios[0].versions[0].knowledgeRefs[0];
    expect(reference.verificationState).toBe('NEEDS_VERIFICATION');
    expect(canUseAsAuthoritativeKnowledge(reference)).toBe(false);
    expect(canUseAsAuthoritativeKnowledge({ ...reference, verificationState: 'VERIFIED' })).toBe(true);
  });

  it('identifies the Stage 1 AI implementation as deterministic Mock Provider', async () => {
    const response = await mockTrainingAIProvider.generateNpcResponse({ session: sessionFor(), npc: mvpTrainingScenarios[0].npc, traineeMessage: '請問您的主要需求？' });
    expect(response.providerId).toBe('mock-training-provider');
    expect(response.isMock).toBe(true);
    expect(response.traceRef).toContain('mock-training:npc-response');
    expect(response.verificationState).toBe('NEEDS_VERIFICATION');
  });

  it('does not import a vendor AI SDK and keeps the route concrete', () => {
    const providerSource = readFileSync(path.join(process.cwd(), 'src/features/training/providers/mock-training-ai-provider.ts'), 'utf8');
    const trainingSource = readFileSync(path.join(process.cwd(), 'src/features/training/providers/training-ai-provider.ts'), 'utf8');
    expect(`${providerSource}\n${trainingSource}`).not.toMatch(/(?:openai|anthropic|@google\/generative-ai|@react-three)/i);
    const routePath = path.join(process.cwd(), 'src/app/training/page.tsx');
    expect(existsSync(routePath)).toBe(true);
    const routeSource = readFileSync(routePath, 'utf8');
    expect(routeSource).toContain('AI Realty Training Center');
    expect(routeSource).toContain('TrainingScenarioExperience');
    const experienceSource = readFileSync(path.join(process.cwd(), 'src/components/training/training-scenario-experience.tsx'), 'utf8');
    expect(experienceSource).toContain('experience.listScenarios');
    expect(experienceSource).toContain('scenarioCards.map');
    expect(mvpTrainingScenarios.every((scenario) => scenario.name.length > 0)).toBe(true);
  });

  it('does not alter existing Mock Market and Property contracts', () => {
    expect(mockProperties.some((property) => property.id === 'property-gushan-3br' && property.source === 'MOCK')).toBe(true);
    expect(mockTransactionRepository.getTransactions().some((transaction) => transaction.id === 'rp-01' && transaction.source === 'MOCK')).toBe(true);
  });
});
