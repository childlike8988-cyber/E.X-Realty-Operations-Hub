export type RealPriceShowcaseLink = {
  title: string;
  description: string;
  route: string;
};

export const realPriceStorySteps = [
  '成交資料',
  '社區分析',
  '市場比較',
  '生活圈分析',
  '智慧提案',
] as const;

export const realPriceToolEntries: RealPriceShowcaseLink[] = [
  { title: '實價登錄查詢', description: '以 Mock 成交資料快速篩選、比較與查看趨勢。', route: '#transaction-search' },
  { title: '社區行情分析', description: '聚合社區成交筆數、價格區間與成交量趨勢。', route: '/tools/real-price/community' },
  { title: '社區比較', description: '以雙社區價格、坪數與屋齡資料建立比較素材。', route: '/tools/real-price/compare' },
  { title: '市場提案中心', description: '將市場分析整理成可展示的品牌化市場提案。', route: '/tools/real-price/proposal' },
  { title: 'Demo Showcase', description: '快速載入三組生活圈案例，說明完整產品流程。', route: '/tools/real-price/demo' },
  { title: '完整市場報告', description: '進入展示簡報並體驗瀏覽器端 PDF 報告流程。', route: '/tools/real-price/demo/presentation' },
];

export const realPriceValuePillars = [
  { title: 'Data Intelligence', description: '以可追溯的成交欄位與行情摘要，快速建立分析基礎。' },
  { title: 'Market Analysis', description: '將交易列表轉為社區趨勢、價格比較與生活圈視角。' },
  { title: 'Sales Proposal', description: '把市場資訊轉為客戶可理解的提案與展示素材。' },
] as const;
