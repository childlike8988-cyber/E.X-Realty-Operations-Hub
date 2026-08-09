import {describe,expect,it} from 'vitest';
import {createPropertyProposalContext,generatePropertyAnalysis} from '@/features/property-intelligence/analysis';
import {createPropertyInsight} from '@/features/property-intelligence/insights';
import {mockProperties} from '@/features/property-intelligence/mock-properties';
import {calculatePropertyScore} from '@/features/property-intelligence/property-score';
import {realPriceTransactions} from '@/data/mock/real-price/real-price-data';

describe('Property Intelligence', () => {
  const property = mockProperties[0];
  const analysis = generatePropertyAnalysis(property);
  const transactions = realPriceTransactions.filter((item) => item.community === property.community);
  const averageUnitPrice = transactions.reduce((sum,item) => sum + item.unitPrice,0) / transactions.length;
  const score = calculatePropertyScore(analysis,averageUnitPrice);

  it('loads three Mock property profiles with source references', () => {
    expect(mockProperties).toHaveLength(3);
    expect(mockProperties.every((item) => item.source === 'MOCK' && item.locationId && item.realPriceCaseId)).toBe(true);
  });

  it('generates a combined market and location analysis', () => {
    expect(analysis).toMatchObject({source:'MOCK',targetCustomer:'家庭換屋族'});
    expect(analysis.marketSummary).toContain(property.community);
    expect(analysis.locationSummary.length).toBeGreaterThan(0);
  });

  it('calculates a bounded demonstration score and insight', () => {
    expect(score).toMatchObject({label:'Demo Generated Score',source:'MOCK'});
    expect(score.overallScore).toBeGreaterThanOrEqual(0);
    expect(score.overallScore).toBeLessThanOrEqual(100);
    expect(createPropertyInsight(analysis).sellingPoints).toContain('學區完整');
  });

  it('creates a future Proposal Studio handoff context', () => {
    expect(createPropertyProposalContext(analysis,score)).toMatchObject({propertyId:property.id,source:'MOCK',score});
  });
});
