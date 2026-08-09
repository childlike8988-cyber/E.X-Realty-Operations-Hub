'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DemoTimer } from '@/components/demo/demo-timer';
import { PresentationHeader } from '@/components/demo/presentation-controller/presentation-header';
import { PresentationNavigation } from '@/components/demo/presentation-controller/presentation-navigation';
import { PresentationProgress } from '@/components/demo/presentation-controller/presentation-progress';
import { AiFutureVision } from '@/components/demo/ai-future-vision';
import { DemoReportExport } from '@/components/demo/demo-report-export';
import { createDemoReportContext } from '@/features/demo/demo-report';
import { demoSteps, getDemoCase, moveDemoStep } from '@/features/demo/demo-flow';
import { getPresenterNote } from '@/features/demo/presenter-notes';
import { futureAiVisionCapabilities } from '@/components/demo/ai-future-vision';

export function FullscreenPresentation({ caseId }: { caseId: string }) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [showNotes, setShowNotes] = useState(true);
  const demoCase = getDemoCase(caseId);
  const step = demoSteps[activeIndex];
  const note = getPresenterNote(step.id);
  const report = useMemo(() => demoCase ? createDemoReportContext(demoCase, [...futureAiVisionCapabilities]) : null, [demoCase]);
  const exit = useCallback(() => router.push(demoCase ? `/demo/${demoCase.caseId}` : '/demo'), [demoCase, router]);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') setActiveIndex((value) => moveDemoStep(value, 'next'));
      if (event.key === 'ArrowLeft') setActiveIndex((value) => moveDemoStep(value, 'previous'));
      if (event.key === 'Escape') exit();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [exit]);
  if (!demoCase || !report) return null;
  return <div className="min-h-screen bg-[radial-gradient(circle_at_76%_13%,rgba(126,167,255,.22),transparent_24%),linear-gradient(135deg,#06101d,#102b4b)] text-slate-100"><PresentationHeader caseTitle={demoCase.title} stepTitle={step.title} stepNumber={step.order} total={demoSteps.length} /><PresentationProgress steps={demoSteps} activeIndex={activeIndex} /><main className="mx-auto flex min-h-[calc(100vh-150px)] max-w-6xl flex-col px-5 py-8 sm:px-8"><div className="flex flex-wrap items-center justify-between gap-4"><p className="text-sm text-slate-300">{step.description}</p><DemoTimer /></div><section className="flex flex-1 items-center py-8"><article className="w-full rounded-3xl border border-white/10 bg-slate-950/35 p-7 shadow-2xl sm:p-12"><p className="text-xs tracking-[.2em] text-blue-200">PRESENTATION VIEW · MOCK DATA</p><h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">{step.title}</h2><p className="mt-6 max-w-4xl text-xl leading-9 text-slate-300">{getSlideMessage(step.id, demoCase.title)}</p><div className="mt-10 grid gap-4 md:grid-cols-3"><Highlight title="案例" value={demoCase.title} /><Highlight title="展示客群" value={demoCase.audience} /><Highlight title="資料狀態" value="Mock Data" /></div>{step.id === 'proposal' && <div className="mt-8"><DemoReportExport report={report} /></div>}{step.id === 'creative' && <div className="mt-8"><AiFutureVision /></div>}</article></section>{showNotes && note && <aside className="rounded-2xl border border-violet-300/25 bg-violet-300/10 p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs tracking-[.16em] text-violet-100">PRESENTER NOTES · 僅展示者模式可見</p><h3 className="mt-2 font-semibold">{note.title}</h3><p className="mt-2 text-sm leading-6 text-slate-300">{note.content}</p></div><button type="button" onClick={() => setShowNotes(false)} className="min-h-10 rounded-lg border border-slate-600 px-3 text-sm text-slate-200">隱藏 Notes</button></div></aside>}{!showNotes && <button type="button" onClick={() => setShowNotes(true)} className="mb-4 self-start rounded-lg border border-violet-300/30 px-3 py-2 text-sm text-violet-100">顯示 Presenter Notes</button>}</main><PresentationNavigation activeIndex={activeIndex} total={demoSteps.length} onPrevious={() => setActiveIndex((value) => moveDemoStep(value, 'previous'))} onNext={() => setActiveIndex((value) => moveDemoStep(value, 'next'))} onExit={exit} /></div>;
}

function Highlight({ title, value }: { title: string; value: string }) { return <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5"><p className="text-xs tracking-[.16em] text-blue-200">{title}</p><p className="mt-2 text-lg font-semibold">{value}</p></div>; }
function getSlideMessage(stepId: string, caseTitle: string) { const messages: Record<string, string> = { overview: `以 ${caseTitle} 展示從案件資訊到智慧分析的第一步。`, market: '以 Mock 成交資料建立區域與社區價格策略，協助業務清楚說明市場定位。', location: '以生活圈、交通、學區、採買與休閒資訊，建立房屋以外的居住價值說法。', intelligence: '把市場與生活圈資料整合成目標客群、核心賣點與銷售策略。', marketing: '將案件 Context 轉為 591、社群與客戶溝通的展示文案。', creative: '使用固定模板把內容轉為一致的品牌素材；未啟用任何 AI 圖像或影片服務。', proposal: '將七步展示整理成可下載的 Demo PDF 報告，所有內容均標示 Mock Data。' }; return messages[stepId] ?? '展示流程。'; }
