import { deepFreeze, type TrainingScenarioVersion } from './types';
import type { ScenarioActionRule, ScenarioBehaviorDefinition, ScenarioFailureRule, ScenarioInformation, ScenarioRevealCondition, ScenarioSuccessRule, TraineeActionKind, TrainingEventCandidateType } from './engine-types';

function information(informationId: string, label: string, content: string, visibility: ScenarioInformation['visibility'], revealWhen?: ScenarioRevealCondition): ScenarioInformation {
  return { informationId, label, content, visibility, revealWhen };
}

function actionRule(action: TraineeActionKind, response: string, stateDelta: ScenarioActionRule['stateDelta'], options: Omit<ScenarioActionRule, 'action' | 'response' | 'stateDelta'> = {}): ScenarioActionRule {
  return { action, response, stateDelta, ...options };
}

type ScenarioVersionRef = Pick<TrainingScenarioVersion, 'scenarioId' | 'scenarioVersionId'>;

function behavior(version: ScenarioVersionRef, briefing: string, scenarioInformation: readonly ScenarioInformation[], actionRules: Partial<Record<TraineeActionKind, ScenarioActionRule>>, success: ScenarioSuccessRule, failure: readonly ScenarioFailureRule[]): ScenarioBehaviorDefinition {
  return { scenarioId: version.scenarioId, scenarioVersionId: version.scenarioVersionId, briefing, information: scenarioInformation, actionRules, success, failure };
}

const trustEvents: readonly TrainingEventCandidateType[] = ['TRUST_GAINED', 'OBJECTIVE_PROGRESS'];
const riskEvents: readonly TrainingEventCandidateType[] = ['TRUST_DROPPED', 'RISK_WARNING', 'NEEDS_VERIFICATION', 'CUSTOMER_DISENGAGING'];

const s01Version: ScenarioVersionRef = { scenarioId: 'S01', scenarioVersionId: 'S01-v1' };
const s02Version: ScenarioVersionRef = { scenarioId: 'S02', scenarioVersionId: 'S02-v1' };
const s03Version: ScenarioVersionRef = { scenarioId: 'S03', scenarioVersionId: 'S03-v1' };
const s04Version: ScenarioVersionRef = { scenarioId: 'S04', scenarioVersionId: 'S04-v1' };
const s05Version: ScenarioVersionRef = { scenarioId: 'S05', scenarioVersionId: 'S05-v1' };

const s01 = behavior(s01Version, '練習在第一次接觸中理解買方需求，並一起確認預算與下一步。', [
  information('S01-BASIC-SITUATION', '基本家庭情況', '兩位家庭成員正在評估通勤與居住空間。', 'BRIEFING'),
  information('S01-APPROX-BUDGET', '預算概況', '預算尚未明確，需要透過對話確認。', 'PUBLIC'),
  information('S01-MONTHLY-PAYMENT', '月付負擔顧慮', '對月付負擔敏感，擔心每月現金流壓力。', 'HIDDEN', { actionKinds: ['ASK_FINANCING'], minimumTrust: 35 }),
  information('S01-SCHOOL-PRIORITY', '家庭學校優先順序', '學校與家庭日常動線其實比裝潢更優先。', 'HIDDEN', { actionKinds: ['ASK_NEEDS'] }),
  information('S01-SYSTEM-RISK', '引擎判定資料', '僅供系統判斷風險規則，不能展示給受訓者。', 'SYSTEM_ONLY'),
], {
  ASK_NEEDS: actionRule('ASK_NEEDS', '買方開始具體說明家庭成員與通勤需求。', { trust: 4, interest: 3, pressure: -2, emotion: 'CURIOUS', intent: 'DISCOVER' }, { revealInformationIds: ['S01-SCHOOL-PRIORITY'], objectiveIds: ['S01-O1'], eventTypes: ['HIDDEN_NEED_REVEALED', ...trustEvents] }),
  ASK_BUDGET: actionRule('ASK_BUDGET', '買方願意提供較明確的預算線索，但仍在觀察提問方式。', { trust: 2, interest: 2, intent: 'EXPLORE' }, { revealInformationIds: ['S01-MONTHLY-PAYMENT'], requiresTrustAtLeast: 40, objectiveIds: ['S01-O1'], eventTypes: ['OBJECTIVE_PROGRESS'] }),
  ASK_FINANCING: actionRule('ASK_FINANCING', '買方談到月付負擔，表示這是做決定時的重要條件。', { trust: 8, interest: 2, pressure: -4, emotion: 'RELIEVED', intent: 'DISCOVER' }, { revealInformationIds: ['S01-MONTHLY-PAYMENT'], objectiveIds: ['S01-O2'], eventTypes: ['HIDDEN_NEED_REVEALED', ...trustEvents] }),
  BUILD_TRUST: actionRule('BUILD_TRUST', '買方感受到對話節奏比較穩定，願意繼續說明。', { trust: 7, interest: 2, pressure: -4, emotion: 'RELIEVED', intent: 'CONTINUE' }, { eventTypes: trustEvents }),
  HANDLE_OBJECTION: actionRule('HANDLE_OBJECTION', '買方願意把疑慮拆成更具體的問題。', { trust: 5, interest: 2, pressure: -2, emotion: 'CURIOUS', intent: 'CONTINUE' }, { objectiveIds: ['S01-O2'], eventTypes: ['OBJECTIVE_PROGRESS', 'TRUST_GAINED'] }),
  DISCLOSE_RISK: actionRule('DISCLOSE_RISK', '買方注意到仍需查證的資訊，並要求保持透明。', { trust: 2, pressure: 1, emotion: 'CAUTIOUS' }, { eventTypes: ['NEEDS_VERIFICATION'] }),
  PRESSURE_CLOSE: actionRule('PRESSURE_CLOSE', '買方感到被催促，開始重新評估是否繼續對話。', { trust: -12, interest: -3, pressure: 10, emotion: 'FRUSTRATED', intent: 'DISENGAGE', negotiationPosition: 'NOT_READY' }, { riskRuleIds: ['S01-R1'], eventTypes: riskEvents }),
}, { objectiveIds: ['S01-O1', 'S01-O2'], minimumTrust: 40, disallowedRiskRuleIds: ['S01-R1'] }, [
  { ruleId: 'S01-FAIL-TRUST', type: 'TRUST_AT_OR_BELOW', threshold: 20 },
  { ruleId: 'S01-FAIL-RISK', type: 'RISK_RULE_HIT', riskRuleId: 'S01-R1' },
]);

const s02 = behavior(s02Version, '練習用生活動線與需求帶看，並在離場前整理買方的比較依據。', [
  information('S02-VISIT-BRIEFING', '帶看重點', '第一次帶看，買方想用生活動線理解空間。', 'BRIEFING'),
  information('S02-TRANSPORT', '交通與回家動線', '通勤時間與回家動線是主要比較條件。', 'PUBLIC'),
  information('S02-STORAGE-PRIORITY', '收納優先順序', '同行家人其實更在意收納與日常整理。', 'HIDDEN', { actionKinds: ['ASK_NEEDS'] }),
  information('S02-COMPARISON-ANXIETY', '比較焦慮', '買方擔心看完仍無法比較不同物件。', 'HIDDEN', { actionKinds: ['BUILD_TRUST', 'HANDLE_OBJECTION'], minimumTrust: 35 }),
  information('S02-SYSTEM-RISK', '引擎判定資料', '僅供系統判斷風險規則，不能展示給受訓者。', 'SYSTEM_ONLY'),
], {
  ASK_NEEDS: actionRule('ASK_NEEDS', '買方補充說明收納與生活動線的優先順序。', { trust: 5, interest: 3, pressure: -2, emotion: 'CURIOUS', intent: 'DISCOVER' }, { revealInformationIds: ['S02-STORAGE-PRIORITY'], objectiveIds: ['S02-O1'], eventTypes: ['HIDDEN_NEED_REVEALED', ...trustEvents] }),
  EXPLAIN_PROPERTY: actionRule('EXPLAIN_PROPERTY', '買方將空間資訊與自己的生活動線做比較。', { trust: 3, interest: 6, pressure: -1, emotion: 'ENGAGED', intent: 'COMPARE' }, { objectiveIds: ['S02-O1'], eventTypes: ['OBJECTIVE_PROGRESS', 'SECOND_VIEW_INTEREST'] }),
  BUILD_TRUST: actionRule('BUILD_TRUST', '買方感覺有時間整理比較，不必當場做決定。', { trust: 7, interest: 2, pressure: -4, emotion: 'RELIEVED', intent: 'CONTINUE' }, { revealInformationIds: ['S02-COMPARISON-ANXIETY'], eventTypes: ['HIDDEN_NEED_REVEALED', ...trustEvents] }),
  HANDLE_OBJECTION: actionRule('HANDLE_OBJECTION', '買方把看不懂的地方整理成可逐項確認的問題。', { trust: 5, interest: 2, pressure: -3, emotion: 'CURIOUS', intent: 'CONTINUE' }, { revealInformationIds: ['S02-COMPARISON-ANXIETY'], objectiveIds: ['S02-O2'], eventTypes: ['HIDDEN_NEED_REVEALED', 'OBJECTIVE_PROGRESS', 'TRUST_GAINED'] }),
  DISCLOSE_RISK: actionRule('DISCLOSE_RISK', '買方知道仍有周邊條件需要查證，不把推測當成保證。', { trust: 2, pressure: 1, emotion: 'CAUTIOUS' }, { eventTypes: ['NEEDS_VERIFICATION'] }),
  PRESSURE_CLOSE: actionRule('PRESSURE_CLOSE', '買方覺得被要求立即決定，興趣與信任下降。', { trust: -12, interest: -4, pressure: 10, emotion: 'FRUSTRATED', intent: 'DISENGAGE' }, { riskRuleIds: ['S02-R1'], eventTypes: riskEvents }),
}, { objectiveIds: ['S02-O1', 'S02-O2'], minimumTrust: 42, disallowedRiskRuleIds: ['S02-R1'] }, [
  { ruleId: 'S02-FAIL-TRUST', type: 'TRUST_AT_OR_BELOW', threshold: 20 },
  { ruleId: 'S02-FAIL-RISK', type: 'RISK_RULE_HIT', riskRuleId: 'S02-R1' },
]);

const s03 = behavior(s03Version, '練習面對「開價高於實價」的質疑，先釐清比較條件，再使用可查證的行情脈絡。', [
  information('S03-PRICE-OBJECTION', '價格疑慮', '買方認為附近成交價格較低，期待看到比較依據。', 'BRIEFING'),
  information('S03-COMPARISON-BASIS', '比較條件', '不同樓層、屋齡、格局與交易時間會影響比較。', 'PUBLIC'),
  information('S03-FAMILY-FEAR', '買貴的家庭壓力', '買方害怕買貴後被家人責備。', 'HIDDEN', { actionKinds: ['HANDLE_OBJECTION', 'ASK_NEEDS'], minimumTrust: 35 }),
  information('S03-COMPETING-COMMUNITY', '另一個比較社區', '買方同時比較另一個社區，但尚未主動提及。', 'HIDDEN', { actionKinds: ['ASK_NEEDS'] }),
  information('S03-SYSTEM-RISK', '引擎判定資料', '僅供系統判斷風險規則，不能展示給受訓者。', 'SYSTEM_ONLY'),
], {
  ASK_NEEDS: actionRule('ASK_NEEDS', '買方補充比較中的社區與家庭顧慮。', { trust: 4, interest: 2, pressure: -2, emotion: 'CURIOUS', intent: 'DISCOVER' }, { revealInformationIds: ['S03-COMPETING-COMMUNITY'], eventTypes: ['HIDDEN_NEED_REVEALED', 'TRUST_GAINED'] }),
  EXPLAIN_MARKET: actionRule('EXPLAIN_MARKET', '買方願意依條件檢視行情，但提醒不要把資料說成估價保證。', { trust: 4, interest: 4, pressure: -3, emotion: 'CAUTIOUS', intent: 'COMPARE' }, { objectiveIds: ['S03-O1'], eventTypes: ['PRICE_OBJECTION_TRIGGERED', 'OBJECTIVE_PROGRESS'] }),
  HANDLE_OBJECTION: actionRule('HANDLE_OBJECTION', '買方願意說明「買貴」背後的家庭壓力，並繼續比較。', { trust: 7, interest: 4, pressure: -4, emotion: 'CURIOUS', intent: 'CONTINUE' }, { revealInformationIds: ['S03-FAMILY-FEAR'], objectiveIds: ['S03-O2'], eventTypes: ['HIDDEN_NEED_REVEALED', 'PRICE_OBJECTION_TRIGGERED', ...trustEvents] }),
  NEGOTIATE: actionRule('NEGOTIATE', '買方願意討論條件，但尚未形成任何價格承諾。', { trust: 1, interest: 4, pressure: 2, intent: 'NEGOTIATE', negotiationPosition: 'OPEN' }, { eventTypes: ['NEGOTIATION_OPENED'] }),
  DISCLOSE_RISK: actionRule('DISCLOSE_RISK', '買方接受需要查證資料來源，並把不確定性保留在討論中。', { trust: 2, pressure: 1, emotion: 'CAUTIOUS' }, { eventTypes: ['NEEDS_VERIFICATION'] }),
  PRESSURE_CLOSE: actionRule('PRESSURE_CLOSE', '買方認為回應只是在壓過疑慮，信任明顯下滑。', { trust: -14, interest: -4, pressure: 11, emotion: 'FRUSTRATED', intent: 'DISENGAGE' }, { riskRuleIds: ['S03-R1'], eventTypes: riskEvents }),
}, { objectiveIds: ['S03-O1', 'S03-O2'], minimumTrust: 42, disallowedRiskRuleIds: ['S03-R1'] }, [
  { ruleId: 'S03-FAIL-TRUST', type: 'TRUST_AT_OR_BELOW', threshold: 20 },
  { ruleId: 'S03-FAIL-RISK', type: 'RISK_RULE_HIT', riskRuleId: 'S03-R1' },
]);

const s04 = behavior(s04Version, '練習理解低價背後的付款、時程與條件因素，不擅自承諾屋主底線。', [
  information('S04-OFFER-BRIEFING', '出價情境', '買方提出低價，希望測試可談空間。', 'BRIEFING'),
  information('S04-TOTAL-BUDGET', '總價限制', '買方有總價上限，但不一定會先說明。', 'PUBLIC'),
  information('S04-PAYMENT-CONSTRAINT', '付款壓力', '付款方式與月付負擔影響可接受的價格。', 'HIDDEN', { actionKinds: ['ASK_FINANCING'] }),
  information('S04-TIMING-PRESSURE', '時程壓力', '買方其實有時間壓力，但正在試探談判空間。', 'HIDDEN', { actionKinds: ['ASK_NEEDS'], minimumTrust: 35 }),
  information('S04-SYSTEM-RISK', '引擎判定資料', '僅供系統判斷風險規則，不能展示給受訓者。', 'SYSTEM_ONLY'),
], {
  ASK_NEEDS: actionRule('ASK_NEEDS', '買方說明出價與搬遷時程的關聯。', { trust: 5, interest: 3, pressure: -1, emotion: 'CURIOUS', intent: 'DISCOVER' }, { revealInformationIds: ['S04-TIMING-PRESSURE'], eventTypes: ['HIDDEN_NEED_REVEALED', 'TRUST_GAINED'] }),
  ASK_FINANCING: actionRule('ASK_FINANCING', '買方願意談付款方式與月付負擔。', { trust: 6, interest: 3, pressure: -4, emotion: 'RELIEVED', intent: 'DISCOVER' }, { revealInformationIds: ['S04-PAYMENT-CONSTRAINT'], objectiveIds: ['S04-O1'], eventTypes: ['HIDDEN_NEED_REVEALED', ...trustEvents] }),
  NEGOTIATE: actionRule('NEGOTIATE', '買方願意把價格與付款、時程條件一起討論。', { trust: 2, interest: 5, pressure: 2, intent: 'NEGOTIATE', negotiationPosition: 'OPEN' }, { objectiveIds: ['S04-O2'], eventTypes: ['NEGOTIATION_OPENED', 'OBJECTIVE_PROGRESS'] }),
  HANDLE_OBJECTION: actionRule('HANDLE_OBJECTION', '買方把「先出低價」的顧慮拆成可討論的條件。', { trust: 6, interest: 3, pressure: -3, emotion: 'CURIOUS', intent: 'CONTINUE' }, { objectiveIds: ['S04-O1'], eventTypes: ['OBJECTIVE_PROGRESS', 'TRUST_GAINED'] }),
  DISCLOSE_RISK: actionRule('DISCLOSE_RISK', '買方理解議價邊界仍要取得授權與查證。', { trust: 2, pressure: 1, emotion: 'CAUTIOUS' }, { eventTypes: ['NEEDS_VERIFICATION'] }),
  PRESSURE_CLOSE: actionRule('PRESSURE_CLOSE', '買方覺得被迫立即接受或放棄，停止提供條件。', { trust: -13, interest: -4, pressure: 12, emotion: 'FRUSTRATED', intent: 'DISENGAGE', negotiationPosition: 'NOT_READY' }, { riskRuleIds: ['S04-R1'], eventTypes: riskEvents }),
}, { objectiveIds: ['S04-O1', 'S04-O2'], minimumTrust: 42, disallowedRiskRuleIds: ['S04-R1'] }, [
  { ruleId: 'S04-FAIL-TRUST', type: 'TRUST_AT_OR_BELOW', threshold: 20 },
  { ruleId: 'S04-FAIL-RISK', type: 'RISK_RULE_HIT', riskRuleId: 'S04-R1' },
]);

const s05 = behavior(s05Version, '練習理解屋主不願降價背後的資產認同與時程，再提出可驗證的市場選項。', [
  information('S05-OWNER-BRIEFING', '屋主情境', '屋主目前不願降價，期待保留對資產價值的控制感。', 'BRIEFING'),
  information('S05-ASKING-PRICE', '目前開價', '屋主希望維持原有價格，需要理解市場回應。', 'PUBLIC'),
  information('S05-MOVE-DEADLINE', '搬遷期限', '屋主可能有搬遷期限，但尚未主動說明。', 'HIDDEN', { actionKinds: ['ASK_NEEDS'] }),
  information('S05-LOSS-FEAR', '降價失敗感', '屋主擔心降價代表資產判斷失敗。', 'HIDDEN', { actionKinds: ['BUILD_TRUST', 'HANDLE_OBJECTION'], minimumTrust: 35 }),
  information('S05-SYSTEM-RISK', '引擎判定資料', '僅供系統判斷風險規則，不能展示給受訓者。', 'SYSTEM_ONLY'),
], {
  ASK_NEEDS: actionRule('ASK_NEEDS', '屋主說明價格之外，還有搬遷時程需要被理解。', { trust: 5, interest: 3, pressure: -2, emotion: 'CURIOUS', intent: 'DISCOVER' }, { revealInformationIds: ['S05-MOVE-DEADLINE'], objectiveIds: ['S05-O1'], eventTypes: ['HIDDEN_NEED_REVEALED', ...trustEvents] }),
  BUILD_TRUST: actionRule('BUILD_TRUST', '屋主感受到決策權被尊重，願意談談降價的心理顧慮。', { trust: 8, interest: 2, pressure: -4, emotion: 'RELIEVED', intent: 'CONTINUE' }, { revealInformationIds: ['S05-LOSS-FEAR'], eventTypes: ['HIDDEN_NEED_REVEALED', 'TRUST_GAINED'] }),
  HANDLE_OBJECTION: actionRule('HANDLE_OBJECTION', '屋主可以把「不願降價」拆成資產認同與市場證據兩個問題。', { trust: 6, interest: 3, pressure: -3, emotion: 'CURIOUS', intent: 'CONTINUE' }, { revealInformationIds: ['S05-LOSS-FEAR'], objectiveIds: ['S05-O1'], eventTypes: ['HIDDEN_NEED_REVEALED', 'OBJECTIVE_PROGRESS', 'TRUST_GAINED'] }),
  EXPLAIN_MARKET: actionRule('EXPLAIN_MARKET', '屋主願意用市場條件與選項理解反應，但不接受必然成交承諾。', { trust: 4, interest: 5, pressure: -2, emotion: 'CAUTIOUS', intent: 'COMPARE' }, { objectiveIds: ['S05-O2'], eventTypes: ['OBJECTIVE_PROGRESS'] }),
  NEGOTIATE: actionRule('NEGOTIATE', '屋主願意討論選項，但仍保留價格決策權。', { trust: 2, interest: 4, pressure: 2, intent: 'NEGOTIATE', negotiationPosition: 'EXPLORING' }, { eventTypes: ['NEGOTIATION_OPENED'] }),
  DISCLOSE_RISK: actionRule('DISCLOSE_RISK', '屋主知道市場資訊仍需查證，不把推測當成成交保證。', { trust: 2, pressure: 1, emotion: 'CAUTIOUS' }, { eventTypes: ['NEEDS_VERIFICATION'] }),
  PRESSURE_CLOSE: actionRule('PRESSURE_CLOSE', '屋主感覺被迫接受降價，防禦與壓力上升。', { trust: -14, interest: -4, pressure: 12, emotion: 'FRUSTRATED', intent: 'DISENGAGE', negotiationPosition: 'NOT_READY' }, { riskRuleIds: ['S05-R1'], eventTypes: riskEvents }),
}, { objectiveIds: ['S05-O1', 'S05-O2'], minimumTrust: 42, disallowedRiskRuleIds: ['S05-R1'] }, [
  { ruleId: 'S05-FAIL-TRUST', type: 'TRUST_AT_OR_BELOW', threshold: 20 },
  { ruleId: 'S05-FAIL-RISK', type: 'RISK_RULE_HIT', riskRuleId: 'S05-R1' },
]);

const behaviorMap: Record<string, ScenarioBehaviorDefinition> = Object.fromEntries([s01, s02, s03, s04, s05].map((definition) => [`${definition.scenarioId}:${definition.scenarioVersionId}`, definition]));

export function getScenarioBehavior(scenarioId: string, scenarioVersionId: string): ScenarioBehaviorDefinition {
  const definition = behaviorMap[`${scenarioId}:${scenarioVersionId}`];
  if (!definition) throw new Error(`No Stage 2 behavior contract for ${scenarioId}/${scenarioVersionId}.`);
  return definition;
}

export const scenarioBehaviors: Readonly<Record<string, ScenarioBehaviorDefinition>> = deepFreeze(behaviorMap);
