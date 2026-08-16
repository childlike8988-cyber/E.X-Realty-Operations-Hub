import type { AreaRegion, MapMarker } from '@/features/location-intelligence/map/types';
import type { LifestyleScore, NearbyPlace } from '@/features/location-intelligence/types';
import type { BrandConfig } from '@/features/real-price/branding';
import type { CommunitySummary, RealEstateTransaction } from '@/features/real-price/types';
import type { PropertyProposalContext, PropertyProfile, PropertyScore } from '@/features/property-intelligence/types';

export type ReportAssetStatus = 'AVAILABLE' | 'MISSING' | 'OPTIONAL';

export type ReportAssetKind = 'logo' | 'agent' | 'property' | 'floorplan' | 'map' | 'location' | 'qr';

export type ReportAsset = {
  id: string;
  src: string;
  fallbackSrc?: string;
  alt: string;
  kind: ReportAssetKind;
  status: ReportAssetStatus;
};

export type ReportAgent = {
  name: string;
  phone: string;
  portrait: ReportAsset;
};

export type ReportMarketSummary = {
  community: string;
  transactionCount: number;
  averageUnitPrice: number;
  highestUnitPrice: number;
  lowestUnitPrice: number;
  averageTotalPrice: number;
  averageAreaPing: number;
  averageBuildingAge: number;
  trend: Array<{ date: string; price: number }>;
  recentTransactions: RealEstateTransaction[];
  source: 'MOCK DATA';
};

export type ReportMapSummary = {
  region: AreaRegion;
  markers: MapMarker[];
  mapImage: ReportAsset;
  source: 'MOCK DATA';
};

export type ReportLifestyleSummary = {
  score: LifestyleScore;
  nearbyPlaces: NearbyPlace[];
  categories: Array<{ label: string; value: string; score: number }>;
  insight: string;
  audience: string;
  image: ReportAsset;
  source: 'MOCK DATA';
};

export type ReportComparisonSummary = {
  subject: CommunitySummary;
  comparison: CommunitySummary | null;
  unitPriceDifference: number;
  unitPriceDifferencePercent: number;
  marketPosition: string;
  source: 'MOCK DATA';
};

export type ReportPropertyInsight = {
  title: string;
  summary: string;
  score: PropertyScore;
  source: 'Demo Generated Insight';
};

export type ReportSectionId =
  | 'cover'
  | 'overview'
  | 'market-analysis'
  | 'area-map'
  | 'lifestyle'
  | 'comparison'
  | 'sales-positioning'
  | 'contact';

export type ReportSection = {
  id: ReportSectionId;
  order: number;
  title: string;
  eyebrow: string;
  conclusion: string;
};

export type PropertyMarketReport = {
  reportId: string;
  property: PropertyProfile;
  propertyContext: PropertyProposalContext;
  brand: BrandConfig;
  agent: ReportAgent;
  propertyImages: ReportAsset[];
  floorplan: ReportAsset;
  logo: ReportAsset;
  qrCode: ReportAsset;
  marketSummary: ReportMarketSummary;
  mapSummary: ReportMapSummary;
  lifestyleSummary: ReportLifestyleSummary;
  comparisonSummary: ReportComparisonSummary;
  propertyInsight: ReportPropertyInsight;
  targetCustomer: string;
  sellingPoints: string[];
  salesStrategy: string;
  contact: { company: string; branch: string; agent: string; phone: string; address: string };
  sourceLabels: string[];
  generatedAt: string;
  sections: ReportSection[];
};
