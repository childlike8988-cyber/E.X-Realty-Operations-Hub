'use client';

import {useEffect,useMemo,useState} from 'react';
import {calculateCommunitySummary} from '@/features/real-price/community-analysis';
import {distributionData,filterTransactions,summarizeTransactions,trendData,volumeData} from '@/features/real-price/analysis';
import {loadRecentSearches,saveRecentSearch,type RecentSearch} from '@/features/real-price/recent-searches';
import {mockTransactionRepository} from '@/features/real-price/repositories/mock-transaction-repository';
import type {RealEstateTransaction, RealPriceQuery} from '@/features/real-price/types';
import {DistributionChart,PriceTrendChart,VolumeChart} from './charts';
import {EmptyResults} from './empty-results';
import {MarketReportButton} from './market-report-button';
import {QuerySummary} from './query-summary';
import {RealPriceSearchForm} from './real-price-search-form';
import {RealPriceSummaryCard} from './real-price-summary-card';
import {RecentSearches} from './recent-searches';
import {TransactionDetailDrawer} from './transaction-detail-drawer';
import {TransactionTable} from './transaction-table';

const initial:RealPriceQuery = {city:'高雄市',district:'鼓山區',road:'',community:'美術館首席',addressKeyword:'',buildingType:'',ageRange:'',period:'all'};

export function RealPriceExplorer() {
  const [draft,setDraft] = useState(initial);
  const [active,setActive] = useState(initial);
  const [recent,setRecent] = useState<RecentSearch[]>([]);
  const [selected,setSelected] = useState<RealEstateTransaction|null>(null);
  const transactions = useMemo(() => mockTransactionRepository.getTransactions(),[]);
  const items = useMemo(() => filterTransactions(transactions,active),[active,transactions]);
  const summary = useMemo(() => summarizeTransactions(items),[items]);
  const communitySummary = useMemo(() => calculateCommunitySummary(items,active.community || active.road || active.district),[active,items]);
  const clear = () => { setDraft(initial); setActive(initial); setSelected(null); };
  const search = () => { setActive(draft); setRecent(saveRecentSearch(draft)); setSelected(null); };
  const selectRecent = (item:RecentSearch) => { setDraft(item.query); setActive(item.query); setSelected(null); };
  const marketName = active.community || active.road || active.district || '區域市場';
  useEffect(()=>setRecent(loadRecentSearches()),[]);

  return <div className="mx-auto max-w-7xl"><section className="mb-8"><div className="inline-flex rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs text-amber-100">DEMO · MOCK DATA ONLY</div><h1 className="mt-4 text-4xl font-semibold md:text-5xl">實價登錄查詢</h1><p className="mt-3 text-lg text-slate-400">掌握區域成交行情，快速分析市場價格。</p><div className="mt-6 grid gap-3 md:grid-cols-3">{['查詢成交行情','分析價格趨勢','產生市場報告'].map((item)=><div key={item} className="glass rounded-xl p-4 text-sm font-medium">{item}</div>)}</div></section><RealPriceSearchForm query={draft} onChange={setDraft} onSearch={search}/><RecentSearches items={recent} onSelect={selectRecent}/><QuerySummary query={active} count={items.length}/>{items.length===0 ? <EmptyResults onClear={clear}/> : <><div className="mt-6 flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-slate-400">資料僅為展示假資料，不代表政府實價登錄或任何真實市場行情。</p><MarketReportButton query={active} community={marketName} summary={summary} communitySummary={communitySummary} items={items}/></div><div className="mt-6"><RealPriceSummaryCard community={marketName} summary={summary}/></div><div className="mt-6 grid gap-4 xl:grid-cols-2"><PriceTrendChart data={trendData(items)}/><VolumeChart data={volumeData(items)}/></div><div className="mt-4"><DistributionChart data={distributionData(items)}/></div><section className="mt-6"><div className="mb-3 flex items-center justify-between"><div><h2 className="text-2xl font-semibold">成交列表</h2><p className="mt-1 text-sm text-slate-500">點擊任一成交案例，查看與社區平均的比較。</p></div><span className="text-sm text-slate-500">{items.length} 筆展示資料</span></div><TransactionTable items={items} onSelect={setSelected}/></section></>}<TransactionDetailDrawer transaction={selected} summary={communitySummary} onClose={()=>setSelected(null)}/></div>;
}
