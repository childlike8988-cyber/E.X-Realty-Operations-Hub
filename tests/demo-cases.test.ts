import {describe,expect,it} from 'vitest';
import {realtyDemoCases} from '@/data/mock/real-price/demo-cases/demo-cases';
import {mockBranding} from '@/features/real-price/branding';
import {calculateCommunitySummary} from '@/features/real-price/community-analysis';
import {compareCommunities} from '@/features/real-price/community-comparison';
import {createMarketProposalPackage} from '@/features/real-price/proposal-templates/proposal-package';
import {getProposalTemplate} from '@/features/real-price/proposal-templates/templates';
import {realPriceTransactions} from '@/data/mock/real-price/real-price-data';

describe('Realty Data Tools demo cases', () => {
  it('loads three complete demo cases', () => {
    expect(realtyDemoCases).toHaveLength(3);
    expect(realtyDemoCases.every((item)=>item.caseId&&item.featuredTransactions.length>0&&item.comparisonCommunity)).toBe(true);
  });

  it('applies each case recommended template', () => {
    expect(realtyDemoCases.map((item)=>getProposalTemplate(item.recommendedTemplate).templateId)).toEqual(['luxury-real-estate','ai-data-style','minimal']);
  });

  it('builds a complete proposal from a demo case', () => {
    const demoCase = realtyDemoCases[0];
    const transactions = realPriceTransactions.filter((item)=>item.community===demoCase.community);
    const summary = calculateCommunitySummary(transactions,demoCase.community);
    const comparison = compareCommunities([summary,calculateCommunitySummary(realPriceTransactions.filter((item)=>item.community===demoCase.comparisonCommunity),demoCase.comparisonCommunity)]);
    const proposal = createMarketProposalPackage({template:getProposalTemplate(demoCase.recommendedTemplate),branding:mockBranding,communitySummary:summary,comparison,transaction:transactions.find((item)=>demoCase.featuredTransactions.includes(item.id)) ?? null,transactions});
    expect(proposal).toMatchObject({source:'MOCK',communitySummary:summary,comparison,exportFileBaseName:'美術館首席_市場分析報告'});
    expect(proposal.transaction?.id).toBe('rp-01');
  });
});
