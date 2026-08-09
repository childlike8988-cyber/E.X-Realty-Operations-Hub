import type {ProposalTemplate} from './types';

const sections = ['cover','area-summary','community-analysis','transaction-case','comparison-analysis','price-trend','source','branding'] as const;

export const proposalTemplates:ProposalTemplate[] = [
  {templateId:'business-standard',name:'Business Standard',description:'商務標準版：平衡呈現區域、社區與成交資訊。',coverStyle:'business',layout:'balanced',supportedSections:[...sections]},
  {templateId:'luxury-real-estate',name:'Luxury Real Estate',description:'豪宅精品版：以深色、金色與精簡數據建立高質感提案。',coverStyle:'luxury',layout:'editorial',supportedSections:[...sections]},
  {templateId:'ai-data-style',name:'AI Data Style',description:'科技分析版：突出趨勢、比較與資料來源。',coverStyle:'data',layout:'dashboard',supportedSections:[...sections]},
  {templateId:'minimal',name:'Minimal',description:'極簡版：以留白與關鍵市場結論建立易讀素材。',coverStyle:'minimal',layout:'clean',supportedSections:[...sections]},
];

export function getProposalTemplate(templateId:string):ProposalTemplate {
  return proposalTemplates.find((template)=>template.templateId===templateId) ?? proposalTemplates[0];
}
