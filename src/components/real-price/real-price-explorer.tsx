'use client';

import { useEffect, useMemo, useState } from 'react';
import { distributionData, filterTransactions, summarizeTransactions, trendData, volumeData } from '@/features/real-price/analysis';
import { calculateCommunitySummary } from '@/features/real-price/community-analysis';
import { loadRecentSearches, saveRecentSearch, type RecentSearch } from '@/features/real-price/recent-searches';
import { mockTransactionRepository } from '@/features/real-price/repositories/mock-transaction-repository';
import type { RealEstateTransaction, RealPriceQuery } from '@/features/real-price/types';
import { DistributionChart, PriceTrendChart, VolumeChart } from './charts';
import { EmptyResults } from './empty-results';
import { MarketReportButton } from './market-report-button';
import { QuerySummary } from './query-summary';
import { RealPriceCaseGuide } from './real-price-case-guide';
import { RealPriceLanding } from './real-price-landing';
import { RealPriceSearchForm } from './real-price-search-form';
import { RealPriceSummaryCard } from './real-price-summary-card';
import { RecentSearches } from './recent-searches';
import { TransactionDetailDrawer } from './transaction-detail-drawer';
import { TransactionTable } from './transaction-table';

const initial: RealPriceQuery = {
  city: '高雄市', district: '鼓山區', road: '', community: '美術館首席', addressKeyword: '', buildingType: '', ageRange: '', period: 'all',
};

export function RealPriceExplorer() {
  const [draft, setDraft] = useState(initial);
  const [active, setActive] = useState(initial);
  const [recent, setRecent] = useState<RecentSearch[]>([]);
  const [selected, setSelected] = useState<RealEstateTransaction | null>(null);
  const transactions = useMemo(() => mockTransactionRepository.getTransactions(), []);
  const items = useMemo(() => filterTransactions(transactions, active), [active, transactions]);
  const summary = useMemo(() => summarizeTransactions(items), [items]);
  const communitySummary = useMemo(() => calculateCommunitySummary(items, active.community || active.road || active.district), [active, items]);
  const marketName = active.community || active.road || active.district || '區域行情';
  const clear = () => { setDraft(initial); setActive(initial); setSelected(null); };
  const search = () => { setActive(draft); setRecent(saveRecentSearch(draft)); setSelected(null); };
  const loadCase = (query: RealPriceQuery) => { setDraft(query); setActive(query); setRecent(saveRecentSearch(query)); setSelected(null); };
  const selectRecent = (item: RecentSearch) => { setDraft(item.query); setActive(item.query); setSelected(null); };

  useEffect(() => setRecent(loadRecentSearches()), []);

  return <div className="mx-auto max-w-7xl pb-12">
    <RealPriceLanding />
    <RealPriceCaseGuide onSelect={loadCase} />
    <section id="transaction-search" className="mt-12 scroll-mt-6" aria-labelledby="transaction-search-heading">
      <div className="mb-6"><p className="text-xs tracking-[.18em] text-blue-200">TRANSACTION SEARCH</p><h2 id="transaction-search-heading" className="mt-2 text-3xl font-semibold">實價登錄查詢</h2><p className="mt-2 text-sm leading-7 text-slate-400">使用展示用 Mock 成交資料，篩選後即可查看行情摘要、趨勢圖與成交案例。</p></div>
      <RealPriceSearchForm query={draft} onChange={setDraft} onSearch={search} />
      <RecentSearches items={recent} onSelect={selectRecent} />
      <QuerySummary query={active} count={items.length} />
      {items.length === 0 ? <EmptyResults onClear={clear} /> : <>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-slate-400">成交結果僅供展示與分析流程體驗，不代表正式實價登錄資料或價格建議。</p><MarketReportButton query={active} community={marketName} summary={summary} communitySummary={communitySummary} items={items} /></div>
        <div className="mt-6"><RealPriceSummaryCard community={marketName} summary={summary} /></div>
        <div className="mt-6 grid gap-4 xl:grid-cols-2"><PriceTrendChart data={trendData(items)} /><VolumeChart data={volumeData(items)} /></div>
        <div className="mt-4"><DistributionChart data={distributionData(items)} /></div>
        <section className="mt-6" aria-labelledby="transaction-list-heading"><div className="mb-3 flex items-center justify-between gap-3"><div><h2 id="transaction-list-heading" className="text-2xl font-semibold">成交案例</h2><p className="mt-1 text-sm text-slate-500">點選單筆成交資料，可查看與目前社區摘要的比較。</p></div><span className="text-sm text-slate-500">{items.length} 筆成交資料</span></div><TransactionTable items={items} onSelect={setSelected} /></section>
      </>}
    </section>
    <TransactionDetailDrawer transaction={selected} summary={communitySummary} onClose={() => setSelected(null)} />
  </div>;
}
