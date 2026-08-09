'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { MapPinned, Search, TrendingUp } from 'lucide-react';
import { generateMarketInsight } from '@/features/location-intelligence/market-insight';
import { mockAreaMapAdapter } from '@/features/location-intelligence/map/mock-area-map-adapter';
import type { AreaFilter } from '@/features/location-intelligence/map/types';

const initialFilter: AreaFilter = { district: '', propertyType: '', priceRange: '', sizeRange: '', ageRange: '' };

export function RealPriceMapIntelligence() {
  const [filter, setFilter] = useState<AreaFilter>(initialFilter);
  const regions = useMemo(() => mockAreaMapAdapter.getRegions(filter), [filter]);
  const markers = useMemo(() => mockAreaMapAdapter.getMarkers(regions), [regions]);
  const [selectedId, setSelectedId] = useState('gushan-art-district');
  const selected = regions.find((region) => region.id === selectedId) ?? regions[0];
  const updateFilter = <K extends keyof AreaFilter>(key: K, value: AreaFilter[K]) => setFilter((current) => ({ ...current, [key]: value }));

  useEffect(() => {
    if (regions.length && !regions.some((region) => region.id === selectedId)) setSelectedId(regions[0].id);
  }, [regions, selectedId]);

  if (!selected) return <div className="mx-auto max-w-7xl rounded-2xl border border-slate-700 p-6 text-slate-300">目前條件沒有對應的 Mock 區域資料。</div>;
  const insight = generateMarketInsight(selected);

  return <div className="mx-auto max-w-7xl pb-12">
    <section className="overflow-hidden rounded-3xl border border-blue-300/20 bg-[radial-gradient(circle_at_82%_18%,rgba(126,167,255,.32),transparent_27%),linear-gradient(135deg,#071321,#102b4b)] px-6 py-12 sm:px-10 sm:py-16">
      <p className="inline-flex items-center gap-2 rounded-full border border-blue-200/25 bg-blue-300/10 px-3 py-1 text-xs tracking-[.16em] text-blue-100"><MapPinned size={14} />REAL PRICE MAP INTELLIGENCE · MOCK DATA</p>
      <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-6xl">區域行情智慧分析</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-blue-100">從成交數據，看見城市房價脈絡。</p>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">此頁使用 CSS 示意地圖與 Mock Data，不會連接 Google Maps、政府資料或第三方地圖服務。</p>
    </section>

    <section className="mt-8 grid gap-6 xl:grid-cols-[320px_1fr]">
      <aside className="rounded-2xl border border-slate-700 bg-slate-900/35 p-5">
        <p className="text-xs tracking-[.16em] text-blue-200">AREA SEARCH PANEL</p>
        <h2 className="mt-2 text-xl font-semibold">區域搜尋</h2>
        <div className="mt-5 space-y-4">
          <Field label="行政區"><select value={filter.district} onChange={(event) => updateFilter('district', event.target.value as AreaFilter['district'])}><option value="">全部區域</option><option value="鼓山區">鼓山區</option><option value="左營區">左營區</option><option value="鳳山區">鳳山區</option></select></Field>
          <Field label="物件類型"><select value={filter.propertyType} onChange={(event) => updateFilter('propertyType', event.target.value as AreaFilter['propertyType'])}><option value="">全部類型</option><option value="大樓">大樓</option><option value="透天">透天</option><option value="公寓">公寓</option></select></Field>
          <Field label="坪數"><select value={filter.sizeRange} onChange={(event) => updateFilter('sizeRange', event.target.value as AreaFilter['sizeRange'])}><option value="">不限</option><option value="20-50坪">20-50坪</option></select></Field>
          <Field label="屋齡"><select value={filter.ageRange} onChange={(event) => updateFilter('ageRange', event.target.value as AreaFilter['ageRange'])}><option value="">不限</option><option value="5年內">5年內</option><option value="5-15年">5-15年</option><option value="15年以上">15年以上</option></select></Field>
          <Field label="價格區間"><select value={filter.priceRange} onChange={(event) => updateFilter('priceRange', event.target.value as AreaFilter['priceRange'])}><option value="">不限</option><option value="1000-3000萬">1000-3000萬</option></select></Field>
          <button type="button" onClick={() => setSelectedId(regions[0]?.id ?? 'gushan-art-district')} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-amber-300 px-4 py-3 text-sm font-semibold text-slate-950"><Search size={16} />搜尋區域行情</button>
        </div>
      </aside>
      <section className="rounded-3xl border border-slate-700 bg-slate-900/35 p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs tracking-[.16em] text-blue-200">MOCK MAP CANVAS</p><h2 className="mt-1 text-2xl font-semibold">高雄區域示意</h2></div><span className="rounded-full border border-amber-300/20 bg-amber-300/5 px-3 py-1 text-xs text-amber-100">SOURCE: MOCK DATA</span></div>
        <div className="relative mt-6 min-h-96 overflow-hidden rounded-2xl border border-blue-300/15 bg-[radial-gradient(circle_at_20%_25%,rgba(126,167,255,.16),transparent_25%),radial-gradient(circle_at_72%_72%,rgba(244,201,106,.14),transparent_22%),linear-gradient(140deg,#0b1e33,#142f48)]">
          <div className="absolute inset-7 rounded-[42%_58%_45%_55%] border border-blue-200/15 bg-blue-300/5" /><div className="absolute inset-x-12 top-1/2 h-px bg-blue-200/15" /><div className="absolute bottom-10 left-1/2 h-3/5 w-px bg-blue-200/15" />
          {markers.map((marker) => <button key={marker.id} type="button" onClick={() => setSelectedId(marker.id.replace('marker-', ''))} style={{ left: `${marker.position.x}%`, top: `${marker.position.y}%` }} className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-xl border px-3 py-2 text-left shadow-lg transition ${selected.id === marker.id.replace('marker-', '') ? 'border-amber-200 bg-amber-300 text-slate-950' : 'border-blue-200/40 bg-slate-950/85 text-slate-100 hover:border-blue-100'}`}><span className="block text-xs font-semibold">{marker.title}</span><span className="mt-1 block text-sm">{marker.value}</span></button>)}
        </div>
      </section>
    </section>

    <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4"><Metric label="平均單價" value={`${selected.averagePrice}萬/坪`} /><Metric label="成交量" value={`${selected.transactionCount} 筆`} /><Metric label="年增幅" value={`+${selected.growthRate}%`} /><Metric label="熱門指數" value={`${selected.popularityScore} / 100`} /></section>
    <section className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
      <article className="rounded-2xl border border-slate-700 bg-slate-900/35 p-6"><p className="text-xs tracking-[.16em] text-blue-200">AREA MARKET SUMMARY</p><h2 className="mt-2 text-3xl font-semibold">{selected.district} · {selected.name}</h2><div className="mt-6"><p className="text-sm text-slate-400">熱門社區</p><div className="mt-3 flex flex-wrap gap-2">{selected.popularCommunities.map((community) => <span key={community} className="rounded-full border border-slate-700 bg-slate-950/30 px-3 py-2 text-sm text-slate-200">{community}</span>)}</div></div><div className="mt-6"><p className="text-sm text-slate-400">生活標籤</p><div className="mt-3 flex flex-wrap gap-2">{selected.lifestyleTags.map((tag) => <span key={tag} className="rounded-full border border-blue-300/20 bg-blue-300/5 px-3 py-2 text-sm text-blue-100">{tag}</span>)}</div></div></article>
      <article className="rounded-2xl border border-violet-300/20 bg-violet-300/5 p-6"><p className="text-xs tracking-[.16em] text-violet-100">{insight.label.toUpperCase()}</p><h2 className="mt-2 text-2xl font-semibold">{insight.title}</h2><p className="mt-4 text-sm leading-7 text-slate-300">{insight.summary}</p><div className="mt-5"><p className="text-sm font-medium text-violet-100">建議客群</p><p className="mt-2 text-sm leading-6 text-slate-300">{insight.audiences.join('、')}</p></div><p className="mt-6 text-xs text-slate-500">{insight.source} · 非 AI 生成、僅供展示</p></article>
    </section>
  </div>;
}

function Field({ label, children }: { label: string; children: ReactNode }) { return <label className="block text-sm text-slate-300"><span>{label}</span><span className="mt-2 block [&_select]:w-full [&_select]:rounded-lg [&_select]:border [&_select]:border-slate-700 [&_select]:bg-slate-950 [&_select]:px-3 [&_select]:py-2">{children}</span></label>; }
function Metric({ label, value }: { label: string; value: string }) { return <article className="rounded-2xl border border-slate-700 bg-slate-900/35 p-5"><div className="flex items-center justify-between gap-3"><p className="text-sm text-slate-400">{label}</p><TrendingUp size={17} className="text-emerald-200" /></div><p className="mt-3 text-2xl font-semibold">{value}</p></article>; }
