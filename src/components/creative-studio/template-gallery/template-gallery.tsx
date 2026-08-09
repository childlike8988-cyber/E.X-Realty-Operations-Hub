import { Check, LayoutTemplate, Star } from 'lucide-react';
import type { CreativeTemplate } from '@/features/creative-studio/types';

const useCases: Record<string, string> = {
  'facebook-property-post': '社群長文與廣告素材',
  'instagram-property-post': '物件精選貼文',
  'instagram-story': '直式限時動態',
  'tv-wall-banner': '店頭與電視牆展示',
  'cover-591': '591 物件封面',
};

export function TemplateGallery({ templates, selectedId, favoriteIds, onApply }: { templates: CreativeTemplate[]; selectedId: string; favoriteIds: string[]; onApply: (templateId: string) => void }) {
  return <section className="rounded-2xl border border-slate-700 bg-slate-900/35 p-5"><div className="flex items-center gap-2"><LayoutTemplate size={17} className="text-blue-200"/><div><p className="text-xs tracking-[.16em] text-blue-200">TEMPLATE GALLERY</p><h2 className="mt-1 font-semibold">模板圖庫</h2></div></div><div className="mt-4 grid gap-3">{templates.map((template) => <article key={template.id} className={`rounded-xl border p-3 ${template.id === selectedId ? 'border-amber-300/60 bg-amber-300/10' : 'border-slate-700'}`}><div className="flex gap-3"><div className="grid h-16 w-20 shrink-0 place-items-center rounded-lg border border-white/10 text-[10px] text-slate-300" style={{ background: template.layout.background }}><span>{template.aspectRatio}</span></div><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><h3 className="text-sm font-medium text-slate-100">{template.name}</h3>{favoriteIds.includes(template.id) && <Star size={14} className="shrink-0 fill-amber-200 text-amber-200"/>}</div><p className="mt-1 text-xs leading-5 text-slate-400">{useCases[template.id]}</p><button type="button" onClick={() => onApply(template.id)} className="mt-2 inline-flex min-h-8 items-center gap-1 rounded-md border border-blue-300/30 px-2 py-1 text-xs text-blue-100">{template.id === selectedId ? <Check size={13}/> : null}{template.id === selectedId ? '已套用' : '套用模板'}</button></div></div></article>)}</div></section>;
}
