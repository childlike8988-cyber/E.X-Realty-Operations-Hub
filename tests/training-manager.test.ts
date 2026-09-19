import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { createSyntheticManagerTrainingFixture } from '@/features/training/manager/mock-fixture';
import { TrainingManagerReadModel } from '@/features/training/manager/read-model';
import { deriveAgentSkillProfile } from '@/features/training/evaluation/skill-profile';

async function setup() {
  const fixture = await createSyntheticManagerTrainingFixture();
  return { fixture, model: new TrainingManagerReadModel(fixture) };
}

describe('Stage 6 Manager View + Skill Profile read model', () => {
  it('uses synthetic organization data only and includes all S01–S05 metadata', async () => {
    const { fixture } = await setup();
    expect(fixture.isSynthetic).toBe(true);
    expect(fixture.agents).toHaveLength(5);
    expect(fixture.agents.every((agent) => agent.isSynthetic && agent.displayName && agent.agentRef)).toBe(true);
    expect(fixture.scenarios.map((scenario) => scenario.scenarioId)).toEqual(['S01', 'S02', 'S03', 'S04', 'S05']);
    expect(JSON.stringify(fixture)).not.toMatch(/phone|email|customerId|CRM|identity number/i);
  });

  it('builds results and events through the canonical Session and evaluation contracts', async () => {
    const { fixture } = await setup();
    expect(fixture.results.length).toBeGreaterThanOrEqual(10);
    for (const result of fixture.results) {
      expect(result.evidence.length).toBeGreaterThan(0);
      expect(result.evidence.some((evidence) => evidence.references.some((reference) => reference.kind === 'EVENT'))).toBe(true);
      expect(fixture.events.some((event) => event.sessionId === result.sessionId && event.eventType === 'SESSION_STARTED')).toBe(true);
    }
  });

  it('derives the profile from the exact Stage 4 projection rather than recalculating UI scores', async () => {
    const { fixture, model } = await setup();
    const agent = fixture.agents[0];
    const expected = deriveAgentSkillProfile(fixture.results, fixture.organizationId, agent.agentRef);
    expect(model.getAgentTrainingDetail(agent.agentRef).profile).toEqual(expected);
    expect(model.getSkillMatrix(agent.agentRef).map((row) => row.score)).toEqual(expected.dimensions.map((dimension) => dimension.score));
  });

  it('keeps traceability from profile dimension to result, evidence, event, and scenario version context', async () => {
    const { fixture, model } = await setup();
    const agent = fixture.agents[0];
    const row = model.getSkillMatrix(agent.agentRef).find((item) => item.resultRefs.length > 0)!;
    const drilldowns = model.getDimensionEvidence(agent.agentRef, row.dimensionId);
    expect(drilldowns.length).toBeGreaterThan(0);
    const drilldown = drilldowns.find((item) => item.events.length > 0)!;
    expect(drilldown.dimensionId).toBe(row.dimensionId);
    expect(drilldown.result.scenarioName).not.toBe('');
    expect(drilldown.events[0].sequence).toBeGreaterThan(0);
    expect(drilldown.sourceLabels.length).toBeGreaterThan(0);
  });

  it('does not expose raw state snapshots, hidden answers, or negotiation boundaries in manager evidence projections', async () => {
    const { fixture, model } = await setup();
    const result = fixture.results.find((item) => item.evidence.some((evidence) => evidence.references.some((reference) => reference.kind === 'EVENT')))!;
    const evidence = result.evidence.find((item) => item.references.some((reference) => reference.kind === 'EVENT'))!;
    const output = JSON.stringify(model.getEvidenceDrilldown(result.resultId, evidence.evidenceId));
    expect(output).not.toMatch(/stateBefore|stateAfter|payload|hiddenInformation|negotiationBoundary|SYSTEM_ONLY/i);
  });

  it('keeps risks visible independently from a high numeric result score', async () => {
    const { fixture } = await setup();
    const clone = structuredClone(fixture);
    const index = clone.results.findIndex((result) => result.riskSummary.evidenceRefs.length > 0);
    const results = clone.results.map((result, resultIndex) => resultIndex === index ? { ...result, overallScore: 98 } : result);
    const model = new TrainingManagerReadModel({ ...clone, results });
    expect(model.listRiskEvents().some((risk) => risk.resultId === results[index].resultId)).toBe(true);
  });

  it('surfaces one review-queue item per underlying risk interaction even when two dimensions share its evidence', async () => {
    const { model } = await setup();
    const risks = model.listRiskEvents();
    expect(new Set(risks.map((risk) => risk.riskId)).size).toBe(risks.length);
    expect(risks.filter((risk) => risk.severity === 'REQUIRES_REVIEW').length).toBeGreaterThan(0);
  });

  it('surfaces fail-closed NEEDS_VERIFICATION separately from the authenticated training identity', async () => {
    const { model } = await setup();
    const risk = model.listRiskEvents().find((item) => item.severity === 'NEEDS_VERIFICATION');
    expect(risk).toBeDefined();
    expect(risk?.verificationState).toBe('NEEDS_VERIFICATION');
  });

  it('uses deterministic, evidence-backed recommendations rather than a predictive or AI recommendation', async () => {
    const { fixture, model } = await setup();
    const agent = fixture.agents.find((item) => item.agentRef === 'agent-lin-ruo-an')!;
    const recommendation = model.getRecommendedScenario(agent.agentRef);
    expect(recommendation).not.toBeNull();
    expect(recommendation?.supportingResultIds.length).toBeGreaterThan(0);
    expect(recommendation?.supportingEvidenceRefs.length).toBeGreaterThan(0);
    expect(fixture.scenarios.some((scenario) => scenario.scenarioId === recommendation?.scenarioId)).toBe(true);
    expect(recommendation?.reason).not.toMatch(/predict|預測|機率/i);
  });

  it('uses chronological result history for trends without making a predictive claim', async () => {
    const { fixture, model } = await setup();
    const agent = fixture.agents[0];
    const profile = deriveAgentSkillProfile(fixture.results, fixture.organizationId, agent.agentRef);
    expect(model.getSkillMatrix(agent.agentRef).map((row) => row.trend)).toEqual(profile.dimensions.map((dimension) => dimension.trend));
  });

  it('provides read-only list, overview, agent detail, risk, and filter projections without mutating canonical data', async () => {
    const { fixture, model } = await setup();
    const before = JSON.stringify(fixture);
    expect(model.getManagerTrainingOverview().agentCount).toBe(5);
    expect(model.listAgentSummaries('ALL')).toHaveLength(5);
    expect(model.listAgentSummaries('NEEDS_COACHING').length).toBeGreaterThan(0);
    expect(model.listAgentSummaries('RISK_REVIEW').length).toBeGreaterThan(0);
    expect(model.listAgentSummaries('RECENTLY_ACTIVE').length).toBeGreaterThan(0);
    model.getAgentTrainingDetail(fixture.agents[0].agentRef);
    expect(JSON.stringify(fixture)).toBe(before);
  });

  it('keeps external AI, network, Customer, migration, and mutable repository behavior out of the manager layer', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('NETWORK_FORBIDDEN'));
    const { fixture, model } = await setup();
    model.getManagerTrainingOverview();
    model.getAgentTrainingDetail(fixture.agents[0].agentRef);
    expect(fetchSpy).not.toHaveBeenCalled();
    const source = [
      readFileSync('src/features/training/manager/contracts.ts', 'utf8'),
      readFileSync('src/features/training/manager/read-model.ts', 'utf8'),
      readFileSync('src/features/training/manager/mock-fixture.ts', 'utf8'),
    ].join('\n');
    expect(source).not.toMatch(/prisma|fetch\(|openai|anthropic|saveCustomer|updateCustomer|appendResult\(/i);
    expect(source).not.toMatch(/updateEvent\(|deleteEvent\(/);
  });

  it('keeps the Manager UI on the read-model boundary and exposes no manager projection from the trainee component', () => {
    const managerUi = readFileSync('src/components/training/training-manager-experience.tsx', 'utf8');
    const traineeUi = readFileSync('src/components/training/training-scenario-experience.tsx', 'utf8');
    expect(managerUi).toContain('TrainingManagerReadModel');
    expect(managerUi).not.toMatch(/deriveAgentSkillProfile|appendResult\(|evaluateSession\(|submitTraineeMessage\(|applyAction\(/);
    expect(traineeUi).not.toContain('TrainingManagerReadModel');
    expect(managerUi).toContain('非正式權限系統');
  });

  it('keeps the existing Training appearance system and accessible manager controls on the manager route', () => {
    const shell = readFileSync('src/components/layout/app-shell.tsx', 'utf8');
    const route = readFileSync('src/app/training/manager/page.tsx', 'utf8');
    const managerUi = readFileSync('src/components/training/training-manager-experience.tsx', 'utf8');
    const css = readFileSync('src/components/training/training-visual.module.css', 'utf8');
    expect(shell).toContain('^\\/training(?:\\/manager)?\\/?$');
    expect(route).toContain('TrainingManagerExperience');
    expect(managerUi).toContain('aria-pressed={filter === item.id}');
    expect(managerUi).toContain('aria-labelledby="manager-agent-detail-heading"');
    expect(css).toContain('.managerSkillMatrix');
    expect(css).toContain('@media(max-width:767px)');
    expect(css).toContain('prefers-reduced-motion:reduce');
  });
});
