import type {PropertyProposalContext} from './types';
import type {PropertyMarketingContext} from '@/features/property-marketing/types';

export function adaptProposalContextToMarketingContext(context:PropertyProposalContext):PropertyMarketingContext {
  const property = context.property;
  const priceHighlights = `展示總價 ${property.totalPrice.toLocaleString()} 萬，單價 ${property.unitPrice.toFixed(1)} 萬/坪；${context.marketSummary}`;
  return {
    propertyName:property.title,
    propertySummary:`${property.buildingType}｜${property.rooms}｜${property.areaPing} 坪｜${property.floor}｜屋齡 ${property.age} 年`,
    targetAudience:context.targetCustomer,
    sellingPoints:context.sellingPoints,
    locationHighlights:context.locationSummary,
    priceHighlights,
    callToAction:'歡迎預約了解物件細節與市場分析展示內容。',
    keywords:[property.district,property.community,...context.sellingPoints.slice(0,2),context.targetCustomer,'Mock Data'],
    source:'MOCK',
  };
}
