import type {TransactionRepository} from '../types';

/**
 * Future contract only. Sprint 1 does not call government services, crawl data,
 * or store any external credentials.
 */
export interface GovernmentDataAdapter extends TransactionRepository {
  readonly provider: 'GOVERNMENT_DATA';
}
