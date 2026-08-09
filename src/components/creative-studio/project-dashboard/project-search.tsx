import { Search } from 'lucide-react';
import type { ProjectSort } from './project-query';

export function ProjectSearch({ query, sort, onQueryChange, onSortChange }: { query: string; sort: ProjectSort; onQueryChange: (value: string) => void; onSortChange: (value: ProjectSort) => void }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <label className="relative min-w-0 flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={17} /><input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="搜尋專案、案件或模板名稱" className="min-h-11 w-full rounded-lg border border-slate-700 bg-slate-950 py-2 pl-10 pr-3 text-sm text-slate-100 placeholder:text-slate-600" /></label>
      <select value={sort} onChange={(event) => onSortChange(event.target.value as ProjectSort)} className="min-h-11 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-slate-200"><option value="UPDATED">最近修改</option><option value="CREATED">建立時間</option><option value="EXPORTED">匯出時間</option></select>
    </div>
  );
}
