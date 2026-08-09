import { realtyDemoCases } from '@/data/mock/real-price/demo-cases/demo-cases';
import type { RealtyDemoCase } from '@/data/mock/real-price/demo-cases/types';
import type { RealPriceQuery } from './types';

export type CaseGuideStep = {
  id: 'market' | 'community' | 'compare' | 'location' | 'proposal';
  title: string;
  route: string;
};

export const caseGuideSteps: CaseGuideStep[] = [
  { id: 'market', title: '行情', route: '#transaction-search' },
  { id: 'community', title: '社區', route: '/tools/real-price/community' },
  { id: 'compare', title: '比較', route: '/tools/real-price/compare' },
  { id: 'location', title: '生活圈', route: '/tools/location-intelligence' },
  { id: 'proposal', title: '提案', route: '/tools/real-price/proposal' },
];

export function createCaseGuideQuery(demoCase: RealtyDemoCase): RealPriceQuery {
  return { city: '高雄市', district: demoCase.district, road: '', community: demoCase.community, addressKeyword: '', buildingType: '', ageRange: '', period: 'all' };
}

export function getCaseGuideCase(caseId: string) {
  return realtyDemoCases.find((item) => item.caseId === caseId) ?? null;
}
