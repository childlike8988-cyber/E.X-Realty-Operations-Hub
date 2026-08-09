import {describe,expect,it} from 'vitest';
import {realtyDemoCases} from '@/data/mock/real-price/demo-cases/demo-cases';
import {createCompleteMarketReport} from '@/features/real-price/demo-presentation';
import {mockProperties} from '@/features/property-intelligence/mock-properties';
import {adaptPropertyToProposalContext,createPropertyMarketProposalPackage} from '@/features/property-intelligence/proposal-adapter';
import {generatePropertyAnalysis} from '@/features/property-intelligence/analysis';
import {generateSalesTalkingPoints} from '@/features/property-intelligence/sales-talking-points';
import {getProposalTemplate} from '@/features/real-price/proposal-templates/templates';

describe('Property Intelligence to Proposal Studio integration', () => {
  it('adapts a Property Profile to a complete Proposal Context', () => {
    const context = adaptPropertyToProposalContext(mockProperties[0]);
    expect(context).toMatchObject({propertyId:mockProperties[0].id,source:'MOCK',targetCustomer:'家庭換屋族'});
    expect(context.property).toBe(mockProperties[0]);
    expect(context.transaction?.community).toBe(mockProperties[0].community);
    expect(context.salesTalkingPoints.opening.length).toBeGreaterThan(0);
  });

  it('attaches Property Context to a Market Proposal Package and ten-page report', () => {
    const property = mockProperties[0];
    const proposal = createPropertyMarketProposalPackage(property,getProposalTemplate('luxury-real-estate'));
    const demoCase = realtyDemoCases.find((item) => item.caseId === property.realPriceCaseId);
    expect(proposal.propertyContext?.propertyId).toBe(property.id);
    expect(createCompleteMarketReport(demoCase!,proposal).sections.at(-1)).toMatchObject({id:'property-intelligence',subtitle:'Demo Generated Score'});
    expect(createCompleteMarketReport(demoCase!,proposal).sections).toHaveLength(10);
  });

  it('generates rule-based sales talking points', () => {
    const points = generateSalesTalkingPoints(generatePropertyAnalysis(mockProperties[1]));
    expect(Object.values(points).every((point) => point.length > 0)).toBe(true);
  });

  it('creates a proposal package for each Mock Property Case', () => {
    expect(mockProperties.map((property) => createPropertyMarketProposalPackage(property,getProposalTemplate('business-standard')).propertyContext?.propertyId)).toEqual(mockProperties.map((property) => property.id));
  });
});
