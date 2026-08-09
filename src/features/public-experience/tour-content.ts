export type ProductTourStep = {
  id: string;
  order: number;
  title: string;
  question: string;
  solution: string;
  route: string;
  actionLabel: string;
};

export const productTourSteps: ProductTourStep[] = [
  { id: 'property', order: 1, title: '案件建立', question: '案件資訊散落在訊息、表格與個人筆記，如何快速整理？', solution: '以單一案件視角整合基本條件、價格與銷售定位。', route: '/tools/property-analysis', actionLabel: '查看案件智慧分析' },
  { id: 'market', order: 2, title: '市場分析', question: '如何讓價格建議有可閱讀的市場依據？', solution: '將 Mock 成交資料轉為摘要、趨勢、成交案例與比較基礎。', route: '/tools/real-price', actionLabel: '查看市場分析' },
  { id: 'location', order: 3, title: '生活圈分析', question: '物件周邊價值如何轉成買方聽得懂的說法？', solution: '以生活圈卡片整理交通、學區、採買、休閒與醫療亮點。', route: '/tools/location-intelligence', actionLabel: '查看生活圈分析' },
  { id: 'proposal', order: 4, title: '智慧提案', question: '市場資料如何變成可對客戶說明的內容？', solution: '以固定提案模板組合社區、市場比較、案例與品牌資訊。', route: '/tools/real-price/proposal', actionLabel: '查看市場提案' },
  { id: 'marketing', order: 5, title: '行銷素材', question: '不同社群渠道的文案是否需要重複撰寫？', solution: '以案件行銷 Context 產生展示用的多平台內容草稿。', route: '/tools/property-marketing', actionLabel: '查看行銷內容' },
  { id: 'creative', order: 6, title: 'Creative Studio', question: '素材製作如何維持品牌一致與交付效率？', solution: '以固定模板、Mock 素材與瀏覽器端預覽完成素材工作流程。', route: '/tools/creative-studio', actionLabel: '查看 Creative Studio' },
];

export const workflowComparison = [
  { traditional: '人工搜尋', aiWorkflow: '資料分析' },
  { traditional: '人工整理', aiWorkflow: '市場洞察' },
  { traditional: '人工製作', aiWorkflow: '自動提案' },
  { traditional: '人工排版', aiWorkflow: '快速產出' },
] as const;

export const demoCompletionCapabilities = [
  'Data Intelligence',
  'Property Intelligence',
  'Marketing Automation',
  'Creative Production',
] as const;
