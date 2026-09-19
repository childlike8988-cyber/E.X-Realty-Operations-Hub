import { deepFreeze, type ScenarioKnowledgeReference, type ScenarioObjective, type ScenarioRiskRule, type TrainingNpc, type TrainingScenario, type TrainingScenarioVersion } from './types';

const MOCK_VERSION = 'stage-1.0';

function knowledgeReference(scenarioId: string, ruleId: string): ScenarioKnowledgeReference {
  return {
    refId: `${scenarioId}-knowledge-${ruleId.toLowerCase()}`,
    source: 'Mock Training Knowledge Pack',
    version: MOCK_VERSION,
    effectiveDate: '2026-01-01',
    verifiedAt: 'NOT_VERIFIED',
    ruleId,
    verificationState: 'NEEDS_VERIFICATION',
  };
}

function objective(objectiveId: string, label: string, weight: number, successEvidence: readonly string[]): ScenarioObjective {
  return { objectiveId, label, weight, successEvidence };
}

function riskRule(ruleId: string, trigger: string, severity: ScenarioRiskRule['severity'] = 'MEDIUM'): ScenarioRiskRule {
  return { ruleId, trigger, severity, action: 'NEEDS_VERIFICATION', verificationState: 'NEEDS_VERIFICATION' };
}

function npc(npcId: string, persona: string, personality: string, budget: string, trueNeeds: readonly string[], hiddenNeeds: readonly string[], objections: readonly string[], negotiationBoundary: string): TrainingNpc {
  return {
    npcId,
    persona,
    personality,
    budget,
    knowledgeLevel: 'MEDIUM',
    trueNeeds,
    hiddenNeeds,
    objections,
    emotion: 'GUARDED',
    trust: 35,
    interest: 50,
    pressure: 40,
    intent: 'EXPLORE',
    negotiationBoundary,
  };
}

function version(
  scenarioId: string,
  propertyRef: string,
  regionRef: string,
  marketSnapshotRef: string,
  npcRef: string,
  objectives: readonly ScenarioObjective[],
  hiddenInformation: readonly string[],
  events: readonly string[],
  successConditions: readonly string[],
  failureConditions: readonly string[],
  riskRules: readonly ScenarioRiskRule[],
  knowledgeRefs: readonly ScenarioKnowledgeReference[],
): TrainingScenarioVersion {
  return {
    scenarioVersionId: `${scenarioId}-v1`,
    scenarioId,
    version: 1,
    propertyRef,
    regionRef,
    npcRefs: [npcRef],
    budget: '依情境揭露',
    objectives,
    hiddenInformation,
    events,
    successConditions,
    failureConditions,
    riskRules,
    knowledgeRefs,
    marketSnapshotRef,
    status: 'PUBLISHED',
  };
}

function scenario(
  scenarioId: string,
  name: string,
  difficulty: TrainingScenario['difficulty'],
  trainingTags: readonly string[],
  propertyRef: string,
  regionRef: string,
  npcValue: TrainingNpc,
  scenarioVersion: TrainingScenarioVersion,
): TrainingScenario {
  return {
    scenarioId,
    name,
    difficulty,
    trainingTags,
    propertyRef,
    regionRef,
    npcRefs: scenarioVersion.npcRefs,
    budget: scenarioVersion.budget,
    objectives: scenarioVersion.objectives,
    hiddenInformation: scenarioVersion.hiddenInformation,
    events: scenarioVersion.events,
    successConditions: scenarioVersion.successConditions,
    failureConditions: scenarioVersion.failureConditions,
    riskRules: scenarioVersion.riskRules,
    knowledgeRefs: scenarioVersion.knowledgeRefs,
    marketSnapshotRef: scenarioVersion.marketSnapshotRef,
    version: scenarioVersion.version,
    status: scenarioVersion.status,
    npc: npcValue,
    currentVersionId: scenarioVersion.scenarioVersionId,
    versions: [scenarioVersion],
  };
}

const s01Npc = npc('S01-NPC', '首次接觸的買方', '謹慎、重視家庭需求', '尚未明確', ['通勤便利', '家庭空間'], ['對月付負擔敏感'], ['先看看、不急著決定'], '需要先建立信任與需求脈絡');
const s01Version = version('S01', 'property-zuoying-2br', 'zuoying-hsr-district', 'mock-market-zuoying-2026-q3', s01Npc.npcId, [objective('S01-O1', '完成需求探索', 0.6, ['確認居住成員與通勤需求']), objective('S01-O2', '建立下一步共識', 0.4, ['提出符合需求的後續安排'])], ['真正可接受的月付區間', '家庭成員對房間數的期待'], ['開場接待', '需求追問', '預算確認', '下一步邀約'], ['以問題理解需求', '不先假設預算或購屋動機'], ['只背誦物件賣點', '未確認需求就施壓'], [riskRule('S01-R1', '未確認需求即承諾結果', 'MEDIUM')], [knowledgeReference('S01', 'DISCOVERY-BOUNDARY')]);

const s02Npc = npc('S02-NPC', '第一次帶看的買方', '理性比較、容易分心', '約 1,100 萬上下', ['採光與動線', '回家交通'], ['擔心看完仍無法比較'], ['格局看不懂', '想再多看幾間'], '需要看見可比較的觀察依據');
const s02Version = version('S02', 'property-gushan-3br', 'gushan-art-district', 'mock-market-gushan-2026-q3', s02Npc.npcId, [objective('S02-O1', '設計有結構的帶看', 0.5, ['依生活動線說明空間']), objective('S02-O2', '確認看屋反應', 0.5, ['在離場前整理疑問與偏好'])], ['同行家人更在意收納', '買方不希望被逼迫當場決定'], ['看屋前 briefing', '空間動線介紹', '關鍵疑問確認', '離場回顧'], ['連結場景與需求', '保留比較與提問時間'], ['全程只做單向解說', '忽略同行者反應'], [riskRule('S02-R1', '用未驗證資訊承諾周邊條件', 'HIGH')], [knowledgeReference('S02', 'PROPERTY-DISCLOSURE')]);

const s03Npc = npc('S03-NPC', '質疑開價高於實價的買方', '直接、重視證據', '希望控制總價', ['理解價格差異', '評估議價空間'], ['害怕買貴而被家人責備'], ['附近成交比較低', '開價沒有依據'], '沒有可信行情依據前不進入議價');
const s03Version = version('S03', 'property-fengshan-metro', 'fengshan-metro-district', 'mock-market-fengshan-2026-q3', s03Npc.npcId, [objective('S03-O1', '正確使用行情脈絡', 0.6, ['先確認比較條件再引用資料']), objective('S03-O2', '回應價格異議', 0.4, ['承認疑慮並提出可驗證下一步'])], ['買方也在比較另一個社區', '家人對總價有硬上限'], ['提出價格疑慮', '條件澄清', '行情證據說明', '下一步討論'], ['不否定客戶疑慮', '清楚區分成交資料與推測'], ['以單一數字壓過疑慮', '把 Mock 行情當成正式估價'], [riskRule('S03-R1', '將未驗證行情說成保證價格', 'HIGH')], [knowledgeReference('S03', 'MARKET-INTERPRETATION')]);

const s04Npc = npc('S04-NPC', '提出低價的買方', '善於試探、等待讓步', '有明確總價上限', ['爭取合理條件', '降低付款壓力'], ['希望賣方先透露底線'], ['先出低價測試', '其他物件比較便宜'], '不在需求與證據不明時承諾底價');
const s04Version = version('S04', 'property-zuoying-2br', 'zuoying-hsr-district', 'mock-market-zuoying-2026-q3', s04Npc.npcId, [objective('S04-O1', '探索低價背後原因', 0.45, ['詢問總價、付款與時程考量']), objective('S04-O2', '建立議價邊界', 0.55, ['整理可回報條件而不擅自承諾'])], ['付款方式影響可接受價格', '買方有時間壓力但不會先說'], ['低價提出', '動機探索', '條件交換', '回報與追蹤'], ['把價格與條件一起討論', '未授權事項清楚標記'], ['直接接受或拒絕而未探索', '虛構屋主底價'], [riskRule('S04-R1', '未授權承諾折讓或成交', 'HIGH')], [knowledgeReference('S04', 'NEGOTIATION-AUTHORITY')]);

const s05Npc = npc('S05-NPC', '不願降價的屋主', '防禦、重視資產價值', '期待維持原有價格', ['理解市場反應', '保留控制感'], ['擔心降價代表失敗', '可能有搬遷時程'], ['不想降價', '鄰居也賣更高'], '需要以證據與選項討論，不接受未授權保證');
const s05Version = version('S05', 'property-gushan-3br', 'gushan-art-district', 'mock-market-gushan-2026-q3', s05Npc.npcId, [objective('S05-O1', '理解屋主底層顧慮', 0.45, ['探索價格之外的時程與心理因素']), objective('S05-O2', '提出可驗證的市場方案', 0.55, ['以選項而非壓迫方式討論'])], ['屋主可能有搬遷期限', '屋主將價格視為資產認同'], ['屋主表達抗拒', '顧慮探索', '市場反應整理', '方案選項'], ['尊重屋主決策權', '清楚標示需再驗證的市場資訊'], ['用未驗證成交資料施壓', '承諾必然成交'], [riskRule('S05-R1', '將推測性市場結果當成承諾', 'HIGH')], [knowledgeReference('S05', 'OWNER-ADVISORY')]);

const scenarios: TrainingScenario[] = [
  scenario('S01', '首次接待買方', 'BEGINNER', ['Needs Discovery', 'Communication'], s01Version.propertyRef, s01Version.regionRef, s01Npc, s01Version),
  scenario('S02', '第一次帶看', 'BEGINNER', ['Property Knowledge', 'Communication'], s02Version.propertyRef, s02Version.regionRef, s02Npc, s02Version),
  scenario('S03', '客戶質疑開價高於實價', 'INTERMEDIATE', ['Market Interpretation', 'Objection Handling', 'Risk Awareness'], s03Version.propertyRef, s03Version.regionRef, s03Npc, s03Version),
  scenario('S04', '買方出低價／議價', 'INTERMEDIATE', ['Needs Discovery', 'Negotiation', 'Risk Awareness'], s04Version.propertyRef, s04Version.regionRef, s04Npc, s04Version),
  scenario('S05', '屋主不願降價', 'ADVANCED', ['Communication', 'Negotiation', 'Professionalism'], s05Version.propertyRef, s05Version.regionRef, s05Npc, s05Version),
];

export const mvpTrainingScenarios: readonly TrainingScenario[] = deepFreeze(scenarios);

export const MVP_TRAINING_SCENARIO_IDS = ['S01', 'S02', 'S03', 'S04', 'S05'] as const;
