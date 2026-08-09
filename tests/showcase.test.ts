import {describe,expect,it} from 'vitest';
import {navigation} from '@/config/navigation';
import {realtyDemoCases} from '@/data/mock/real-price/demo-cases/demo-cases';
import {mockBranding} from '@/features/real-price/branding';
import {calculateCommunitySummary} from '@/features/real-price/community-analysis';
import {compareCommunities} from '@/features/real-price/community-comparison';
import {createCompleteMarketReport} from '@/features/real-price/demo-presentation';
import {createMarketInsight} from '@/features/real-price/insights/market-insight';
import {createMarketProposalPackage} from '@/features/real-price/proposal-templates/proposal-package';
import {getProposalTemplate} from '@/features/real-price/proposal-templates/templates';
import {realPriceTransactions} from '@/data/mock/real-price/real-price-data';

describe('Realty Data Tools Showcase', () => {
  const demoCase = realtyDemoCases[0];
  const transactions = realPriceTransactions.filter((item) => item.community === demoCase.community);
  const summary = calculateCommunitySummary(transactions,demoCase.community);
  const comparison = compareCommunities([summary,calculateCommunitySummary(realPriceTransactions.filter((item) => item.community === demoCase.comparisonCommunity),demoCase.comparisonCommunity)]);
  const proposal = createMarketProposalPackage({template:getProposalTemplate(demoCase.recommendedTemplate),branding:mockBranding,communitySummary:summary,comparison,transaction:transactions[0],transactions});

  it('registers the Showcase page inside the Realty Data Tools navigation group', () => {
    expect(navigation.find((item) => item.id === 'realty-showcase')).toMatchObject({route:'/tools/real-price/showcase',category:'Realty Data Tools'});
  });

  it('creates a rule-based Mock market insight', () => {
    const insight = createMarketInsight({demoCase,summary,comparison});
    expect(insight).toMatchObject({label:'Demo Generated Insight'});
    expect(insight.marketSummary).toContain(demoCase.community);
    expect(insight.customerPositioning).toContain(demoCase.targetCustomer);
  });

  it('includes the AI Market Insight as the ninth report page', () => {
    const report = createCompleteMarketReport(demoCase,proposal);
    expect(report.sections).toHaveLength(9);
    expect(report.sections.at(-1)).toMatchObject({id:'market-insight',subtitle:'Demo Generated Insight'});
  });
});
