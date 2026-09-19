import { deepFreeze, type TrainingNpc } from './types';
import type { AppliedNpcStateDelta, NpcRuntimeState, NpcStateDelta, NpcTransitionResult, ScenarioActionRule, TraineeAction, TraineeActionKind, TrainingEmotion, TrainingEventCandidate, TrainingIntent } from './engine-types';

const ACTION_DELTAS: Record<TraineeActionKind, NpcStateDelta> = {
  ASK_NEEDS: { trust: 4, interest: 3, pressure: -2, emotion: 'CURIOUS', intent: 'DISCOVER' },
  ASK_BUDGET: { trust: 2, interest: 2, pressure: 0, intent: 'EXPLORE' },
  ASK_FINANCING: { trust: 6, interest: 2, pressure: -4, emotion: 'RELIEVED', intent: 'DISCOVER' },
  EXPLAIN_PROPERTY: { trust: 2, interest: 5, pressure: -1, emotion: 'ENGAGED', intent: 'COMPARE' },
  EXPLAIN_MARKET: { trust: 3, interest: 3, pressure: -2, emotion: 'CAUTIOUS', intent: 'COMPARE' },
  HANDLE_OBJECTION: { trust: 5, interest: 3, pressure: -3, emotion: 'CURIOUS', intent: 'CONTINUE' },
  NEGOTIATE: { trust: 1, interest: 4, pressure: 2, intent: 'NEGOTIATE', negotiationPosition: 'OPEN' },
  BUILD_TRUST: { trust: 7, interest: 2, pressure: -4, emotion: 'RELIEVED', intent: 'CONTINUE' },
  PRESSURE_CLOSE: { trust: -12, interest: -3, pressure: 10, emotion: 'FRUSTRATED', intent: 'DISENGAGE', negotiationPosition: 'NOT_READY' },
  DISCLOSE_RISK: { trust: 1, interest: 0, pressure: 1, emotion: 'CAUTIOUS', intent: 'CONTINUE' },
  UNKNOWN: { trust: -1, interest: 0, pressure: 1, emotion: 'GUARDED', intent: 'DEFER' },
};

const FALLBACK_RESPONSES: Record<TraineeActionKind, string> = {
  ASK_NEEDS: '對方願意多談一些需求，但仍在觀察是否被理解。',
  ASK_BUDGET: '對方提供有限的預算線索，期待後續問題更具體。',
  ASK_FINANCING: '對方開始談付款壓力，願意一起釐清負擔。',
  EXPLAIN_PROPERTY: '對方將物件資訊與自身需求做比較。',
  EXPLAIN_MARKET: '對方希望確認行情資料的條件與來源。',
  HANDLE_OBJECTION: '對方聽完回應，提出下一個需要釐清的疑問。',
  NEGOTIATE: '對方願意討論條件，但尚未承諾任何價格。',
  BUILD_TRUST: '對方感受到較穩定的對話節奏，防備稍微降低。',
  PRESSURE_CLOSE: '對方感到被催促，開始重新評估是否繼續對話。',
  DISCLOSE_RISK: '對方注意到仍需查證的事項，要求保持透明。',
  UNKNOWN: '對方沒有完全理解這個回應，等待更具體的問題。',
};

export function clampNpcValue(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value)));
}

function emotion(value: string): TrainingEmotion {
  const allowed: TrainingEmotion[] = ['GUARDED', 'CURIOUS', 'RELIEVED', 'FRUSTRATED', 'CAUTIOUS', 'ENGAGED', 'DISENGAGING'];
  return allowed.includes(value as TrainingEmotion) ? value as TrainingEmotion : 'GUARDED';
}

function intent(value: string): TrainingIntent {
  const allowed: TrainingIntent[] = ['EXPLORE', 'CONTINUE', 'DISCOVER', 'COMPARE', 'NEGOTIATE', 'DEFER', 'DISENGAGE'];
  return allowed.includes(value as TrainingIntent) ? value as TrainingIntent : 'EXPLORE';
}

export function createNpcRuntimeState(definition: TrainingNpc): NpcRuntimeState {
  return deepFreeze({ npcId: definition.npcId, emotion: emotion(definition.emotion), trust: clampNpcValue(definition.trust), interest: clampNpcValue(definition.interest), pressure: clampNpcValue(definition.pressure), intent: intent(definition.intent), negotiationPosition: 'NOT_READY' as const });
}

function actualDelta(previous: NpcRuntimeState, next: NpcRuntimeState): AppliedNpcStateDelta {
  return { trust: next.trust - previous.trust, interest: next.interest - previous.interest, pressure: next.pressure - previous.pressure, emotion: next.emotion === previous.emotion ? undefined : next.emotion, intent: next.intent === previous.intent ? undefined : next.intent, negotiationPosition: next.negotiationPosition === previous.negotiationPosition ? undefined : next.negotiationPosition };
}

function contextualMessage(action: TraineeAction, response: string, state: NpcRuntimeState, revealedInformationIds: readonly string[], previousEvents: readonly TrainingEventCandidate[]): string {
  const prefix = state.trust >= 60 ? '對話已較開放：' : state.trust <= 25 ? '對方仍保持距離：' : '';
  const continuity = previousEvents.some((event) => event.eventType === 'RISK_WARNING') ? '對方仍記得先前的風險提醒。' : revealedInformationIds.length > 0 ? '對方會沿著已談過的需求繼續回應。' : '';
  return `${prefix}${continuity}${response}${action.text ? `（${action.text}）` : ''}`;
}

export type NpcResponseInput = {
  definition: TrainingNpc;
  state: NpcRuntimeState;
  action: TraineeAction;
  rule?: ScenarioActionRule;
  revealedInformationIds?: readonly string[];
  previousEvents?: readonly TrainingEventCandidate[];
};

/** Pure, deterministic NPC state transition. It never mutates the TrainingNpc definition. */
export class NpcEngine {
  respond(input: NpcResponseInput): NpcTransitionResult {
    const previousState = deepFreeze({ ...input.state });
    const requested = input.rule?.stateDelta ?? ACTION_DELTAS[input.action.kind];
    const nextState = deepFreeze({
      npcId: input.definition.npcId,
      emotion: requested.emotion ?? previousState.emotion,
      trust: clampNpcValue(previousState.trust + (requested.trust ?? 0)),
      interest: clampNpcValue(previousState.interest + (requested.interest ?? 0)),
      pressure: clampNpcValue(previousState.pressure + (requested.pressure ?? 0)),
      intent: requested.intent ?? previousState.intent,
      negotiationPosition: requested.negotiationPosition ?? previousState.negotiationPosition,
    });
    const stateDelta = actualDelta(previousState, nextState);
    const response = contextualMessage(input.action, input.rule?.response ?? FALLBACK_RESPONSES[input.action.kind], previousState, input.revealedInformationIds ?? [], input.previousEvents ?? []);
    return deepFreeze({ previousState, action: { ...input.action }, response, stateDelta, nextState });
  }
}

export const defaultNpcEngine = new NpcEngine();
