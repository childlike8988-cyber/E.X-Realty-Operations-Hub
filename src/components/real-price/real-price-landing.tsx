import Link from 'next/link';
import { ArrowRight, BarChart3, Building2, FileText, MapPinned, Sparkles } from 'lucide-react';
import { realtyDemoCases } from '@/data/mock/real-price/demo-cases/demo-cases';
import { realPriceStorySteps, realPriceToolEntries, realPriceValuePillars } from '@/features/real-price/showcase-content';

const icons = [BarChart3, Building2, MapPinned, FileText, Sparkles, ArrowRight] as const;

export function RealPriceLanding() {
  return <>
    <section className="overflow-hidden rounded-3xl border border-blue-300/20 bg-[radial-gradient(circle_at_82%_16%,rgba(126,167,255,.34),transparent_24%),radial-gradient(circle_at_66%_88%,rgba(244,201,106,.12),transparent_22%),linear-gradient(135deg,#071321,#102b4b)] px-6 py-10 sm:px-10 sm:py-14">
      <div className="max-w-4xl">
        <p className="inline-flex rounded-full border border-blue-200/25 bg-blue-300/10 px-3 py-1 text-xs tracking-[.16em] text-blue-100">REALTY DATA TOOLS · POWERED BY MOCK DATA</p>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-6xl">Realty Data Intelligence</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-blue-100 sm:text-xl">從成交資料、社區行情到市場提案，打造 AI 時代房仲決策工具。</p>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">此頁為公開展示版，所有行情皆為 Mock Data；Future AI Capability 僅保留產品方向，不會呼叫外部資料或 AI 服務。</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="#transaction-search" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-amber-300 px-5 py-3 text-sm font-semibold text-slate-950">開始實價查詢 <ArrowRight size={17} /></Link>
          <Link href="/tools/real-price/demo" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-blue-200/25 bg-slate-950/25 px-5 py-3 text-sm font-semibold text-blue-50">查看 Demo Showcase</Link>
        </div>
      </div>
      <ol className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5" aria-label="Realty Data Tools 展示流程">
        {realPriceStorySteps.map((step, index) => <li key={step} className="flex min-h-24 items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/30 p-4"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-amber-300/15 text-xs font-bold text-amber-100">0{index + 1}</span><span className="text-sm font-semibold text-slate-100">{step}</span></li>)}
      </ol>
    </section>

    <section className="mt-10" aria-labelledby="real-price-tools-heading">
      <p className="text-xs tracking-[.18em] text-blue-200">CORE CAPABILITIES</p>
      <h2 id="real-price-tools-heading" className="mt-2 text-3xl font-semibold">Real Price Explorer</h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">從一次查詢開始，依序延伸至社區、比較、提案與完整展示報告。</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {realPriceToolEntries.map((item, index) => { const Icon = icons[index]; return <Link href={item.route} key={item.title} className="group min-h-40 rounded-2xl border border-slate-700 bg-slate-900/35 p-5 transition hover:-translate-y-0.5 hover:border-blue-300/40 hover:bg-slate-900/55"><Icon size={20} className="text-amber-200" /><h3 className="mt-4 flex items-center justify-between gap-3 font-semibold">{item.title}<ArrowRight size={16} className="text-slate-500 transition group-hover:translate-x-1 group-hover:text-blue-100" /></h3><p className="mt-2 text-sm leading-6 text-slate-400">{item.description}</p></Link>; })}
      </div>
    </section>

    <section className="mt-12" aria-labelledby="demo-cases-heading">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs tracking-[.18em] text-blue-200">RECOMMENDED DEMO CASES</p><h2 id="demo-cases-heading" className="mt-2 text-3xl font-semibold">推薦展示案例</h2></div><span className="rounded-full border border-amber-300/20 bg-amber-300/5 px-3 py-1 text-xs text-amber-100">MOCK DATA · DEMO ONLY</span></div>
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {realtyDemoCases.map((item) => <article key={item.caseId} className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/35"><div className={`h-28 bg-gradient-to-br ${item.caseId === 'gushan-art-district' ? 'from-amber-300/30 via-slate-900 to-blue-950' : item.caseId === 'zuoying-hsr-district' ? 'from-cyan-300/25 via-slate-900 to-blue-950' : 'from-violet-300/25 via-slate-900 to-blue-950'} p-5`}><span className="rounded-full border border-white/15 bg-slate-950/30 px-3 py-1 text-xs text-white">{item.recommendedScenario}</span></div><div className="p-5"><h3 className="text-xl font-semibold">{item.title}</h3><p className="mt-3 min-h-12 text-sm leading-6 text-slate-400">{item.shortDescription}</p><p className="mt-4 text-xs text-blue-100">適合展示對象：{item.targetAudience}</p><div className="mt-5 grid gap-2 sm:grid-cols-3"><Link href="/tools/real-price/community" className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-200 hover:border-blue-300/40">查看分析</Link><Link href="/tools/real-price/proposal" className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-200 hover:border-blue-300/40">查看提案</Link><Link href={`/demo/${item.caseId}`} className="inline-flex min-h-10 items-center justify-center rounded-lg bg-blue-300/15 px-3 py-2 text-xs text-blue-100 hover:bg-blue-300/25">完整 Demo</Link></div></div></article>)}
      </div>
    </section>

    <section className="mt-12 rounded-3xl border border-slate-700 bg-slate-900/30 p-6 sm:p-9" aria-labelledby="why-real-price-heading">
      <p className="text-xs tracking-[.18em] text-blue-200">WHY REALTY DATA TOOLS?</p>
      <h2 id="why-real-price-heading" className="mt-2 text-3xl font-semibold">資料不是終點，而是銷售溝通的起點。</h2>
      <div className="mt-7 grid gap-4 md:grid-cols-3">{realPriceValuePillars.map((item, index) => <article key={item.title} className="rounded-2xl border border-blue-300/15 bg-blue-300/5 p-5"><p className="text-xs font-semibold tracking-[.14em] text-amber-100">0{index + 1}</p><h3 className="mt-4 text-lg font-semibold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{item.description}</p></article>)}</div>
      <div className="mt-7 flex flex-wrap gap-3 text-xs"><span className="rounded-full border border-amber-300/20 bg-amber-300/5 px-3 py-2 text-amber-100">Powered by Mock Data</span><span className="rounded-full border border-blue-300/20 bg-blue-300/5 px-3 py-2 text-blue-100">Future AI Capability · Not Enabled</span></div>
    </section>
  </>;
}
