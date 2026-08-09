'use client';

import {useMemo,useState} from 'react';
import Link from 'next/link';
import {calculateCommunitySummary} from '@/features/real-price/community-analysis';
import {buildPriceComparisonTrend,buildVolumeComparison,compareCommunities} from '@/features/real-price/community-comparison';
import {mockTransactionRepository} from '@/features/real-price/repositories/mock-transaction-repository';
import {CommunityPriceComparisonChart,CommunityVolumeComparisonChart} from './community-comparison-charts';

const labels:Array<[keyof ReturnType<typeof calculateCommunitySummary>,string,(value:number)=>string]> = [
  ['transactionCount','成交筆數',(value)=>`${value} 筆`],['averageUnitPrice','平均單價',(value)=>`${value.toFixed(1)} 萬/坪`],['highestUnitPrice','最高單價',(value)=>`${value.toFixed(1)} 萬/坪`],['lowestUnitPrice','最低單價',(value)=>`${value.toFixed(1)} 萬/坪`],['averageTotalPrice','平均總價',(value)=>`${value.toLocaleString()} 萬`],['averageAreaPing','平均坪數',(value)=>`${value.toFixed(1)} 坪`],['averageBuildingAge','平均屋齡',(value)=>`${value.toFixed(1)} 年`],
];

export function CommunityComparisonExplorer() {
  const transactions = useMemo(()=>mockTransactionRepository.getTransactions(),[]);
  const communities = useMemo(()=>[...new Set(transactions.map((item)=>item.community))], [transactions]);
  const [communityA,setCommunityA] = useState('美術館首席');
  const [communityB,setCommunityB] = useState('高鐵首席');
  const summaryA = useMemo(()=>calculateCommunitySummary(transactions.filter((item)=>item.community===communityA),communityA),[communityA,transactions]);
  const summaryB = useMemo(()=>calculateCommunitySummary(transactions.filter((item)=>item.community===communityB),communityB),[communityB,transactions]);
  const comparison = useMemo(()=>compareCommunities([summaryA,summaryB]),[summaryA,summaryB]);
  const trend = useMemo(()=>buildPriceComparisonTrend(transactions,communityA,communityB),[communityA,communityB,transactions]);
  const volume = useMemo(()=>buildVolumeComparison(transactions,communityA,communityB),[communityA,communityB,transactions]);
  return <div className="mx-auto max-w-7xl"><div className="flex flex-wrap items-start justify-between gap-4"><div><div className="inline-flex rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs text-amber-100">COMMUNITY COMPARISON · MOCK DATA</div><h1 className="mt-4 text-4xl font-semibold md:text-5xl">社區行情比較</h1><p className="mt-3 text-lg text-slate-400">將兩個社區的成交行情轉換成房仲提案比較素材。</p></div><Link href="/tools/real-price" className="min-h-11 rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200">返回實價登錄查詢</Link></div><section className="glass mt-8 grid gap-4 rounded-2xl p-5 md:grid-cols-2"><label className="text-sm">社區 A<select value={communityA} onChange={(event)=>setCommunityA(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2">{communities.map((item)=><option key={item}>{item}</option>)}</select></label><label className="text-sm">社區 B<select value={communityB} onChange={(event)=>setCommunityB(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2">{communities.map((item)=><option key={item}>{item}</option>)}</select></label></section><section className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto_1fr]"><CommunityPanel label="社區 A" summary={summaryA}/><div className="grid place-items-center"><span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-sm font-semibold text-amber-100">VS</span></div><CommunityPanel label="社區 B" summary={summaryB}/></section><section className="mt-6 rounded-2xl border border-blue-300/15 bg-blue-300/5 p-5"><p className="text-xs tracking-[.16em] text-blue-200/70">COMPARISON RESULT</p><h2 className="mt-2 text-xl font-semibold">平均單價差異</h2><div className="mt-3 flex flex-wrap items-baseline gap-3"><strong className="text-3xl text-amber-100">{comparison.averageUnitPriceDifference >= 0 ? '+' : ''}{comparison.averageUnitPriceDifference.toFixed(1)} 萬/坪</strong><span className="text-sm text-slate-300">{comparison.averageUnitPriceDifferencePercent >= 0 ? '+' : ''}{comparison.averageUnitPriceDifferencePercent.toFixed(1)}%</span><span className="text-sm text-slate-500">{comparison.higherAverageUnitPriceCommunity ? `${comparison.higherAverageUnitPriceCommunity} 平均單價較高` : '兩社區平均單價相同'} · 成交筆數差 {comparison.transactionCountDifference >= 0 ? '+' : ''}{comparison.transactionCountDifference}</span></div></section><section className="mt-6 grid gap-4 xl:grid-cols-2"><CommunityPriceComparisonChart data={trend} communityA={communityA} communityB={communityB}/><CommunityVolumeComparisonChart data={volume} communityA={communityA} communityB={communityB}/></section><p className="mt-6 text-xs text-slate-500">資料來源：Mock Data。比較結果僅供展示，不代表正式實價登錄、估價或投資建議。</p></div>;
}

function CommunityPanel({label,summary}:{label:string;summary:ReturnType<typeof calculateCommunitySummary>}) {
  return <section className="glass rounded-2xl p-5"><p className="text-xs tracking-[.16em] text-blue-200/70">{label}</p><h2 className="mt-2 text-2xl font-semibold">{summary.community}</h2><dl className="mt-5 grid grid-cols-2 gap-4">{labels.map(([key,label,format])=>{const value=summary[key];return <div key={key}><dt className="text-xs text-slate-500">{label}</dt><dd className="mt-1 text-sm font-semibold text-slate-100">{typeof value==='number'?format(value):value}</dd></div>})}</dl><span className="mt-5 inline-flex rounded-full border border-blue-300/20 bg-blue-300/10 px-2 py-1 text-xs text-blue-100">{summary.source}</span></section>;
}
