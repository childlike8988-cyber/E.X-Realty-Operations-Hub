import type {PropertyAnalysis, PropertyInsight} from './types';

export function createPropertyInsight(analysis:PropertyAnalysis):PropertyInsight {
  return {title:`${analysis.property.title} 銷售洞察`,recommendation:`推薦客群：${analysis.targetCustomer}。${analysis.locationSummary}`,sellingPoints:analysis.sellingPoints,salesStrategy:analysis.salesStrategy,source:'MOCK'};
}
