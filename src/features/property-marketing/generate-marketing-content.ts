import type {PropertyCreativeContext, PropertyMarketingContent, PropertyMarketingContext} from './types';

export function generateMarketingContent(context:PropertyMarketingContext):PropertyMarketingContent {
  const points = context.sellingPoints;
  const headline = `${context.propertyName}｜${points[0] ?? '生活機能完整'}`;
  return {
    listing591:{title:headline,subtitle:context.propertySummary,body:`適合${context.targetAudience}的展示物件。${context.locationHighlights} ${context.priceHighlights}`,sellingPoints:points,callToAction:context.callToAction},
    facebook:{title:`【${context.propertyName}】市場分析與生活圈亮點一次掌握`,body:`正在尋找適合${context.targetAudience}的物件嗎？\n\n${context.propertySummary}\n\n${points.map((point) => `✓ ${point}`).join('\n')}\n\n${context.locationHighlights}\n${context.priceHighlights}\n\n${context.callToAction}\n\n#${context.keywords.slice(0,4).join(' #')}`,sellingPoints:points,callToAction:context.callToAction},
    instagram:{title:headline,body:`${context.propertySummary}\n${points.slice(0,3).map((point) => `• ${point}`).join('\n')}\n${context.locationHighlights}\n${context.callToAction}\n#${context.keywords.slice(0,4).join(' #')}`,sellingPoints:points.slice(0,3),callToAction:context.callToAction},
    line:{title:`推薦物件｜${context.propertyName}`,body:`${context.propertySummary}\n推薦給重視${context.targetAudience}的客戶。\n${points.slice(0,2).join('、')}。\n${context.priceHighlights}`,sellingPoints:points.slice(0,2),callToAction:context.callToAction},
    tvWall:{title:context.propertyName,subtitle:context.propertySummary,body:`${points.slice(0,2).join(' · ')}｜${context.targetAudience}`,sellingPoints:points.slice(0,2),callToAction:'歡迎洽詢物件資訊'},
    source:'MOCK',
  };
}

export function createPropertyCreativeContext(context:PropertyMarketingContext):PropertyCreativeContext {
  return {propertyName:context.propertyName,imagePrompt:`高質感房仲物件行銷視覺，主題：${context.propertyName}，強調${context.sellingPoints.slice(0,2).join('與')}。`,visualStyle:'專業房仲企業風格、深海軍藍、冷白、少量金色點綴',sceneSuggestions:['建築外觀與街景情境','客廳採光與居住尺度','生活圈重點圖文卡'],videoConcept:`30 秒物件亮點短片：${context.propertySummary}，依序呈現生活圈、核心賣點與預約 CTA。`,source:'MOCK'};
}
