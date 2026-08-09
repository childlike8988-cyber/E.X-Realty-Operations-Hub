import { ArrowDown } from 'lucide-react';

const story = ['案件資料', 'Realty Data Tools', 'Market Analysis', 'Location Intelligence', 'Property Intelligence', 'Marketing Content', 'Creative Studio', 'Proposal Export'];

export function ShowcaseStoryFlow() {
  return <section><div><p className="text-xs tracking-[.18em] text-blue-200">PRODUCT STORY FLOW</p><h2 className="mt-2 text-3xl font-semibold">從案件資料到客戶提案</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">固定流程讓資料、洞察、文案、素材與提案在同一個展示敘事中連續呈現。</p></div><div className="mt-7 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{story.map((item, index) => <div key={item} className="flex items-center gap-2"><article className="min-h-24 flex-1 rounded-xl border border-blue-300/20 bg-blue-300/5 p-4"><p className="text-xs text-amber-100">0{index + 1}</p><h3 className="mt-2 text-sm font-semibold">{item}</h3></article>{index < story.length - 1 && <ArrowDown className="hidden text-slate-500 lg:block lg:rotate-[-90deg]" size={16} />}</div>)}</div></section>;
}
