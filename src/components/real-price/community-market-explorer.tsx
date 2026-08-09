'use client';

import {useMemo,useState} from 'react';
import Link from 'next/link';
import {calculateCommunitySummary} from '@/features/real-price/community-analysis';
import {trendData,volumeData} from '@/features/real-price/analysis';
import {mockTransactionRepository} from '@/features/real-price/repositories/mock-transaction-repository';
import {CommunitySummaryCards} from './community-summary-cards';
import {EmptyResults} from './empty-results';
import {PriceTrendChart,VolumeChart} from './charts';

const initialCommunity = '美術館首席';

export function CommunityMarketExplorer() {
  const [draft,setDraft] = useState(initialCommunity);
  const [community,setCommunity] = useState(initialCommunity);
  const transactions = useMemo(()=>mockTransactionRepository.getTransactions(),[]);
  const items = useMemo(()=>transactions.filter((item)=>item.community.includes(community.trim())),[community,transactions]);
  const summary = useMemo(()=>calculateCommunitySummary(items,community || '全部社區'),[community,items]);
  const clear = () => { setDraft(''); setCommunity(''); };
  return <div className="mx-auto max-w-7xl"><div className="flex flex-wrap items-start justify-between gap-4"><div><div className="inline-flex rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs text-amber-100">COMMUNITY MARKET · MOCK DATA</div><h1 className="mt-4 text-4xl font-semibold md:text-5xl">社區行情分析</h1><p className="mt-3 text-lg text-slate-400">以社區成交資料建立行情摘要與價格趨勢展示。</p></div><Link href="/tools/real-price" className="min-h-11 rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200">返回實價登錄查詢</Link></div><section className="glass mt-8 rounded-2xl p-5"><label className="block max-w-xl text-sm">搜尋社區<input value={draft} onChange={(event)=>setDraft(event.target.value)} onKeyDown={(event)=>{if(event.key==='Enter')setCommunity(draft)}} placeholder="例如：美術館首席" className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"/></label><button onClick={()=>setCommunity(draft)} className="mt-4 min-h-11 rounded-lg bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-950">分析社區行情</button></section>{items.length===0 ? <EmptyResults onClear={clear}/> : <><section className="mt-8"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs tracking-[.16em] text-blue-200/70">COMMUNITY MARKET ANALYSIS</p><h2 className="mt-1 text-2xl font-semibold">{summary.community}</h2></div><span className="rounded-full border border-blue-300/20 bg-blue-300/10 px-3 py-1 text-xs text-blue-100">資料來源：MOCK</span></div><CommunitySummaryCards summary={summary}/></section><section className="mt-6 grid gap-4 xl:grid-cols-2"><PriceTrendChart data={trendData(items)}/><VolumeChart data={volumeData(items)}/></section></>}</div>;
}
