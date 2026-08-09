export type DemoStep = {
  id: 'overview' | 'market' | 'location' | 'intelligence' | 'marketing' | 'creative' | 'proposal';
  title: string;
  description: string;
  route: string;
  order: number;
};

export type DemoCase = {
  caseId: 'gushan-art-district' | 'zuoying-hsr-district' | 'fengshan-metro-district';
  title: string;
  subtitle: string;
  propertyId: string;
  audience: string;
  coverStyle: string;
  description: string;
  suitableFor: string;
  salesScenario: string;
};

export const demoSteps: DemoStep[] = [
  { id: 'overview', title: 'Property Overview', description: '案件基本資料與展示定位。', route: '/tools/property-analysis', order: 1 },
  { id: 'market', title: 'Market Analysis', description: 'Mock 成交行情與社區摘要。', route: '/tools/real-price', order: 2 },
  { id: 'location', title: 'Location Intelligence', description: '生活圈與周邊機能評估。', route: '/tools/location-intelligence', order: 3 },
  { id: 'intelligence', title: 'Property Intelligence', description: '市場、生活圈與銷售定位整合。', route: '/tools/property-analysis', order: 4 },
  { id: 'marketing', title: 'Marketing Content', description: '規則式 Mock 行銷內容。', route: '/tools/property-marketing', order: 5 },
  { id: 'creative', title: 'Creative Studio', description: '固定模板素材製作工作台。', route: '/tools/creative-studio', order: 6 },
  { id: 'proposal', title: 'Proposal Export', description: '市場提案包與 PDF 匯出預留。', route: '/tools/real-price/proposal', order: 7 },
];

export const demoCases: DemoCase[] = [
  { caseId: 'gushan-art-district', title: '鼓山美術館生活圈', subtitle: '高質感住宅／豪宅市場展示', propertyId: 'property-gushan-3br', audience: '換屋族、高資產客群', coverStyle: 'from-amber-300/30 via-slate-900 to-blue-950', description: '以美術館生活圈的高質感居住環境與區域價值，示範高資產客群的市場溝通。', suitableFor: '公司主管、豪宅團隊、換屋客群提案', salesScenario: '先建立生活圈價值，再以成交案例與市場比較建立信任。' },
  { caseId: 'zuoying-hsr-district', title: '左營高鐵生活圈', subtitle: '交通便利／首購與投資市場展示', propertyId: 'property-zuoying-2br', audience: '首購族、投資族', coverStyle: 'from-cyan-300/25 via-slate-900 to-blue-950', description: '以高鐵、捷運與交通節點的便利性，示範首購與投資客的數據化分析。', suitableFor: '首購團隊、投資型客群、交通宅提案', salesScenario: '以交通便利、總價與社區行情的比較，建立購買決策節奏。' },
  { caseId: 'fengshan-metro-district', title: '鳳山捷運生活圈', subtitle: '家庭住宅／生活機能市場展示', propertyId: 'property-fengshan-metro', audience: '自住家庭', coverStyle: 'from-violet-300/25 via-slate-900 to-blue-950', description: '以捷運、學區與成熟生活機能，示範小家庭自住型客群的居住價值說法。', suitableFor: '自住家庭、小家庭置產、區域經營提案', salesScenario: '先呈現生活便利與家庭需求，再引導到物件與價格比較。' },
];

export const demoCaseMapAnalysis: Record<DemoCase['caseId'], { regionId: string; route: string }> = {
  'gushan-art-district': { regionId: 'gushan-art-district', route: '/tools/real-price/map' },
  'zuoying-hsr-district': { regionId: 'zuoying-hsr-district', route: '/tools/real-price/map' },
  'fengshan-metro-district': { regionId: 'fengshan-metro-district', route: '/tools/real-price/map' },
};

export function getDemoCase(caseId: string) {
  return demoCases.find((item) => item.caseId === caseId) ?? null;
}

export function moveDemoStep(currentIndex: number, direction: 'previous' | 'next') {
  const next = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
  return Math.max(0, Math.min(demoSteps.length - 1, next));
}
