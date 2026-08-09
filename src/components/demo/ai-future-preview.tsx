import { Bot, Image, Sparkles, Video } from 'lucide-react';

export const futureAiCapabilities = ['AI Image Generation', 'AI Video Creation', 'AI Market Insight', 'AI Sales Assistant'] as const;
const capabilities = [{ title: futureAiCapabilities[0], icon: Image }, { title: futureAiCapabilities[1], icon: Video }, { title: futureAiCapabilities[2], icon: Sparkles }, { title: futureAiCapabilities[3], icon: Bot }];

export function AiFuturePreview() {
  return <section className="rounded-2xl border border-violet-300/25 bg-violet-300/5 p-5"><div className="flex items-center justify-between gap-4"><div><p className="text-xs tracking-[.16em] text-violet-100">FUTURE AI CAPABILITY</p><h3 className="mt-1 text-xl font-semibold">Coming Soon</h3></div><span className="rounded-full border border-slate-600 px-3 py-1 text-xs text-slate-300">Not Enabled</span></div><div className="mt-4 grid gap-3 sm:grid-cols-2">{capabilities.map(({ title, icon: Icon }) => <div key={title} className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950/30 p-3 text-sm text-slate-300"><Icon size={17} className="text-violet-200" />{title}</div>)}</div><p className="mt-4 text-xs leading-5 text-slate-500">此區僅為未來能力展示，未啟用 AI API、外部服務或自動發布。</p></section>;
}
