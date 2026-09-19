import { describe, expect, it } from 'vitest';
import { groupTrainingEvidence, trainingEventText, trainingFindingText } from '@/components/training/training-presentation';
import { evaluationFixture } from './helpers/training-evaluation-fixture';
import { createSyntheticManagerTrainingFixture } from '@/features/training/manager/mock-fixture';
import { TrainingManagerReadModel } from '@/features/training/manager/read-model';

describe('Stage 7 showcase presentation preserves canonical evidence', () => {
  it('groups duplicate findings without dropping any evidence or changing a result', async () => {
    const fixture = evaluationFixture('S01'); fixture.finish();
    const result = await fixture.engine().evaluate(fixture.session.sessionId);
    const original = JSON.stringify(result);
    const groups = groupTrainingEvidence(result.evidence);
    expect(groups.length).toBeLessThan(result.evidence.length);
    expect(groups.flat().map((item) => item.evidenceId).sort()).toEqual(result.evidenceRefs.slice().sort());
    expect(JSON.stringify(result)).toBe(original);
    expect(groups.some((group) => new Set(group.map((item) => item.dimensionId)).size > 1)).toBe(true);
  });

  it('never merges distinct events, risk kinds or verification states', () => {
    const base = { evidenceId: 'one', dimensionId: 'COMMUNICATION' as const, kind: 'POSITIVE' as const, finding: 'Observed', references: [{ kind: 'EVENT' as const, eventId: 'a', sequence: 2 }], verificationState: 'VERIFIED' as const };
    expect(groupTrainingEvidence([base, { ...base, evidenceId: 'two', references: [{ kind: 'EVENT', eventId: 'b', sequence: 3 }] }, { ...base, evidenceId: 'risk', kind: 'RISK' }, { ...base, evidenceId: 'unknown', verificationState: 'NEEDS_VERIFICATION' }])).toHaveLength(4);
  });

  it('translates display action names while retaining caution and original utterances', () => {
    const raw = '已記錄行動：EXPLAIN_MARKET。僅驗證行動類型，未認定對話內容正確。';
    expect(trainingFindingText(raw)).toBe('已記錄行動：解釋行情。僅驗證行動類型，未認定對話內容正確。');
    expect(trainingEventText({ actor: 'AGENT', eventType: 'TRAINEE_ACTION', message: raw })).toBe(raw);
    expect(trainingEventText({ actor: 'SYSTEM', eventType: 'STATE_CHANGED', message: 'NPC state changed after trainee interaction.' })).toContain('更新情境目標進度');
    expect(trainingEventText({ actor: 'SYSTEM', eventType: 'SESSION_FAILED', message: 'Scenario failure candidate accepted.' })).toBe('本次練習已結束，尚未達成情境條件。');
    expect(trainingEventText({ actor: 'SYSTEM', eventType: 'TRUST_DROPPED', message: 'Mock 事件：TRUST_DROPPED。' })).toBe('模擬情境變化：信任下降。');
  });

  it('retains the S03 critical risk and fail-closed result after grouping', async () => {
    const fixture = evaluationFixture('S03'); fixture.submit('PRESSURE_CLOSE');
    const result = await fixture.engine().evaluate(fixture.session.sessionId);
    expect(result.overallState).toBe('REQUIRES_REVIEW');
    expect(groupTrainingEvidence(result.evidence).flat().filter((item) => item.kind === 'RISK').map((item) => item.evidenceId)).toEqual(result.evidence.filter((item) => item.kind === 'RISK').map((item) => item.evidenceId));
  });

  it('supports the documented synthetic Manager S04 recommendation and evidence path', async () => {
    const fixture = await createSyntheticManagerTrainingFixture();
    const model = new TrainingManagerReadModel(fixture);
    const detail = model.getAgentTrainingDetail('agent-lin-ruo-an');
    expect(detail.recommendation?.scenarioId).toBe('S04');
    const evidence = model.getDimensionEvidence('agent-lin-ruo-an', 'NEGOTIATION');
    expect(evidence.length).toBeGreaterThan(0);
    for (const item of evidence) expect(model.getEvidenceDrilldown(item.result.resultId, item.evidenceId).events.length).toBeGreaterThan(0);
  });
});
