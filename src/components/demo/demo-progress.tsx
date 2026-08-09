import type { DemoStep } from '@/features/demo/demo-flow';

export function DemoProgress({ steps, activeIndex }: { steps: DemoStep[]; activeIndex: number }) {
  return <nav aria-label="Demo progress" className="grid gap-2 sm:grid-cols-2 lg:grid-cols-7">{steps.map((step, index) => <div key={step.id} className={`rounded-xl border p-3 ${index === activeIndex ? 'border-amber-300/70 bg-amber-300/10' : index < activeIndex ? 'border-blue-300/30 bg-blue-300/5' : 'border-slate-700 bg-slate-900/35'}`}><p className="text-xs text-blue-200">STEP {step.order}</p><p className="mt-1 text-sm font-semibold">{step.title}</p></div>)}</nav>;
}
