import { ArrowLeft, ArrowRight } from 'lucide-react';

export function DemoNavigation({ activeIndex, total, onPrevious, onNext }: { activeIndex: number; total: number; onPrevious: () => void; onNext: () => void }) {
  return <footer className="mt-8 flex items-center justify-between border-t border-slate-700 pt-5"><button type="button" disabled={activeIndex === 0} onClick={onPrevious} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-600 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"><ArrowLeft size={16} />上一頁</button><span className="text-sm text-slate-400">目前：{activeIndex + 1} / {total}</span><button type="button" disabled={activeIndex === total - 1} onClick={onNext} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-blue-300 px-4 py-2 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-40">下一頁<ArrowRight size={16} /></button></footer>;
}
