import {describe,expect,it} from 'vitest';
import {calculateCommunitySummary} from '@/features/real-price/community-analysis';
import {buildVolumeComparison,compareCommunities} from '@/features/real-price/community-comparison';
import {realPriceTransactions} from '@/data/mock/real-price/real-price-data';

const summary = (community:string) => calculateCommunitySummary(realPriceTransactions.filter((item)=>item.community===community),community);

describe('community comparison', () => {
  const result = compareCommunities([summary('美術館首席'),summary('高鐵首席')]);

  it('compares community market calculations', () => {
    expect(result.communityA.community).toBe('美術館首席');
    expect(result.communityB.community).toBe('高鐵首席');
    expect(result.higherAverageUnitPriceCommunity).toBe('美術館首席');
  });

  it('calculates price differences', () => {
    expect(result.averageUnitPriceDifference).toBe(3.9);
    expect(result.averageUnitPriceDifferencePercent).toBe(12.9);
  });

  it('compares transaction volume by month', () => {
    const volume = buildVolumeComparison(realPriceTransactions,'美術館首席','高鐵首席');
    expect(volume.reduce((total,item)=>total+item.communityA,0)).toBe(8);
    expect(volume.reduce((total,item)=>total+item.communityB,0)).toBe(4);
  });
});
