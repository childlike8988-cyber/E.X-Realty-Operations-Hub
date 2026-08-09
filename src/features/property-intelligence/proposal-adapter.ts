import {realPriceTransactions} from '@/data/mock/real-price/real-price-data';
import {realtyDemoCases} from '@/data/mock/real-price/demo-cases/demo-cases';
import {mockBranding} from '@/features/real-price/branding';
import {calculateCommunitySummary} from '@/features/real-price/community-analysis';
import {compareCommunities} from '@/features/real-price/community-comparison';
import {createMarketProposalPackage} from '@/features/real-price/proposal-templates/proposal-package';
import type {ProposalTemplate} from '@/features/real-price/proposal-templates/types';
import {generatePropertyAnalysis,createPropertyProposalContext} from './analysis';
import {calculatePropertyScore} from './property-score';
import {generateSalesTalkingPoints} from './sales-talking-points';
import type {PropertyProfile, PropertyProposalContext} from './types';

export function adaptPropertyToProposalContext(property:PropertyProfile):PropertyProposalContext {
  const analysis = generatePropertyAnalysis(property);
  const communityTransactions = realPriceTransactions.filter((item) => item.community === property.community);
  const averageUnitPrice = communityTransactions.length ? communityTransactions.reduce((sum,item) => sum + item.unitPrice,0) / communityTransactions.length : property.unitPrice;
  const transaction = communityTransactions.reduce<typeof communityTransactions[number] | null>((closest,item) => !closest || Math.abs(item.unitPrice-property.unitPrice) < Math.abs(closest.unitPrice-property.unitPrice) ? item : closest,null);
  const score = calculatePropertyScore(analysis,averageUnitPrice);
  return createPropertyProposalContext(analysis,score,transaction,generateSalesTalkingPoints(analysis));
}

export function createPropertyMarketProposalPackage(property:PropertyProfile, template:ProposalTemplate) {
  const propertyContext = adaptPropertyToProposalContext(property);
  const communityTransactions = realPriceTransactions.filter((item) => item.community === property.community);
  const communitySummary = calculateCommunitySummary(communityTransactions,property.community);
  const demoCase = realtyDemoCases.find((item) => item.caseId === property.realPriceCaseId);
  const comparisonTransactions = demoCase ? realPriceTransactions.filter((item) => item.community === demoCase.comparisonCommunity) : [];
  const comparison = demoCase && comparisonTransactions.length ? compareCommunities([communitySummary,calculateCommunitySummary(comparisonTransactions,demoCase.comparisonCommunity)]) : null;
  return createMarketProposalPackage({template,branding:mockBranding,communitySummary,comparison,transaction:propertyContext.transaction,transactions:communityTransactions,propertyContext});
}
