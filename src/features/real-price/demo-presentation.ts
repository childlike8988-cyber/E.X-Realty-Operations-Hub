import type {RealtyDemoCase} from '@/data/mock/real-price/demo-cases/types';
import {createMarketInsight} from './insights/market-insight';
import type {MarketProposalPackage} from './proposal-templates/types';

export const demoPresentationSteps = [
  {id:'case',title:'選擇展示案例',description:'快速載入預設生活圈資料。'},
  {id:'market',title:'區域行情分析',description:'用成交資料看見社區的市場輪廓。'},
  {id:'comparison',title:'社區比較',description:'比較兩個社區的單價與成交量。'},
  {id:'transaction',title:'成交案例',description:'以單一案例說明市場定位。'},
  {id:'proposal',title:'產生市場提案',description:'輸出可供客戶閱讀的完整報告。'},
] as const;

export type DemoPresentationStepId = (typeof demoPresentationSteps)[number]['id'];
export type CompleteMarketReportSectionId = 'cover' | 'area-introduction' | 'market-transactions' | 'community-analysis' | 'community-comparison' | 'transaction-case' | 'brand-information' | 'data-source' | 'market-insight' | 'property-intelligence';
export type CompleteMarketReportSection = {id:CompleteMarketReportSectionId;title:string;subtitle:string;highlights:string[];};
export type CompleteMarketReport = {title:string;fileBaseName:string;generatedAt:string;source:'MOCK';sections:CompleteMarketReportSection[];};

const number = (value:number) => value.toLocaleString('zh-TW',{maximumFractionDigits:1});

export function createCompleteMarketReport(demoCase:RealtyDemoCase, proposal:MarketProposalPackage):CompleteMarketReport {
  const {communitySummary,comparison,transaction,branding,priceTrend,propertyContext} = proposal;
  const insight = createMarketInsight({demoCase,summary:communitySummary,comparison});
  const comparisonSummary = comparison ? `${comparison.communityA.community} 與 ${comparison.communityB.community} 平均單價差 ${number(Math.abs(comparison.averageUnitPriceDifference))} 萬/坪。` : '目前沒有可比較的第二個社區資料。';
  const propertySection:CompleteMarketReportSection[] = propertyContext ? [{id:'property-intelligence',title:'Property Intelligence',subtitle:propertyContext.score.label,highlights:[`物件定位：${propertyContext.property.title}｜${propertyContext.targetCustomer}`,`生活圈價值：${propertyContext.locationSummary}`,`銷售策略：${propertyContext.salesStrategy}`,`整體評分：${propertyContext.score.overallScore}/100`]}] : [];
  return {title:`${demoCase.title} 市場分析報告`,fileBaseName:`${demoCase.caseId}_Market_Report`,generatedAt:proposal.generatedAt,source:'MOCK',sections:[
    {id:'cover',title:'E.X Realty Data Tools',subtitle:'市場分析報告',highlights:[demoCase.title,demoCase.shortDescription,'展示資料：Mock Data']},
    {id:'area-introduction',title:'區域介紹',subtitle:demoCase.district,highlights:[demoCase.description,`目標對象：${demoCase.targetAudience}`,`建議情境：${demoCase.recommendedScenario}`]},
    {id:'market-transactions',title:'成交行情',subtitle:communitySummary.community,highlights:[`成交筆數：${communitySummary.transactionCount} 筆`,`平均單價：${number(communitySummary.averageUnitPrice)} 萬/坪`,`價格趨勢資料點：${priceTrend.length} 筆`]},
    {id:'community-analysis',title:'社區分析',subtitle:communitySummary.community,highlights:[`最高單價：${number(communitySummary.highestUnitPrice)} 萬/坪`,`最低單價：${number(communitySummary.lowestUnitPrice)} 萬/坪`,`平均屋齡：${number(communitySummary.averageBuildingAge)} 年`]},
    {id:'community-comparison',title:'社區比較',subtitle:comparison ? `${comparison.communityA.community} vs ${comparison.communityB.community}` : '社區比較',highlights:[comparisonSummary,comparison ? `成交量差異：${comparison.transactionCountDifference >= 0 ? '+' : ''}${comparison.transactionCountDifference} 筆` : '無比較資料',comparison?.higherAverageUnitPriceCommunity ? `平均單價較高：${comparison.higherAverageUnitPriceCommunity}` : '平均單價相同']},
    {id:'transaction-case',title:'成交案例',subtitle:transaction?.community ?? communitySummary.community,highlights:transaction ? [`成交日期：${transaction.transactionDate}`,`坪數／樓層：${number(transaction.areaPing)} 坪／${transaction.floor}`,`總價／單價：${number(transaction.totalPrice)} 萬／${number(transaction.unitPrice)} 萬/坪`] : ['尚無指定成交案例']},
    {id:'brand-information',title:'品牌資訊',subtitle:branding.companyName,highlights:[`分店：${branding.branchName}`,`顧問：${branding.agentName}`,branding.brandMessage]},
    {id:'data-source',title:'資料來源與限制',subtitle:'Mock Data',highlights:['本報告僅供產品展示與內部情境演示。','未串接政府實價登錄、外部 API 或即時資料。',`產生時間：${new Date(proposal.generatedAt).toLocaleString('zh-TW')}`]},
    {id:'market-insight',title:'AI Market Insight',subtitle:insight.label,highlights:[insight.marketSummary,insight.salesRecommendation,insight.customerPositioning]},
    ...propertySection,
  ]};
}
