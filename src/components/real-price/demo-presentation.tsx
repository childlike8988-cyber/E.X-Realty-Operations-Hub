'use client';

import {useMemo,useState} from 'react';
import Link from 'next/link';
import {ArrowLeft,ArrowRight,Presentation} from 'lucide-react';
import {realtyDemoCases} from '@/data/mock/real-price/demo-cases/demo-cases';
import type {RealtyDemoCase} from '@/data/mock/real-price/demo-cases/types';
import {mockBranding} from '@/features/real-price/branding';
import {calculateCommunitySummary} from '@/features/real-price/community-analysis';
import {compareCommunities} from '@/features/real-price/community-comparison';
import {createCompleteMarketReport,demoPresentationSteps} from '@/features/real-price/demo-presentation';
import {createMarketProposalPackage} from '@/features/real-price/proposal-templates/proposal-package';
import {getProposalTemplate} from '@/features/real-price/proposal-templates/templates';
import {mockTransactionRepository} from '@/features/real-price/repositories/mock-transaction-repository';
import {BrandPreview} from './brand-preview';
import {CommunitySummaryCards} from './community-summary-cards';
import {CompleteMarketReportExport} from './complete-market-report-export';
import {MarketProposalPreview} from './market-proposal-preview';
import {TransactionProposalCard} from './transaction-proposal-card';

const coverStyle:Record<string,string> = {
  'art-district':'from-amber-300/30 via-slate-900 to-blue-950',
  'hsr-district':'from-cyan-300/25 via-slate-900 to-blue-950',
  'metro-district':'from-violet-300/25 via-slate-900 to-blue-950',
};

export function DemoPresentation() {
  const [activeCase,setActiveCase] = useState<RealtyDemoCase>(realtyDemoCases[0]);
  const [stepIndex,setStepIndex] = useState(0);
  const transactions = useMemo(() => mockTransactionRepository.getTransactions(),[]);
  const communityTransactions = useMemo(() => transactions.filter((item) => item.community === activeCase.community),[activeCase,transactions]);
  const comparisonTransactions = useMemo(() => transactions.filter((item) => item.community === activeCase.comparisonCommunity),[activeCase,transactions]);
  const summary = useMemo(() => calculateCommunitySummary(communityTransactions,activeCase.community),[activeCase,communityTransactions]);
  const comparisonSummary = useMemo(() => calculateCommunitySummary(comparisonTransactions,activeCase.comparisonCommunity),[activeCase,comparisonTransactions]);
  const comparison = useMemo(() => compareCommunities([summary,comparisonSummary]),[comparisonSummary,summary]);
  const featured = useMemo(() => communityTransactions.find((item) => activeCase.featuredTransactions.includes(item.id)) ?? communityTransactions[0] ?? null,[activeCase,communityTransactions]);
  const proposal = useMemo(() => createMarketProposalPackage({template:getProposalTemplate(activeCase.recommendedTemplate),branding:mockBranding,communitySummary:summary,comparison,transaction:featured,transactions:communityTransactions}),[activeCase,communityTransactions,comparison,featured,summary]);
  const report = useMemo(() => createCompleteMarketReport(activeCase,proposal),[activeCase,proposal]);

  const chooseCase = (demoCase:RealtyDemoCase) => { setActiveCase(demoCase); setStepIndex(0); };
  const step = demoPresentationSteps[stepIndex];

  return <div className="mx-auto max-w-7xl pb-8"><section className="overflow-hidden rounded-3xl border border-blue-300/20 bg-[radial-gradient(circle_at_82%_18%,rgba(126,167,255,.25),transparent_24%),linear-gradient(135deg,#091425,#122b4a)] p-6 sm:p-9"><div className="flex flex-wrap items-start justify-between gap-5"><div><span className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs text-amber-100"><Presentation size={14}/>DEMO PRESENTATION · MOCK DATA</span><h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">AI 房產分析 Demo</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">五分鐘展示：從區域成交資料、社區比較到可提供客戶閱讀的品牌化市場提案。</p></div><Link href="/tools/real-price/demo" className="min-h-11 rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-100">返回 Demo Center</Link></div></section><nav aria-label="Demo steps" className="mt-6 grid gap-2 sm:grid-cols-5">{demoPresentationSteps.map((item,index) => <button type="button" key={item.id} onClick={() => setStepIndex(index)} className={`min-h-16 rounded-xl border p-3 text-left ${index===stepIndex?'border-amber-300/60 bg-amber-300/10':'border-slate-700 bg-slate-900/40'}`}><span className="text-xs text-blue-200">STEP {index + 1}</span><span className="mt-1 block text-sm font-semibold">{item.title}</span></button>)}</nav><section className="mt-6 rounded-2xl border border-slate-700 bg-slate-900/35 p-5 sm:p-7"><div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs tracking-[.18em] text-blue-200/70">CURRENT DEMO SECTION</p><h2 className="mt-2 text-2xl font-semibold">{step.title}</h2><p className="mt-2 text-sm text-slate-400">{step.description}</p></div><span className="rounded-full border border-blue-300/25 bg-blue-300/10 px-3 py-1 text-xs text-blue-100">資料來源：Mock Data</span></div>{step.id==='case' && <CaseChooser activeCase={activeCase} onChoose={chooseCase}/>} {step.id==='market' && <MarketStep demoCase={activeCase} summary={summary}/>} {step.id==='comparison' && <ComparisonStep comparison={comparison}/>} {step.id==='transaction' && (featured ? <TransactionProposalCard transaction={featured} summary={summary}/> : <p className="rounded-xl border border-slate-700 p-5 text-slate-400">此展示案例尚未設定成交資料。</p>)} {step.id==='proposal' && <ProposalStep proposal={proposal} report={report}/>}<div className="mt-8 flex items-center justify-between border-t border-slate-700 pt-5"><button type="button" disabled={stepIndex===0} onClick={() => setStepIndex((current) => Math.max(0,current - 1))} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-600 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"><ArrowLeft size={16}/>上一步</button><span className="text-xs text-slate-400">{stepIndex + 1} / {demoPresentationSteps.length}</span><button type="button" disabled={stepIndex===demoPresentationSteps.length - 1} onClick={() => setStepIndex((current) => Math.min(demoPresentationSteps.length - 1,current + 1))} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-blue-300 px-4 py-2 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-40">下一步<ArrowRight size={16}/></button></div></section></div>;
}

function CaseChooser({activeCase,onChoose}:{activeCase:RealtyDemoCase;onChoose:(demoCase:RealtyDemoCase) => void}) {
  return <div className="grid gap-4 lg:grid-cols-3">{realtyDemoCases.map((item) => <button type="button" key={item.caseId} onClick={() => onChoose(item)} className={`overflow-hidden rounded-2xl border text-left ${item.caseId===activeCase.caseId?'border-amber-300/60':'border-slate-700'}`}><div className={`h-24 bg-gradient-to-br ${coverStyle[item.coverImage] ?? 'from-slate-800 to-slate-950'} p-4`}><span className="rounded-full bg-slate-950/40 px-2 py-1 text-xs text-white">{item.recommendedScenario}</span></div><div className="p-5"><p className="text-xs text-blue-200">{item.district}</p><h3 className="mt-1 font-semibold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{item.shortDescription}</p><p className="mt-4 text-xs text-amber-100">展示對象：{item.targetAudience}</p></div></button>)}</div>;
}

function MarketStep({demoCase,summary}:{demoCase:RealtyDemoCase;summary:ReturnType<typeof calculateCommunitySummary>}) {
  return <div className="space-y-5"><div className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]"><article className="rounded-2xl border border-blue-300/20 bg-blue-300/5 p-5"><p className="text-xs tracking-[.16em] text-blue-200">PRODUCT EXPLANATION</p><h3 className="mt-2 text-xl font-semibold">從查詢到客戶提案的資料工作流</h3><p className="mt-3 text-sm leading-6 text-slate-300">案例已自動載入 {demoCase.community} 的 Mock 成交資料；下一步會把摘要、比較與案例整理成品牌化報告。</p></article><article className="rounded-2xl border border-amber-300/20 bg-amber-300/5 p-5"><p className="text-xs tracking-[.16em] text-amber-100">FEATURE HIGHLIGHT</p><p className="mt-2 text-lg font-semibold">{demoCase.recommendedScenario}</p><p className="mt-3 text-sm text-slate-300">{demoCase.targetAudience}</p></article></div><CommunitySummaryCards summary={summary}/></div>;
}

function ComparisonStep({comparison}:{comparison:ReturnType<typeof compareCommunities>}) {
  const direction = comparison.averageUnitPriceDifference >= 0 ? '+' : '';
  return <div className="grid gap-5 lg:grid-cols-2"><article className="rounded-2xl border border-slate-700 p-5"><p className="text-xs tracking-[.16em] text-blue-200">COMMUNITY A</p><h3 className="mt-2 text-xl font-semibold">{comparison.communityA.community}</h3><p className="mt-5 text-3xl font-bold text-amber-100">{comparison.communityA.averageUnitPrice.toFixed(1)} <span className="text-sm">萬/坪</span></p><p className="mt-2 text-sm text-slate-400">成交 {comparison.communityA.transactionCount} 筆</p></article><article className="rounded-2xl border border-slate-700 p-5"><p className="text-xs tracking-[.16em] text-blue-200">COMMUNITY B</p><h3 className="mt-2 text-xl font-semibold">{comparison.communityB.community}</h3><p className="mt-5 text-3xl font-bold text-amber-100">{comparison.communityB.averageUnitPrice.toFixed(1)} <span className="text-sm">萬/坪</span></p><p className="mt-2 text-sm text-slate-400">平均單價差異 {direction}{comparison.averageUnitPriceDifference.toFixed(1)} 萬/坪（{direction}{comparison.averageUnitPriceDifferencePercent.toFixed(1)}%）</p></article></div>;
}

function ProposalStep({proposal,report}:{proposal:ReturnType<typeof createMarketProposalPackage>;report:ReturnType<typeof createCompleteMarketReport>}) {
  return <div className="grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)]"><aside className="space-y-4"><article className="rounded-2xl border border-amber-300/20 bg-amber-300/5 p-5"><p className="text-xs tracking-[.16em] text-amber-100">COMPLETE MARKET PACKAGE</p><h3 className="mt-2 text-xl font-semibold">八頁完整市場報告</h3><p className="mt-3 text-sm leading-6 text-slate-300">封面、區域、成交、社區、比較、案例、品牌與資料來源一次輸出。</p><div className="mt-5"><CompleteMarketReportExport report={report}/></div></article><BrandPreview branding={mockBranding}/></aside><MarketProposalPreview proposal={proposal}/></div>;
}
