import {calculateLifestyleScore,createLocationInsight} from '@/features/location-intelligence/analysis';
import {locationDemoCases} from '@/features/location-intelligence/mock-data';
import {realPriceTransactions} from '@/data/mock/real-price/real-price-data';
import {generateSalesTalkingPoints} from './sales-talking-points';
import type {PropertyAnalysis, PropertyProfile, PropertyProposalContext, PropertyScore, SalesTalkingPoints} from './types';

export function generatePropertyAnalysis(property:PropertyProfile):PropertyAnalysis {
  const locationCase = locationDemoCases.find((item) => item.id === property.locationId);
  if(!locationCase) throw new Error(`Missing Mock location reference: ${property.locationId}`);
  const lifestyleScore = calculateLifestyleScore(locationCase.nearbyPlaces);
  const locationInsight = createLocationInsight(locationCase.property,locationCase.nearbyPlaces,lifestyleScore);
  const transactions = realPriceTransactions.filter((item) => item.community === property.community);
  const averageUnitPrice = transactions.length ? transactions.reduce((sum,item) => sum + item.unitPrice,0) / transactions.length : property.unitPrice;
  const marketSummary = `${property.community} Mock 成交 ${transactions.length} 筆，平均單價 ${averageUnitPrice.toFixed(1)} 萬/坪；本物件單價 ${property.unitPrice.toFixed(1)} 萬/坪。`;
  return {property,marketSummary,locationSummary:locationInsight.summary,targetCustomer:property.targetCustomer,sellingPoints:property.sellingPoints,salesStrategy:property.salesStrategy,lifestyleScore,source:'MOCK'};
}

export function createPropertyProposalContext(analysis:PropertyAnalysis, score:PropertyScore, transaction:null|PropertyProposalContext['transaction']=null, salesTalkingPoints:SalesTalkingPoints=generateSalesTalkingPoints(analysis)):PropertyProposalContext {
  return {propertyId:analysis.property.id,property:analysis.property,analysis,score,marketSummary:analysis.marketSummary,locationSummary:analysis.locationSummary,targetCustomer:analysis.targetCustomer,sellingPoints:analysis.sellingPoints,salesStrategy:analysis.salesStrategy,salesTalkingPoints,transaction,source:'MOCK'};
}
