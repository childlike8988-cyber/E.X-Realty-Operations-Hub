import { Bot, Image, RefreshCw, Sparkles, Video } from 'lucide-react';

export const futureAiVisionCapabilities = ['AI Image Generation', 'AI Video Creation', 'AI Market Insight', 'AI Sales Assistant', 'AI Content Repurposing'] as const;
const icons = [Image, Video, Sparkles, Bot, RefreshCw];

export function AiFutureVision() {
  return <section className="rounded-2xl border border-violet-300/25 bg-violet-300/5 p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs tracking-[.18em] text-violet-100">FUTURE AI VISION</p><h2 className="mt-2 text-2xl font-semibold">Coming Soon</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">未來 AI Capability 展示。此版本未啟用模型、API、計費、外部服務或自動發布。</p></div><span className="rounded-full border border-slate-600 px-3 py-1 text-xs text-slate-300">Not Enabled</span></div><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{futureAiVisionCapabilities.map((title, index) => { const Icon = icons[index]; return <article key={title} className="rounded-xl border border-slate-700 bg-slate-950/30 p-4"><Icon size={18} className="text-violet-200" /><h3 className="mt-3 text-sm font-semibold">{title}</h3><p className="mt-2 text-xs text-slate-500">Future Capability</p><p className="mt-1 text-xs text-amber-100">Not Enabled</p></article>; })}</div></section>;
}
