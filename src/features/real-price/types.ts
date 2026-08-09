export type BuildingType = '大樓' | '華廈' | '公寓' | '透天' | '土地';
export type TransactionSource = 'MOCK';
export type AgeRange = '' | '0-5' | '5-15' | '15+';

export type RealEstateTransaction = {
  id: string;
  city: string;
  district: string;
  road: string;
  community: string;
  address: string;
  buildingAge: number;
  transactionDate: string;
  buildingType: BuildingType;
  floor: string;
  areaPing: number;
  totalPrice: number;
  unitPrice: number;
  rooms: string;
  parking: string;
  source: TransactionSource;
};

export type RealPriceQuery = {
  city: string;
  district: string;
  road?: string;
  community: string;
  addressKeyword?: string;
  buildingType: string;
  ageRange?: AgeRange;
  period: string;
};

export interface TransactionRepository {
  getTransactions(): readonly RealEstateTransaction[];
}

export type CommunitySummary = {
  community: string;
  transactionCount: number;
  averageUnitPrice: number;
  highestUnitPrice: number;
  lowestUnitPrice: number;
  averageTotalPrice: number;
  averageAreaPing: number;
  averageBuildingAge: number;
  source: TransactionSource;
};

export type TransactionComparison = {
  unitPriceDifference: number;
  unitPriceDifferencePercent: number;
  direction: 'above' | 'below' | 'equal';
};

export type ComparisonResult = {
  communityA: CommunitySummary;
  communityB: CommunitySummary;
  averageUnitPriceDifference: number;
  averageUnitPriceDifferencePercent: number;
  transactionCountDifference: number;
  higherAverageUnitPriceCommunity: string | null;
};
