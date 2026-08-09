'use client';

import type {ProposalTemplate, ProposalTemplateId} from '@/features/real-price/proposal-templates/types';

export function ProposalTemplateSelector({templates,value,onChange}:{templates:readonly ProposalTemplate[];value:ProposalTemplateId;onChange:(id:ProposalTemplateId)=>void}) {
  return <section><div className="mb-3"><p className="text-xs tracking-[.16em] text-blue-200/70">TEMPLATE SELECTOR</p><h2 className="mt-1 text-lg font-semibold">選擇提案模板</h2></div><div className="grid gap-3 sm:grid-cols-2">{templates.map((template)=><button key={template.templateId} onClick={()=>onChange(template.templateId)} className={`rounded-xl border p-4 text-left transition ${value===template.templateId?'border-amber-300/60 bg-amber-300/10':'border-slate-700 bg-slate-900/40 hover:border-blue-300/40'}`}><span className="text-xs text-slate-500">{template.coverStyle.toUpperCase()}</span><strong className="mt-2 block text-base">{template.name}</strong><span className="mt-2 block text-sm leading-5 text-slate-400">{template.description}</span></button>)}</div></section>;
}
