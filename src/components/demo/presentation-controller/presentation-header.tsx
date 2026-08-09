import { Presentation } from 'lucide-react';

export function PresentationHeader({ caseTitle, stepTitle, stepNumber, total }: { caseTitle: string; stepTitle: string; stepNumber: number; total: number }) {
  return <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-8"><div><p className="text-xs tracking-[.18em] text-blue-200">E.X REALTY AI OPERATION PLATFORM</p><h1 className="mt-1 text-lg font-semibold sm:text-2xl">{caseTitle}</h1></div><div className="flex items-center gap-3 rounded-full border border-amber-300/25 bg-amber-300/10 px-4 py-2 text-amber-100"><Presentation size={17} /><span className="text-sm">Step {stepNumber} / {total} · {stepTitle}</span></div></header>;
}
