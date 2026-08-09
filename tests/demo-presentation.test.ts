import {describe,expect,it} from 'vitest';
import {realtyDemoCases} from '@/data/mock/real-price/demo-cases/demo-cases';
import {mockBranding} from '@/features/real-price/branding';
import {calculateCommunitySummary} from '@/features/real-price/community-analysis';
import {compareCommunities} from '@/features/real-price/community-comparison';
import {createCompleteMarketReport,demoPresentationSteps} from '@/features/real-price/demo-presentation';
import {createMarketProposalPackage} from '@/features/real-price/proposal-templates/proposal-package';
import {getProposalTemplate} from '@/features/real-price/proposal-templates/templates';
import {realPriceTransactions} from '@/data/mock/real-price/real-price-data';

describe('demo presentation', () => {
  const demoCase = realtyDemoCases[0];
  const transactions = realPriceTransactions.filter((item) => item.community === demoCase.community);
  const summary = calculateCommunitySummary(transactions,demoCase.community);
  const comparison = compareCommunities([summary,calculateCommunitySummary(realPriceTransactions.filter((item) => item.community === demoCase.comparisonCommunity),demoCase.comparisonCommunity)]);
  const proposal = createMarketProposalPackage({template:getProposalTemplate(demoCase.recommendedTemplate),branding:mockBranding,communitySummary:summary,comparison,transaction:transactions[0],transactions});

  it('defines the five-step executive demo flow', () => {
    expect(demoPresentationSteps.map((step) => step.id)).toEqual(['case','market','comparison','transaction','proposal']);
  });

  it('loads enhanced demo case information', () => {
    expect(realtyDemoCases.every((item) => item.coverImage && item.shortDescription && item.targetAudience && item.recommendedScenario && item.targetCustomer && item.salesFocus && item.marketInsight && item.recommendedStrategy)).toBe(true);
  });

  it('composes all sections for a complete market report', () => {
    const report = createCompleteMarketReport(demoCase,proposal);
    expect(report).toMatchObject({source:'MOCK',fileBaseName:'gushan-art-district_Market_Report'});
    expect(report.sections.map((section) => section.id)).toEqual(['cover','area-introduction','market-transactions','community-analysis','community-comparison','transaction-case','brand-information','data-source','market-insight']);
    expect(report.sections.every((section) => section.highlights.length > 0)).toBe(true);
  });
});
