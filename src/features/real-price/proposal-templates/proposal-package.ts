import {mockBranding,type BrandConfig} from '../branding';
import {trendData} from '../analysis';
import type {CommunitySummary, ComparisonResult, RealEstateTransaction} from '../types';
import type {PropertyProposalContext} from '@/features/property-intelligence/types';
import type {MarketProposalPackage, ProposalTemplate} from './types';

const filenameSafe = (value:string) => value.replace(/[\\/:*?"<>|]/g,'').trim() || 'market-proposal';

export function createMarketProposalPackage({template,branding=mockBranding,communitySummary,comparison=null,transaction=null,transactions,propertyContext=null}:{template:ProposalTemplate;branding?:BrandConfig;communitySummary:CommunitySummary;comparison?:ComparisonResult|null;transaction?:RealEstateTransaction|null;transactions:readonly RealEstateTransaction[];propertyContext?:PropertyProposalContext|null}):MarketProposalPackage {
  return {template,branding,communitySummary,comparison,transaction,priceTrend:trendData(transactions),generatedAt:new Date().toISOString(),source:'MOCK',exportFileBaseName:`${filenameSafe(communitySummary.community)}_市場分析報告`,propertyContext};
}
