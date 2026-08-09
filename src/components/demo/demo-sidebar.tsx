import type { DemoStep } from '@/features/demo/demo-flow';

export function DemoSidebar({ steps, activeIndex, onSelect }: { steps: DemoStep[]; activeIndex: number; onSelect: (index: number) => void }) {
  return <aside className="hidden space-y-2 xl:block">{steps.map((step, index) => <button type="button" key={step.id} onClick={() => onSelect(index)} className={`w-full rounded-xl border p-4 text-left ${activeIndex === index ? 'border-amber-300/70 bg-amber-300/10' : 'border-slate-700 bg-slate-900/35 hover:border-blue-300/40'}`}><p className="text-xs text-blue-200">{String(step.order).padStart(2, '0')}</p><p className="mt-1 font-semibold">{step.title}</p><p className="mt-2 text-xs leading-5 text-slate-400">{step.description}</p></button>)}</aside>;
}
