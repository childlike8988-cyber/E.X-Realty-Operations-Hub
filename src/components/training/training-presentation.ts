import type { EvaluationEvidence } from '@/features/training/evaluation/contracts';

const terms: Readonly<Record<string, string>> = {
  ASK_NEEDS: '探索需求', ASK_BUDGET: '確認預算', ASK_FINANCING: '了解貸款與月付',
  EXPLAIN_PROPERTY: '說明物件', EXPLAIN_MARKET: '解釋行情', HANDLE_OBJECTION: '處理異議',
  NEGOTIATE: '討論議價', BUILD_TRUST: '建立信任', PRESSURE_CLOSE: '施壓成交', DISCLOSE_RISK: '揭露風險',
  HIDDEN_NEED_REVEALED: '探索到新的需求', TRUST_GAINED: '信任提升', TRUST_DROPPED: '信任下降',
  RISK_WARNING: '風險提醒', CUSTOMER_DISENGAGING: '對方逐漸退出對話',
  NEGOTIATION_OPENED: '開始協商', PRICE_OBJECTION_TRIGGERED: '出現價格異議', SECOND_VIEW_INTEREST: '願意再次帶看',
};

/** Display translation only. The original finding remains available in audit details. */
export function trainingFindingText(finding: string): string {
  return finding.replace(/\b[A-Z][A-Z_]+\b/g, (value) => terms[value] ?? '情境紀錄')
    .replace('持久化進度', '已記錄的目標進度');
}

/** Coalesce identical presentation rows, never discard their underlying evidence. */
export function groupTrainingEvidence(evidence: readonly EvaluationEvidence[]): readonly (readonly EvaluationEvidence[])[] {
  const groups = new Map<string, EvaluationEvidence[]>();
  for (const item of evidence) {
    const key = JSON.stringify([item.kind, item.finding, item.verificationState, item.references]);
    const group = groups.get(key) ?? [];
    group.push(item);
    groups.set(key, group);
  }
  return [...groups.values()];
}

export function trainingEventText(event: { actor: string; eventType: string; message: string }): string {
  // Actual trainee/NPC utterances are never rewritten.
  if (event.actor !== 'SYSTEM') return event.message;
  if (event.eventType === 'STATE_CHANGED') return '這次回應改變了對方的互動狀態，並更新情境目標進度。';
  if (event.eventType === 'SESSION_STARTED') return '本次情境練習開始。';
  if (event.eventType === 'SESSION_COMPLETED') return '本次練習已達成情境完成條件。';
  if (event.eventType === 'SESSION_FAILED') return '本次練習已結束，尚未達成情境條件。';
  if (event.eventType === 'SESSION_CANCELLED') return '本次練習已取消。';
  return trainingFindingText(event.message).replace(/^Mock 事件：/, '模擬情境變化：');
}
