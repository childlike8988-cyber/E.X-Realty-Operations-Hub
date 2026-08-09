import type {PropertyMarketingContent, PropertyMarketingContext} from '@/features/property-marketing/types';
import type {CreativeContext} from './types';

export function createCreativeContext(marketingContext:PropertyMarketingContext, marketingContent:PropertyMarketingContent):CreativeContext {
  return {propertyName:marketingContext.propertyName,propertySummary:marketingContext.propertySummary,marketingContent,sellingPoints:marketingContext.sellingPoints,targetAudience:marketingContext.targetAudience,brandInfo:{companyName:'E.X Realty Data Tools',brandMessage:'用清楚資料與一致視覺，協助客戶理解物件價值。',primaryColor:'#7ea7ff',secondaryColor:'#f4c96a'},suggestedVisualStyle:'專業房仲企業視覺，深海軍藍、冷白與少量金色點綴，清楚數據層級。',imagePromptDraft:`房仲物件行銷視覺：${marketingContext.propertyName}。凸顯${marketingContext.sellingPoints.slice(0,2).join('、')}，受眾為${marketingContext.targetAudience}。`,videoConceptDraft:`30 秒物件行銷概念：以${marketingContext.propertySummary}開場，依序呈現生活圈、賣點、價格定位與預約 CTA。`,source:'MOCK'};
}
