import type { ReportSection } from './types';

export const PROPERTY_REPORT_SECTIONS: readonly ReportSection[] = [
  {id: 'cover', order: 1, title: '房產市場智慧報告', eyebrow: '01 / COVER', conclusion: '用一頁看懂物件定位與這份市場報告的閱讀方向。'},
  {id: 'overview', order: 2, title: '物件概覽', eyebrow: '02 / PROPERTY OVERVIEW', conclusion: '先從物件條件與空間配置，建立客戶的第一個判斷框架。'},
  {id: 'market-analysis', order: 3, title: '市場行情分析', eyebrow: '03 / MARKET ANALYSIS', conclusion: '以近期成交資料說明社區價格帶與市場脈絡。'},
  {id: 'area-map', order: 4, title: '區域地圖', eyebrow: '04 / AREA MAP', conclusion: '把價格、行政區與生活圈標籤放回城市位置理解。'},
  {id: 'lifestyle', order: 5, title: '生活圈智慧分析', eyebrow: '05 / LIFESTYLE INTELLIGENCE', conclusion: '從交通、學區、採買與休閒機能看見居住價值。'},
  {id: 'comparison', order: 6, title: '市場比較', eyebrow: '06 / MARKET COMPARISON', conclusion: '把本案放進可比社區與區域平均，形成清楚的價格對話。'},
  {id: 'sales-positioning', order: 7, title: '銷售定位', eyebrow: '07 / SALES POSITIONING', conclusion: '將資料整理為目標客群、核心賣點與下一步溝通策略。'},
  {id: 'contact', order: 8, title: '聯絡與下一步', eyebrow: '08 / CONTACT', conclusion: '以品牌與顧問資訊收束報告，邀請客戶進入下一次討論。'},
] as const;

export const PROPERTY_REPORT_PAGE_COUNT = PROPERTY_REPORT_SECTIONS.length;

