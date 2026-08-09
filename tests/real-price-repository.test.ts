import {describe,expect,it} from 'vitest';
import {filterTransactions} from '@/features/real-price/analysis';
import {mockTransactionRepository} from '@/features/real-price/repositories/mock-transaction-repository';

const baseQuery = {city:'高雄市',district:'',road:'',community:'',addressKeyword:'',buildingType:'',ageRange:'' as const,period:'all'};

describe('MockTransactionRepository', () => {
  it('provides the typed mock transaction collection', () => {
    const transactions = mockTransactionRepository.getTransactions();
    expect(transactions.length).toBeGreaterThanOrEqual(20);
    expect(transactions.every((item) => item.source === 'MOCK' && item.road && item.buildingAge >= 0)).toBe(true);
  });

  it('filters by road', () => {
    const results = filterTransactions(mockTransactionRepository.getTransactions(),{...baseQuery,road:'華夏路'});
    expect(results).toHaveLength(4);
    expect(results.every((item) => item.road === '華夏路')).toBe(true);
  });

  it('filters by building age range', () => {
    const results = filterTransactions(mockTransactionRepository.getTransactions(),{...baseQuery,ageRange:'5-15'});
    expect(results).toHaveLength(7);
    expect(results.every((item) => item.buildingAge > 5 && item.buildingAge < 15)).toBe(true);
  });

  it('returns an empty set for unmatched conditions', () => {
    const results = filterTransactions(mockTransactionRepository.getTransactions(),{...baseQuery,addressKeyword:'不存在的展示地址'});
    expect(results).toEqual([]);
  });
});
