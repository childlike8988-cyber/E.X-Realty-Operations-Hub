'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Copy, Image as ImageIcon, Lightbulb, Sparkles } from 'lucide-react';
import { adaptProposalContextToMarketingContext } from '@/features/property-intelligence/marketing-adapter';
import { mockProperties } from '@/features/property-intelligence/mock-properties';
import { adaptPropertyToProposalContext } from '@/features/property-intelligence/proposal-adapter';
import { createPropertyCreativeContext, generateMarketingContent } from '@/features/property-marketing/generate-marketing-content';
import type { MarketingContentItem } from '@/features/property-marketing/types';

const tabs = [
  { id: 'listing591', label: '591' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'line', label: 'LINE' },
  { id: 'tvWall', label: 'TV Wall' },
] as const;

export function PropertyMarketingStudio() {
  const [propertyId, setPropertyId] = useState(mockProperties[0].id);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]['id']>('listing591');
  const property = mockProperties.find((item) => item.id === propertyId) ?? mockProperties[0];
  const proposalContext = useMemo(() => adaptPropertyToProposalContext(property), [property]);
  const marketingContext = useMemo(() => adaptProposalContextToMarketingContext(proposalContext), [proposalContext]);
  const content = useMemo(() => generateMarketingContent(marketingContext), [marketingContext]);
  const creative = useMemo(() => createPropertyCreativeContext(marketingContext), [marketingContext]);
  const current = content[activeTab];

  return (
    <div className="mx-auto max-w-7xl pb-10">
      <section className="overflow-hidden rounded-3xl border border-blue-300/20 bg-[radial-gradient(circle_at_84%_15%,rgba(126,167,255,.28),transparent_26%),linear-gradient(135deg,#071321,#102b4b)] p-6 sm:p-10">
        <span className="inline-flex rounded-full border border-blue-200/25 bg-blue-300/10 px-3 py-1 text-xs tracking-[.16em] text-blue-100">PROPERTY MARKETING STUDIO · MOCK DATA</span>
        <h1 className="mt-4 text-3xl font-semibold sm:text-5xl">Property Marketing Studio</h1>
        <p className="mt-3 max-w-3xl leading-7 text-slate-300">將 Property Intelligence 的市場、生活圈與銷售洞察轉換成可預覽的房仲行銷文字。所有內容為規則式示範，不會發布至任何外部平台。</p>
        <Link href="/tools/creative-studio" className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-200">建立素材設計</Link>
      </section>

      <section className="mt-7 grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="space-y-5">
          <article className="rounded-2xl border border-emerald-300/25 bg-emerald-300/5 p-5"><p className="text-xs tracking-[.16em] text-emerald-100">SELECT DEMO PROPERTY</p><label className="mt-4 block text-sm">選擇展示案件<select value={propertyId} onChange={(event) => setPropertyId(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2">{mockProperties.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label></article>
          <article className="rounded-2xl border border-slate-700 bg-slate-900/35 p-5"><p className="text-xs tracking-[.16em] text-blue-200">PROPERTY INTELLIGENCE SUMMARY</p><h2 className="mt-2 text-xl font-semibold">{marketingContext.propertyName}</h2><p className="mt-3 text-sm leading-6 text-slate-300">{marketingContext.propertySummary}</p><p className="mt-4 text-sm text-amber-100">推薦客群：{marketingContext.targetAudience}</p><p className="mt-3 text-xs leading-5 text-slate-400">{marketingContext.locationHighlights}</p></article>
          <article className="rounded-2xl border border-violet-300/25 bg-violet-300/5 p-5"><div className="flex items-center gap-2"><ImageIcon size={17} className="text-violet-200"/><p className="text-xs tracking-[.16em] text-violet-100">CREATIVE CONTEXT · RESERVED</p></div><p className="mt-3 text-sm leading-6 text-slate-300">{creative.visualStyle}</p><p className="mt-3 text-xs text-slate-400">已預留 imagePrompt、sceneSuggestions 與 videoConcept；本階段不生成圖片或影片。</p></article>
        </aside>
        <main>
          <div className="flex flex-wrap gap-2 border-b border-slate-700 pb-4">{tabs.map((tab) => <button type="button" key={tab.id} onClick={() => setActiveTab(tab.id)} className={`min-h-10 rounded-lg px-4 text-sm ${activeTab === tab.id ? 'bg-amber-300 font-semibold text-slate-950' : 'border border-slate-700 text-slate-300'}`}>{tab.label}</button>)}</div>
          <MarketingPreview item={current} platform={tabs.find((tab) => tab.id === activeTab)?.label ?? ''}/>
          <article className="mt-5 rounded-2xl border border-blue-300/20 bg-blue-300/5 p-5"><div className="flex items-center gap-2"><Lightbulb size={18} className="text-amber-200"/><p className="text-xs tracking-[.16em] text-blue-200">MARKETING CONTEXT</p></div><p className="mt-3 text-sm leading-6 text-slate-200">價格亮點：{marketingContext.priceHighlights}</p><p className="mt-2 text-sm leading-6 text-slate-200">關鍵字：{marketingContext.keywords.join(' · ')}</p><p className="mt-3 text-xs text-slate-500">資料來源：Mock Data。未串接 591、Facebook、Instagram、LINE 或任何發布服務。</p></article>
        </main>
      </section>
    </div>
  );
}

function MarketingPreview({ item, platform }: { item: MarketingContentItem; platform: string }) {
  return <article className="mt-5 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/35"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700 bg-slate-950/30 p-5"><div><p className="text-xs tracking-[.16em] text-blue-200">{platform.toUpperCase()} PREVIEW</p><h2 className="mt-1 text-xl font-semibold">{item.title}</h2>{item.subtitle && <p className="mt-1 text-sm text-slate-400">{item.subtitle}</p>}</div><button type="button" onClick={() => navigator.clipboard?.writeText(`${item.title}\n${item.body}\n${item.callToAction}`)} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-200"><Copy size={15}/>複製文案</button></div><div className="p-5"><p className="whitespace-pre-line leading-7 text-slate-200">{item.body}</p><div className="mt-5 flex flex-wrap gap-2">{item.sellingPoints.map((point) => <span key={point} className="rounded-full border border-blue-300/25 bg-blue-300/10 px-3 py-1 text-xs text-blue-100">{point}</span>)}</div><div className="mt-6 flex items-center gap-2 border-t border-slate-700 pt-4 text-sm font-medium text-amber-100"><Sparkles size={16}/>{item.callToAction}</div></div></article>;
}
