import {describe,expect,it} from 'vitest';
import {mockBranding} from '@/features/real-price/branding';
import {calculateCommunitySummary} from '@/features/real-price/community-analysis';
import {compareCommunities} from '@/features/real-price/community-comparison';
import {createMarketProposalPackage} from '@/features/real-price/proposal-templates/proposal-package';
import {getProposalTemplate,proposalTemplates} from '@/features/real-price/proposal-templates/templates';
import {realPriceTransactions} from '@/data/mock/real-price/real-price-data';

const communityTransactions = realPriceTransactions.filter((item)=>item.community==='美術館首席');
const summary = calculateCommunitySummary(communityTransactions,'美術館首席');
const comparison = compareCommunities([summary,calculateCommunitySummary(realPriceTransactions.filter((item)=>item.community==='高鐵首席'),'高鐵首席')]);

describe('proposal templates and market package', () => {
  it('loads the four proposal templates', () => {
    expect(proposalTemplates).toHaveLength(4);
    expect(getProposalTemplate('luxury-real-estate').coverStyle).toBe('luxury');
    expect(proposalTemplates.every((template)=>template.supportedSections.includes('branding'))).toBe(true);
  });

  it('applies mock branding to a proposal package', () => {
    const proposal = createMarketProposalPackage({template:getProposalTemplate('business-standard'),branding:mockBranding,communitySummary:summary,comparison,transaction:communityTransactions[0],transactions:communityTransactions});
    expect(proposal.branding).toMatchObject({companyName:'E.X Realty Data Tools',branchName:'E.X 示範分店',primaryColor:'#7ea7ff'});
  });

  it('composes all proposal data sections', () => {
    const proposal = createMarketProposalPackage({template:getProposalTemplate('ai-data-style'),communitySummary:summary,comparison,transaction:communityTransactions[0],transactions:communityTransactions});
    expect(proposal).toMatchObject({source:'MOCK',communitySummary:summary,comparison,transaction:communityTransactions[0],exportFileBaseName:'美術館首席_市場分析報告'});
    expect(proposal.priceTrend).toHaveLength(8);
  });

  it('provides complete export data', () => {
    const proposal = createMarketProposalPackage({template:getProposalTemplate('minimal'),communitySummary:summary,transactions:communityTransactions});
    expect(proposal.exportFileBaseName.endsWith('_市場分析報告')).toBe(true);
    expect(proposal.generatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(proposal.template.supportedSections).toContain('source');
  });
});
