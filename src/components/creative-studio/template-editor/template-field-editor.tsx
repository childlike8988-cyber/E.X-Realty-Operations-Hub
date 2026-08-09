'use client';

import type { CreativeTemplate, TemplateFieldValues } from '@/features/creative-studio/types';
import { AssetSelector } from './asset-selector';

export function TemplateFieldEditor({ template, values, onChange }: { template: CreativeTemplate; values: TemplateFieldValues; onChange: (fieldId: string, value: string) => void }) {
  return <section className="rounded-2xl border border-slate-700 bg-slate-900/35 p-5"><div><p className="text-xs tracking-[.16em] text-blue-200">TEMPLATE EDITOR</p><h2 className="mt-1 text-xl font-semibold">可編輯欄位</h2><p className="mt-2 text-xs leading-5 text-slate-400">所有欄位僅在目前瀏覽器工作階段使用，資料來源為 Mock Data。</p></div><div className="mt-5 space-y-5">{[...template.fields].sort((a, b) => a.order - b.order).map((field) => <label key={field.id} className="block"><span className="text-sm font-medium text-slate-200">{field.label}</span>{field.type === 'text' ? <textarea value={values[field.id] ?? ''} onChange={(event) => onChange(field.id, event.target.value)} placeholder={field.placeholder} rows={field.id === 'features' ? 3 : 2} className="mt-2 w-full resize-y rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm leading-6 text-slate-100 outline-none placeholder:text-slate-600 focus:border-blue-300"/> : <AssetSelector field={field} value={values[field.id] ?? ''} onChange={(value) => onChange(field.id, value)}/>}</label>)}</div></section>;
}
