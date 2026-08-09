'use client';

import {ArrowRight,Lightbulb,MapPinned,Users} from 'lucide-react';
import type {PropertyProposalContext} from '@/features/property-intelligence/types';

export function PropertyProposalPreview({context,onCreate}:{context:PropertyProposalContext;onCreate:() => void}) {
  return <section className="rounded-2xl border border-emerald-300/25 bg-emerald-300/5 p-5"><p className="text-xs tracking-[.16em] text-emerald-100">PROPERTY INTELLIGENCE IMPORT · MOCK DATA</p><h2 className="mt-2 text-xl font-semibold">{context.property.title}</h2><div className="mt-5 space-y-4 text-sm"><div><p className="font-medium text-blue-100">市場定位</p><p className="mt-1 leading-6 text-slate-300">{context.marketSummary}</p></div><div><p className="flex items-center gap-2 font-medium text-blue-100"><MapPinned size={15}/>生活圈優勢</p><p className="mt-1 leading-6 text-slate-300">{context.locationSummary}</p></div><div><p className="flex items-center gap-2 font-medium text-blue-100"><Users size={15}/>推薦客群</p><p className="mt-1 text-slate-300">{context.targetCustomer}</p></div><div><p className="flex items-center gap-2 font-medium text-amber-100"><Lightbulb size={15}/>銷售策略</p><p className="mt-1 leading-6 text-slate-300">{context.salesStrategy}</p></div></div><button type="button" onClick={onCreate} className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-emerald-300 px-4 py-2 text-sm font-semibold text-slate-950">建立市場提案<ArrowRight size={16}/></button></section>;
}
