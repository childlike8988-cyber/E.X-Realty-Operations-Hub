import type {RealtyDemoCase} from '@/data/mock/real-price/demo-cases/types';
import type {CommunitySummary, ComparisonResult} from '../types';

export type MarketInsight = {
  label: 'Demo Generated Insight';
  marketSummary: string;
  salesRecommendation: string;
  customerPositioning: string;
};

export function createMarketInsight({demoCase,summary,comparison}:{demoCase:RealtyDemoCase;summary:CommunitySummary;comparison:ComparisonResult|null}):MarketInsight {
  const pricePosition = comparison && comparison.averageUnitPriceDifference > 0 ? '高於比較社區平均' : comparison && comparison.averageUnitPriceDifference < 0 ? '低於比較社區平均' : '與比較社區平均相近';
  const marketSummary = `${summary.community} 近期待成交共 ${summary.transactionCount} 筆，平均單價 ${summary.averageUnitPrice.toFixed(1)} 萬/坪，${pricePosition}。${demoCase.marketInsight}`;
  const salesRecommendation = `${demoCase.recommendedStrategy} 銷售溝通可聚焦於${demoCase.salesFocus}。`;
  return {label:'Demo Generated Insight',marketSummary,salesRecommendation,customerPositioning:`建議客群：${demoCase.targetCustomer}。`};
}
