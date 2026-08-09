'use client';

import {useMemo,useRef,useState} from 'react';
import Link from 'next/link';
import {realtyDemoCases} from '@/data/mock/real-price/demo-cases/demo-cases';
import type {RealtyDemoCase} from '@/data/mock/real-price/demo-cases/types';
import {mockBranding} from '@/features/real-price/branding';
import {calculateCommunitySummary} from '@/features/real-price/community-analysis';
import {compareCommunities} from '@/features/real-price/community-comparison';
import {createMarketProposalPackage} from '@/features/real-price/proposal-templates/proposal-package';
import {getProposalTemplate} from '@/features/real-price/proposal-templates/templates';
import {mockTransactionRepository} from '@/features/real-price/repositories/mock-transaction-repository';
import {BrandPreview} from './brand-preview';
import {CommunitySummaryCards} from './community-summary-cards';
import {MarketProposalPreview} from './market-proposal-preview';
import {ProposalPackageExport} from './proposal-package-export';
import {RealtyDataFlow} from './realty-data-flow';

export function RealtyDemoCenter() {
  const [activeCase,setActiveCase] = useState<RealtyDemoCase>(realtyDemoCases[0]);
  const previewRef = useRef<HTMLDivElement>(null);
  const transactions = useMemo(()=>mockTransactionRepository.getTransactions(),[]);
  const communityTransactions = useMemo(()=>transactions.filter((item)=>item.community===activeCase.community),[activeCase,transactions]);
  const comparisonTransactions = useMemo(()=>transactions.filter((item)=>item.community===activeCase.comparisonCommunity),[activeCase,transactions]);
  const summary = useMemo(()=>calculateCommunitySummary(communityTransactions,activeCase.community),[activeCase,communityTransactions]);
  const comparison = useMemo(()=>compareCommunities([summary,calculateCommunitySummary(comparisonTransactions,activeCase.comparisonCommunity)]),[activeCase,comparisonTransactions,summary]);
  const featured = useMemo(()=>communityTransactions.find((item)=>activeCase.featuredTransactions.includes(item.id)) ?? communityTransactions[0] ?? null,[activeCase,communityTransactions]);
  const proposal = useMemo(()=>createMarketProposalPackage({template:getProposalTemplate(activeCase.recommendedTemplate),branding:mockBranding,communitySummary:summary,comparison,transaction:featured,transactions:communityTransactions}),[activeCase,communityTransactions,comparison,featured,summary]);
  return <div className="mx-auto max-w-7xl"><div className="flex flex-wrap items-start justify-between gap-4"><div><div className="inline-flex rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs text-amber-100">EXECUTIVE DEMO · MOCK DATA</div><h1 className="mt-4 text-4xl font-semibold md:text-5xl">Realty Data Tools Demo Center</h1><p className="mt-3 max-w-3xl text-lg text-slate-400">快速載入生活圈案例，依序展示社區行情、比較分析與品牌化市場提案。</p></div><Link href="/tools/real-price" className="min-h-11 rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200">開啟完整查詢工具</Link></div><div className="mt-7"><RealtyDataFlow active="proposal"/></div><section className="mt-6"><div className="mb-3"><p className="text-xs tracking-[.16em] text-blue-200/70">DEMO CASES</p><h2 className="mt-1 text-xl font-semibold">選擇展示案例</h2></div><div className="grid gap-4 lg:grid-cols-3">{realtyDemoCases.map((item)=><button key={item.caseId} onClick={()=>setActiveCase(item)} className={`rounded-2xl border p-5 text-left transition ${item.caseId===activeCase.caseId?'border-amber-300/60 bg-amber-300/10':'border-slate-700 bg-slate-900/40 hover:border-blue-300/40'}`}><p className="text-xs text-blue-200/70">{item.district}</p><h3 className="mt-2 text-lg font-semibold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{item.description}</p><span className="mt-4 inline-flex rounded-full border border-slate-700 px-2 py-1 text-xs text-slate-300">{getProposalTemplate(item.recommendedTemplate).name}</span></button>)}</div></section><section className="mt-8 grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]"><aside className="space-y-5"><section className="glass rounded-2xl p-5"><p className="text-xs tracking-[.16em] text-blue-200/70">AUTO-LOADED ANALYSIS</p><h2 className="mt-2 text-2xl font-semibold">{activeCase.community}</h2><p className="mt-2 text-sm text-slate-400">比較社區：{activeCase.comparisonCommunity}</p><p className="mt-4 text-sm leading-6 text-slate-300">平均單價差異 {comparison.averageUnitPriceDifference >= 0 ? '+' : ''}{comparison.averageUnitPriceDifference.toFixed(1)} 萬/坪；{comparison.higherAverageUnitPriceCommunity ?? '兩社區'} {comparison.higherAverageUnitPriceCommunity ? '平均單價較高' : '平均單價相同'}。</p></section><CommunitySummaryCards summary={summary}/><BrandPreview branding={mockBranding}/></aside><main><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs tracking-[.16em] text-blue-200/70">AUTO-LOADED PROPOSAL PREVIEW</p><h2 className="mt-1 text-xl font-semibold">{getProposalTemplate(activeCase.recommendedTemplate).name}</h2></div><ProposalPackageExport targetRef={previewRef} fileBaseName={proposal.exportFileBaseName}/></div><MarketProposalPreview ref={previewRef} proposal={proposal}/><p className="mt-4 rounded-xl border border-slate-700 bg-slate-900/40 p-4 text-sm text-slate-400">資料來源：Mock Data。Demo Center 僅用於展示操作流程與未來產品方向，不代表正式行情或估價結果。</p></main></section></div>;
}
