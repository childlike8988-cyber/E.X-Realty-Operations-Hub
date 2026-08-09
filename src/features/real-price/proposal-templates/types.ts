import type {BrandConfig} from '../branding';
import type {CommunitySummary, ComparisonResult, RealEstateTransaction} from '../types';
import type {PropertyProposalContext} from '@/features/property-intelligence/types';

export type ProposalTemplateId = 'business-standard' | 'luxury-real-estate' | 'ai-data-style' | 'minimal';
export type ProposalSection = 'cover' | 'area-summary' | 'community-analysis' | 'transaction-case' | 'comparison-analysis' | 'price-trend' | 'source' | 'branding';

export type ProposalTemplate = {
  templateId: ProposalTemplateId;
  name: string;
  description: string;
  coverStyle: 'business' | 'luxury' | 'data' | 'minimal';
  layout: 'balanced' | 'editorial' | 'dashboard' | 'clean';
  supportedSections: ProposalSection[];
};

export type MarketProposalPackage = {
  template: ProposalTemplate;
  branding: BrandConfig;
  communitySummary: CommunitySummary;
  comparison: ComparisonResult | null;
  transaction: RealEstateTransaction | null;
  priceTrend: Array<{date:string;price:number}>;
  generatedAt: string;
  source: 'MOCK';
  exportFileBaseName: string;
  propertyContext?: PropertyProposalContext | null;
};
