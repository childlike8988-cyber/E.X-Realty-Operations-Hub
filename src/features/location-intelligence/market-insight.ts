import type { AreaRegion } from './map/types';

export type MarketInsight = {
  title: string;
  summary: string;
  reasons: string[];
  audiences: string[];
  label: 'Demo Generated Insight';
  source: 'MOCK DATA';
};

export function generateMarketInsight(region: AreaRegion): MarketInsight {
  const highValue = region.averagePrice >= 40;
  const transportFocused = region.lifestyleTags.some((tag) => tag.includes('交通') || tag.includes('捷運'));
  const audiences = highValue ? ['換屋家庭', '高資產自住族'] : transportFocused ? ['首購族', '交通便利型買方'] : ['小家庭自住族', '重視生活機能買方'];
  const summary = highValue ? '高總價住宅市場集中，適合以生活品質與區域稀有性建立價格溝通。' : transportFocused ? '交通與生活機能帶動區域關注，適合以通勤便利與產品選擇說明市場價值。' : '自住需求穩定，適合以家庭生活、周邊機能與成交案例建立信任。';
  return { title: `${region.name} 市場洞察`, summary, reasons: region.lifestyleTags, audiences, label: 'Demo Generated Insight', source: 'MOCK DATA' };
}
