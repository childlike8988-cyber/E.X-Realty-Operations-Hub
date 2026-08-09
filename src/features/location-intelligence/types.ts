export type NearbyPlaceType = 'school' | 'mrt' | 'market' | 'park' | 'shopping' | 'hospital' | 'university';

export type PropertyLocation = {
  id: string;
  name: string;
  address: string;
  district: string;
  latitude: number;
  longitude: number;
  source: 'MOCK';
};

export type NearbyPlace = {
  id: string;
  type: NearbyPlaceType;
  name: string;
  distance: number;
  description: string;
  source: 'MOCK';
};

export type LifestyleScore = {
  schoolScore: number;
  transportScore: number;
  shoppingScore: number;
  leisureScore: number;
  overallScore: number;
};

export type LocationInsight = {
  title: string;
  summary: string;
  audience: string;
  source: 'MOCK';
};

export type LocationDemoCase = {
  id: string;
  title: string;
  description: string;
  property: PropertyLocation;
  nearbyPlaces: NearbyPlace[];
};

export type PropertyAnalysisFlow = {
  propertyId: string;
  stages: Array<'real-price' | 'location-intelligence' | 'ai-proposal'>;
  source: 'MOCK';
};
