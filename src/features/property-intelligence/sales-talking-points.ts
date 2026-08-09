import type {PropertyAnalysis, SalesTalkingPoints} from './types';

export function generateSalesTalkingPoints(analysis:PropertyAnalysis):SalesTalkingPoints {
  const property = analysis.property;
  return {
    opening:`若重視${analysis.targetCustomer}的生活品質，${property.title}可從${analysis.sellingPoints[0]}開始說明。`,
    features:`物件為${property.rooms}、${property.areaPing}坪、${property.floor}，核心亮點包含${analysis.sellingPoints.slice(0,2).join('、')}。`,
    price:`目前展示總價為${property.totalPrice.toLocaleString()}萬，單價${property.unitPrice.toFixed(1)}萬/坪；可搭配社區成交行情進行說明。`,
    area:analysis.locationSummary,
    comparison:`建議先建立${analysis.targetCustomer}的生活需求，再以市場摘要和可比成交案例說明價格定位。`,
  };
}
