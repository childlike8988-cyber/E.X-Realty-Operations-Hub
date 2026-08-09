import type {LifestyleScore} from '@/features/location-intelligence/types';
import type {RealEstateTransaction} from '@/features/real-price/types';

export type PropertyProfile = {
  id: string;
  title: string;
  district: string;
  address: string;
  buildingType: string;
  rooms: string;
  areaPing: number;
  age: number;
  floor: string;
  totalPrice: number;
  unitPrice: number;
  community: string;
  locationId: string;
  realPriceCaseId: string;
  targetCustomer: string;
  sellingPoints: string[];
  salesStrategy: string;
  source: 'MOCK';
};

export type PropertyAnalysis = {
  property: PropertyProfile;
  marketSummary: string;
  locationSummary: string;
  targetCustomer: string;
  sellingPoints: string[];
  salesStrategy: string;
  lifestyleScore: LifestyleScore;
  source: 'MOCK';
};

export type PropertyScore = {
  label: 'Demo Generated Score';
  marketScore: number;
  locationScore: number;
  valueScore: number;
  overallScore: number;
  source: 'MOCK';
};

export type PropertyInsight = {
  title: string;
  recommendation: string;
  sellingPoints: string[];
  salesStrategy: string;
  source: 'MOCK';
};

export type SalesTalkingPoints = {
  opening: string;
  features: string;
  price: string;
  area: string;
  comparison: string;
};

export type PropertyProposalContext = {
  propertyId: string;
  property: PropertyProfile;
  analysis: PropertyAnalysis;
  score: PropertyScore;
  marketSummary: string;
  locationSummary: string;
  targetCustomer: string;
  sellingPoints: string[];
  salesStrategy: string;
  salesTalkingPoints: SalesTalkingPoints;
  transaction: RealEstateTransaction | null;
  source: 'MOCK';
};
