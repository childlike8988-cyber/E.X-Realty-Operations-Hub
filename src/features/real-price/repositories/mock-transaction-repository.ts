import {realPriceTransactions} from '@/data/mock/real-price/real-price-data';
import type {RealEstateTransaction, TransactionRepository} from '../types';

export class MockTransactionRepository implements TransactionRepository {
  getTransactions(): readonly RealEstateTransaction[] {
    return realPriceTransactions;
  }
}

export const mockTransactionRepository = new MockTransactionRepository();
