import type { DemoStep } from '@/features/demo/demo-flow';

export function PresentationProgress({ steps, activeIndex }: { steps: DemoStep[]; activeIndex: number }) {
  return <div aria-label="Presentation progress" className="flex gap-1 px-5 pt-5 sm:px-8">{steps.map((step, index) => <div key={step.id} className={`h-1 flex-1 rounded-full ${index <= activeIndex ? 'bg-amber-300' : 'bg-slate-700'}`} />)}</div>;
}
