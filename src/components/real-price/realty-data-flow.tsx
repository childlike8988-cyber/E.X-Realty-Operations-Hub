import Link from 'next/link';

const steps = [
  {id:'search',label:'Step 1',title:'選擇區域',route:'/tools/real-price'},
  {id:'analysis',label:'Step 2',title:'查看行情',route:'/tools/real-price/community'},
  {id:'compare',label:'Step 3',title:'比較社區',route:'/tools/real-price/compare'},
  {id:'proposal',label:'Step 4',title:'產生提案',route:'/tools/real-price/proposal'},
] as const;

export function RealtyDataFlow({active}:{active:typeof steps[number]['id']}) {
  return <nav aria-label="Realty Data Tools 展示流程" className="mb-6 overflow-x-auto"><ol className="flex min-w-max items-center gap-2">{steps.map((step,index)=><li key={step.id} className="flex items-center gap-2"><Link href={step.route} className={`rounded-lg border px-3 py-2 text-left transition ${active===step.id?'border-amber-300/50 bg-amber-300/10 text-amber-100':'border-slate-700 bg-slate-900/40 text-slate-400 hover:border-blue-300/40'}`}><span className="block text-[10px]">{step.label}</span><span className="block text-sm font-medium">{step.title}</span></Link>{index<steps.length-1&&<span className="text-slate-600">→</span>}</li>)}</ol></nav>;
}
