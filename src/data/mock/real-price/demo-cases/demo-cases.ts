import type {RealtyDemoCase} from './types';

export const realtyDemoCases: RealtyDemoCase[] = [
  {
    caseId:'gushan-art-district',title:'鼓山區 美術館生活圈',district:'鼓山區',community:'美術館首席',comparisonCommunity:'柴山景觀別墅',
    description:'以高質感生活圈、產品定位與近期成交案例，呈現市場分析與客戶提案流程。',coverImage:'art-district',shortDescription:'高質感生活圈與高樓層成交展示。',targetAudience:'主管／豪宅市場客戶',recommendedScenario:'豪宅市場展示',
    targetCustomer:'換屋族、高資產客群',salesFocus:'豪宅環境、生活品質、區域價值',marketInsight:'藝術生活圈與交通建設帶動區域吸引力。',recommendedStrategy:'以生活圈價值搭配成交案例建立信任。',
    recommendedTemplate:'luxury-real-estate',featuredTransactions:['rp-01','rp-05','rp-07'],
  },
  {
    caseId:'zuoying-hsr-district',title:'左營區 高鐵生活圈',district:'左營區',community:'高鐵綠意居',comparisonCommunity:'美術館首席',
    description:'以交通節點、首購需求與社區成交資料，快速說明生活圈行情差異。',coverImage:'hsr-district',shortDescription:'交通機能與首購市場的數據比較。',targetAudience:'主管／首購與交通宅客戶',recommendedScenario:'首購與交通宅分析',
    targetCustomer:'首購族、投資族',salesFocus:'高鐵交通、通勤便利、生活機能',marketInsight:'交通節點與生活機能為穩定需求提供支撐。',recommendedStrategy:'以通勤便利與成交價格帶建立產品比較。',
    recommendedTemplate:'ai-data-style',featuredTransactions:['rp-09','rp-10','rp-11'],
  },
  {
    caseId:'fengshan-metro-district',title:'鳳山區 捷運生活圈',district:'鳳山區',community:'鳳翔之星',comparisonCommunity:'高醫御品',
    description:'以捷運生活圈與價格帶案例，協助快速建立區域行情展示素材。',coverImage:'metro-district',shortDescription:'捷運生活圈與市場價格帶展示。',targetAudience:'主管／自住型客戶',recommendedScenario:'自住型市場分析',
    targetCustomer:'自住家庭',salesFocus:'捷運便利、居住空間、總價帶',marketInsight:'捷運生活圈的可及性，支持自住家庭的長期需求。',recommendedStrategy:'以實際總價帶與家庭需求建立選屋建議。',
    recommendedTemplate:'minimal',featuredTransactions:['rp-13','rp-14','rp-15'],
  },
];
