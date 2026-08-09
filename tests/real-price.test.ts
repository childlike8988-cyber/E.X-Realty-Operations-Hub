import {describe, expect, it} from 'vitest';
import {realPriceTransactions} from '@/data/mock/real-price/real-price-data';
import {
  distributionData,
  filterTransactions,
  summarizeTransactions,
  trendData,
  volumeData,
} from '@/features/real-price/analysis';

const firstCommunity = realPriceTransactions[0].community;
const firstCity = realPriceTransactions[0].city;
const firstDistrict = realPriceTransactions[0].district;

describe('Real Price Explorer mock analysis', () => {
  it('loads the complete mock transaction set', () => {
    expect(realPriceTransactions).toHaveLength(20);
    expect(realPriceTransactions.every((item) => item.city && item.community && item.unitPrice > 0)).toBe(true);
  });

  it('filters transactions by city, district, community, type, and period', () => {
    const result = filterTransactions(realPriceTransactions, {
      city: firstCity,
      district: firstDistrict,
      community: firstCommunity,
      buildingType: realPriceTransactions[0].buildingType,
      period: '3m',
    });

    expect(result).toHaveLength(6);
    expect(result.every((item) => item.community === firstCommunity && item.transactionDate >= '2026-05-01')).toBe(true);
  });

  it('calculates market summary metrics from the filtered data', () => {
    const summary = summarizeTransactions(realPriceTransactions.filter((item) => item.community === firstCommunity));

    expect(summary).toMatchObject({count: 8, average: 34.1, highest: 38, lowest: 29.8});
  });

  it('builds non-empty, ordered datasets for the three charts', () => {
    const communityTransactions = realPriceTransactions.filter((item) => item.community === firstCommunity);
    const trend = trendData(communityTransactions);
    const volume = volumeData(communityTransactions);
    const distribution = distributionData(communityTransactions);

    expect(trend).toHaveLength(8);
    expect(trend[0].date <= trend.at(-1)!.date).toBe(true);
    expect(volume.reduce((total, item) => total + item.volume, 0)).toBe(8);
    expect(distribution.reduce((total, item) => total + item.count, 0)).toBe(8);
  });
});
