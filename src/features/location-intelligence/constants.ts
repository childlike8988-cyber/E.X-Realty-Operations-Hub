import type {NearbyPlaceType, PropertyAnalysisFlow} from './types';

export const LIFESTYLE_SCORE_RULES = {
  school: 20,
  mrt: 20,
  market: 15,
  park: 15,
  shopping: 15,
  hospital: 15,
  maximum: 100,
} as const;

export const NEARBY_PLACE_LABELS: Record<NearbyPlaceType,string> = {
  school:'學區',mrt:'捷運／交通',market:'市場',park:'公園',shopping:'商圈',hospital:'醫療',university:'大學',
};

export const PROPERTY_ANALYSIS_FLOW_TEMPLATE: Omit<PropertyAnalysisFlow,'propertyId'> = {
  stages:['real-price','location-intelligence','ai-proposal'],source:'MOCK',
};
