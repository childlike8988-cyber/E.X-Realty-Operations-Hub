import type { CreativeProjectStatus } from '@/features/creative-studio/types';

export type ProjectStatusFilter = 'ALL' | CreativeProjectStatus;

export function ProjectStatusFilter({ value, onChange }: { value: ProjectStatusFilter; onChange: (value: ProjectStatusFilter) => void }) {
  const filters: ProjectStatusFilter[] = ['ALL', 'DRAFT', 'EDITING', 'READY', 'EXPORTED'];
  return <div className="flex flex-wrap gap-2">{filters.map((filter) => <button key={filter} type="button" onClick={() => onChange(filter)} className={`min-h-10 rounded-lg border px-3 py-2 text-sm ${value === filter ? 'border-amber-300 bg-amber-300/15 text-amber-100' : 'border-slate-700 text-slate-300'}`}>{filter === 'ALL' ? '全部' : filter}</button>)}</div>;
}
