import type {ProposalTemplateId} from '@/features/real-price/proposal-templates/types';

export type RealtyDemoCase = {
  caseId: string;
  title: string;
  district: string;
  community: string;
  comparisonCommunity: string;
  description: string;
  coverImage: string;
  shortDescription: string;
  targetAudience: string;
  recommendedScenario: string;
  targetCustomer: string;
  salesFocus: string;
  marketInsight: string;
  recommendedStrategy: string;
  recommendedTemplate: ProposalTemplateId;
  featuredTransactions: string[];
};
