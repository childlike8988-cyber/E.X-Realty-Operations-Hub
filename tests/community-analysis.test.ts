import {describe,expect,it} from 'vitest';
import {calculateCommunitySummary,compareTransactionToCommunity} from '@/features/real-price/community-analysis';
import {realPriceTransactions} from '@/data/mock/real-price/real-price-data';

const communityTransactions = realPriceTransactions.filter((item)=>item.community === '美術館首席');

describe('community market analysis', () => {
  it('calculates community averages and transaction count', () => {
    const summary = calculateCommunitySummary(communityTransactions,'美術館首席');
    expect(summary).toMatchObject({community:'美術館首席',transactionCount:8,averageUnitPrice:34.1,averageTotalPrice:1456.3,averageAreaPing:42.3,averageBuildingAge:4,source:'MOCK'});
  });

  it('calculates highest and lowest prices', () => {
    const summary = calculateCommunitySummary(communityTransactions,'美術館首席');
    expect(summary.highestUnitPrice).toBe(38);
    expect(summary.lowestUnitPrice).toBe(29.8);
  });

  it('compares a transaction with the community average', () => {
    const summary = calculateCommunitySummary(communityTransactions,'美術館首席');
    const comparison = compareTransactionToCommunity(communityTransactions[6],summary);
    expect(comparison).toEqual({unitPriceDifference:3.9,unitPriceDifferencePercent:11.4,direction:'above'});
  });
});
