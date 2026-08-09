'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2, PlayCircle } from 'lucide-react';
import { realtyDemoCases } from '@/data/mock/real-price/demo-cases/demo-cases';
import { caseGuideSteps, createCaseGuideQuery } from '@/features/real-price/case-guide';
import type { RealPriceQuery } from '@/features/real-price/types';

export function RealPriceCaseGuide({ onSelect }: { onSelect: (query: RealPriceQuery) => void }) {
  const selectCase = (caseId: string) => {
    const demoCase = realtyDemoCases.find((item) => item.caseId === caseId);
    if (!demoCase) return;
    onSelect(createCaseGuideQuery(demoCase));
    document.getElementById('transaction-search')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return <section className="mt-12 rounded-3xl border border-blue-300/20 bg-[linear-gradient(135deg,rgba(15,45,76,.7),rgba(12,22,39,.88))] p-6 sm:p-8" aria-labelledby="case-guide-heading"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs tracking-[.18em] text-blue-200">CASE GUIDED MODE</p><h2 id="case-guide-heading" className="mt-2 text-3xl font-semibold">案例導覽模式</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">選擇一個 Mock Case 後，系統會立即載入對應的行情查詢，並提供社區、比較、生活圈與提案的既有展示入口。</p></div><span className="rounded-full border border-amber-300/20 bg-amber-300/5 px-3 py-2 text-xs text-amber-100">MOCK CASES ONLY</span></div><div className="mt-6 grid gap-3 lg:grid-cols-3">{realtyDemoCases.map((item) => <button type="button" onClick={() => selectCase(item.caseId)} key={item.caseId} className="group min-h-32 rounded-2xl border border-slate-600 bg-slate-950/30 p-5 text-left transition hover:border-blue-300/50 hover:bg-blue-300/10"><div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold text-slate-100">{item.title}</h3><p className="mt-2 text-sm text-slate-400">{item.shortDescription}</p></div><PlayCircle size={20} className="shrink-0 text-amber-200" /></div><span className="mt-4 inline-flex items-center gap-1 text-xs text-blue-100">載入案例行情 <ArrowRight size={13} /></span></button>)}</div><div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{caseGuideSteps.map((step, index) => <Link key={step.id} href={step.route} className="rounded-xl border border-white/10 bg-slate-950/30 p-4 hover:border-blue-300/40"><p className="text-xs text-amber-100">STEP 0{index + 1}</p><p className="mt-2 flex items-center justify-between text-sm font-semibold">{step.title}{step.id === 'market' ? <CheckCircle2 size={16} className="text-emerald-200" /> : <ArrowRight size={16} className="text-slate-500" />}</p></Link>)}</div></section>;
}
