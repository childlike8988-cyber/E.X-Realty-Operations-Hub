'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowLeft, ExternalLink, Presentation } from 'lucide-react';
import { DemoNavigation } from '@/components/demo/demo-navigation';
import { DemoProgress } from '@/components/demo/demo-progress';
import { DemoSidebar } from '@/components/demo/demo-sidebar';
import { AiFuturePreview } from '@/components/demo/ai-future-preview';
import { calculateCommunitySummary } from '@/features/real-price/community-analysis';
import { demoSteps, getDemoCase } from '@/features/demo/demo-flow';
import { mockProperties } from '@/features/property-intelligence/mock-properties';
import { adaptPropertyToProposalContext, createPropertyMarketProposalPackage } from '@/features/property-intelligence/proposal-adapter';
import { adaptProposalContextToMarketingContext } from '@/features/property-intelligence/marketing-adapter';
import { generateMarketingContent } from '@/features/property-marketing/generate-marketing-content';
import { getProposalTemplate } from '@/features/real-price/proposal-templates/templates';
import { realPriceTransactions } from '@/data/mock/real-price/real-price-data';

export function DemoPresentationMode({ caseId }: { caseId: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const demoCase = getDemoCase(caseId);
  const property = mockProperties.find((item) => item.id === demoCase?.propertyId) ?? mockProperties[0];
  const proposalContext = useMemo(() => adaptPropertyToProposalContext(property), [property]);
  const marketingContext = useMemo(() => adaptProposalContextToMarketingContext(proposalContext), [proposalContext]);
  const marketing = useMemo(() => generateMarketingContent(marketingContext), [marketingContext]);
  const transactions = useMemo(() => realPriceTransactions.filter((item) => item.community === property.community), [property.community]);
  const summary = useMemo(() => calculateCommunitySummary(transactions, property.community), [property.community, transactions]);
  const proposal = useMemo(() => createPropertyMarketProposalPackage(property, getProposalTemplate(demoCase?.caseId === 'gushan-art-district' ? 'luxury-real-estate' : demoCase?.caseId === 'zuoying-hsr-district' ? 'ai-data-style' : 'minimal')), [demoCase?.caseId, property]);
  const step = demoSteps[activeIndex];
  if (!demoCase) return <div className="mx-auto max-w-4xl pb-10"><h1 className="text-3xl font-semibold">找不到展示案例</h1><Link href="/demo" className="mt-5 inline-flex min-h-11 items-center rounded-lg border border-blue-300/30 px-4 py-2 text-blue-100">返回 Demo Center</Link></div>;

  return <div className="mx-auto max-w-[1500px] pb-10"><header className="rounded-3xl border border-blue-300/20 bg-[linear-gradient(135deg,#071321,#102b4b)] p-6 sm:p-8"><div className="flex flex-wrap items-start justify-between gap-4"><div><span className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs text-amber-100"><Presentation size={14} />CLIENT PRESENTATION · MOCK DATA</span><h1 className="mt-4 text-3xl font-semibold sm:text-5xl">{demoCase.title}</h1><p className="mt-2 text-slate-300">{demoCase.subtitle}</p></div><Link href="/demo" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-100"><ArrowLeft size={16} />Demo Center</Link></div></header><div className="mt-6"><DemoProgress steps={demoSteps} activeIndex={activeIndex} /></div><div className="mt-6 grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)]"><DemoSidebar steps={demoSteps} activeIndex={activeIndex} onSelect={setActiveIndex} /><main className="min-w-0 rounded-2xl border border-slate-700 bg-slate-900/35 p-5 sm:p-8"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs tracking-[.16em] text-blue-200">STEP {step.order} / {demoSteps.length}</p><h2 className="mt-2 text-2xl font-semibold">{step.title}</h2><p className="mt-2 text-sm text-slate-400">{step.description}</p></div><Link href={step.route} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-blue-300/30 px-3 py-2 text-sm text-blue-100">開啟工作台<ExternalLink size={15} /></Link></div><DemoStepContent stepId={step.id} property={property} proposalContext={proposalContext} summary={summary} marketing={marketing} proposal={proposal} /><DemoNavigation activeIndex={activeIndex} total={demoSteps.length} onPrevious={() => setActiveIndex((value) => Math.max(0, value - 1))} onNext={() => setActiveIndex((value) => Math.min(demoSteps.length - 1, value + 1))} /></main></div></div>;
}

function DemoStepContent({ stepId, property, proposalContext, summary, marketing, proposal }: { stepId: string; property: typeof mockProperties[number]; proposalContext: ReturnType<typeof adaptPropertyToProposalContext>; summary: ReturnType<typeof calculateCommunitySummary>; marketing: ReturnType<typeof generateMarketingContent>; proposal: ReturnType<typeof createPropertyMarketProposalPackage> }) {
  if (stepId === 'overview') return <section className="mt-7 grid gap-4 md:grid-cols-2"><Card label="PROPERTY" title={property.title} lines={[`${property.buildingType} · ${property.rooms} · ${property.areaPing} 坪`, `${property.floor} · 屋齡 ${property.age} 年 · ${property.totalPrice.toLocaleString()} 萬`, `示範客群：${property.targetCustomer}`]} /><Card label="POSITIONING" title="展示定位" lines={property.sellingPoints} /></section>;
  if (stepId === 'market') return <section className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Metric label="平均單價" value={`${summary.averageUnitPrice.toFixed(1)} 萬/坪`} /><Metric label="最高單價" value={`${summary.highestUnitPrice.toFixed(1)} 萬/坪`} /><Metric label="成交筆數" value={`${summary.transactionCount} 筆`} /><Metric label="平均屋齡" value={`${summary.averageBuildingAge.toFixed(1)} 年`} /></section>;
  if (stepId === 'location') return <section className="mt-7 grid gap-4 md:grid-cols-2"><Card label="LIFESTYLE SCORE" title={`${proposalContext.score.locationScore} / 100`} lines={[proposalContext.locationSummary, '學區、交通、採買、休閒與醫療皆為規則式 Mock 分析。']} /><Card label="SALES ANGLE" title="生活圈價值" lines={proposalContext.sellingPoints.slice(0, 3)} /></section>;
  if (stepId === 'intelligence') return <section className="mt-7 grid gap-4 md:grid-cols-2"><Card label="DEMO GENERATED SCORE" title={`${proposalContext.score.overallScore} / 100`} lines={[`市場 ${proposalContext.score.marketScore} · 生活圈 ${proposalContext.score.locationScore} · 價值 ${proposalContext.score.valueScore}`, proposalContext.salesStrategy]} /><Card label="TARGET CUSTOMER" title={proposalContext.targetCustomer} lines={proposalContext.sellingPoints} /></section>;
  if (stepId === 'marketing') return <section className="mt-7 grid gap-4 md:grid-cols-2"><Card label="591 CONTENT" title={marketing.listing591.title} lines={[marketing.listing591.subtitle ?? '', ...marketing.listing591.sellingPoints]} /><Card label="SOCIAL CONTENT" title={marketing.instagram.title} lines={marketing.instagram.body.split('\n').slice(0, 4)} /></section>;
  if (stepId === 'creative') return <section className="mt-7"><Card label="CREATIVE STUDIO" title="固定模板素材工作台" lines={[`建議使用 ${proposal.template.name} 提案視覺語言。`, '可編輯文字與 Mock 素材，瀏覽器本機儲存與 PNG/PDF 匯出。']} /><div className="mt-5"><AiFuturePreview /></div></section>;
  return <section className="mt-7"><Card label="MARKET PROPOSAL PACKAGE" title={`${property.community} 市場提案`} lines={[`已組合 ${proposal.template.supportedSections.length} 個提案段落。`, 'PDF / PNG 為瀏覽器端展示匯出；所有內容均標記為 Mock Data。', '正式估價、AI 洞察與對外發布均未啟用。']} /><div className="mt-5"><AiFuturePreview /></div></section>;
}

function Metric({ label, value }: { label: string; value: string }) { return <article className="rounded-xl border border-blue-300/20 bg-blue-300/5 p-5"><p className="text-xs tracking-[.14em] text-blue-200">{label}</p><p className="mt-3 text-2xl font-semibold text-amber-100">{value}</p><p className="mt-2 text-xs text-slate-500">Mock Data</p></article>; }
function Card({ label, title, lines }: { label: string; title: string; lines: string[] }) { return <article className="rounded-2xl border border-slate-700 bg-slate-950/25 p-5"><p className="text-xs tracking-[.16em] text-blue-200">{label}</p><h3 className="mt-2 text-xl font-semibold">{title}</h3><div className="mt-4 space-y-2 text-sm leading-6 text-slate-300">{lines.filter(Boolean).map((line) => <p key={line}>• {line}</p>)}</div></article>; }
