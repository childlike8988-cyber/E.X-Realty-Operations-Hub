import type { ScenarioTransitionResult, TraineeAction, TraineeActionKind, ScenarioRuntimeState } from './engine-types';
import type { ScenarioEngine } from './scenario-engine';

const textRules: readonly [RegExp, TraineeActionKind][] = [
  [/風險|揭露|說明書|合約/, 'DISCLOSE_RISK'],
  [/一定會漲|現在買|趕快|保證/, 'PRESSURE_CLOSE'],
  [/議價|出價|折價|底價/, 'NEGOTIATE'],
  [/行情|實價|成交|市場/, 'EXPLAIN_MARKET'],
  [/貸款|月付|頭期|付款/, 'ASK_FINANCING'],
  [/預算|總價|負擔/, 'ASK_BUDGET'],
  [/疑慮|擔心|太貴|問題/, 'HANDLE_OBJECTION'],
  [/需求|家庭|幾房|通勤|生活/, 'ASK_NEEDS'],
  [/理解|謝謝|慢慢|不用急/, 'BUILD_TRUST'],
  [/物件|格局|採光|房子/, 'EXPLAIN_PROPERTY'],
];

export function classifyMockAction(text: string): TraineeActionKind {
  return textRules.find(([pattern]) => pattern.test(text))?.[1] ?? 'UNKNOWN';
}

export type MockConversationInput = {
  text: string;
  action?: TraineeAction;
};

/** Local text-to-action adapter; it is deliberately not production NLP. */
export class MockConversationAdapter {
  readonly isMock = true;
  readonly adapterId = 'mock-training-conversation';

  constructor(private readonly scenarioEngine: ScenarioEngine) {}

  interact(runtime: ScenarioRuntimeState, input: MockConversationInput): ScenarioTransitionResult {
    const action = input.action ?? { kind: classifyMockAction(input.text), text: input.text };
    return this.scenarioEngine.applyAction(runtime, action);
  }
}
