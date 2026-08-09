import Link from 'next/link';
import { ArrowRight, BarChart3, BrainCircuit, FileOutput, Megaphone, Palette } from 'lucide-react';
import { AiFutureVision } from '@/components/demo/ai-future-vision';
import { demoCases } from '@/features/demo/demo-flow';
import { BrandShowcase } from './brand-showcase';
import { ShowcaseStoryFlow } from './showcase-story-flow';
import { WorkflowComparison } from './workflow-comparison';

const capabilities = [
  { title: 'Realty Data Tools', description: '從 Mock 成交資料、社區行情到市場提案的展示分析流程。', icon: BarChart3 },
  { title: 'Property Intelligence', description: '整理物件定位、生活圈與銷售觀點，建立展示摘要。', icon: BrainCircuit },
  { title: 'Marketing Automation', description: '以規則式 Context 產生多平台房仲行銷內容草稿。', icon: Megaphone },
  { title: 'Creative Studio', description: '以固定模板與 Mock 素材建立一致的行銷視覺預覽。', icon: Palette },
  { title: 'Proposal Generation', description: '將分析結果組合成可向客戶說明的市場提案。', icon: FileOutput },
] as const;

export function PublicShowcase() {
  return <div className="mx-auto max-w-7xl pb-12"><section className="overflow-hidden rounded-3xl border border-blue-300/20 bg-[radial-gradient(circle_at_78%_18%,rgba(126,167,255,.33),transparent_27%),linear-gradient(135deg,#071321,#102b4b)] p-7 sm:p-14"><p className="text-xs tracking-[.2em] text-blue-100">PUBLIC PRODUCT SHOWCASE · MOCK DATA</p><h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight sm:text-6xl">E.X Realty AI Operation Platform</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">AI 房產營運與智慧行銷展示平台。</p><p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">由案例、資料、分析、行銷與創意製作串接成可說明的工作流程；所有內容維持 Mock Data 與 Placeholder AI Capability。</p><div className="mt-7 flex flex-wrap gap-3"><Link href="/demo" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-amber-300 px-5 py-3 text-sm font-semibold text-slate-950">開始 AI 房產展示 <ArrowRight size={17} /></Link><Link href="/tour" className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-blue-200/25 bg-slate-950/30 px-5 py-3 text-sm font-semibold text-blue-50">產品導覽</Link></div></section><section className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">{capabilities.map(({ title, description, icon: Icon }) => <article key={title} className="rounded-2xl border border-slate-700 bg-slate-900/35 p-5"><Icon size={20} className="text-amber-100" /><h2 className="mt-4 font-semibold">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-400">{description}</p></article>)}</section><section className="mt-12"><ShowcaseStoryFlow /></section><section className="mt-12"><WorkflowComparison /></section><section className="mt-12"><div className="mb-5"><p className="text-xs tracking-[.18em] text-blue-200">DEMO CASES</p><h2 className="mt-2 text-3xl font-semibold">推薦展示案例</h2></div><div className="grid gap-5 lg:grid-cols-3">{demoCases.map((item) => <article key={item.caseId} className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/35"><div className={`h-32 bg-gradient-to-br ${item.coverStyle} p-5`}><span className="rounded-full border border-white/15 bg-slate-950/35 px-3 py-1 text-xs text-white">{item.subtitle}</span></div><div className="p-5"><h3 className="text-xl font-semibold">{item.title}</h3><p className="mt-3 text-sm leading-6 text-slate-400">{item.description}</p><p className="mt-4 text-sm text-blue-100">適合展示：{item.suitableFor}</p><p className="mt-2 text-sm text-amber-100">銷售情境：{item.salesScenario}</p><Link href={`/demo/${item.caseId}/present`} className="mt-5 inline-flex min-h-10 items-center text-sm text-blue-100 hover:text-blue-50">開始 Presentation View <ArrowRight size={15} className="ml-1" /></Link></div></article>)}</div></section><section className="mt-12"><BrandShowcase /></section><section className="mt-12"><AiFutureVision /></section></div>;
}
