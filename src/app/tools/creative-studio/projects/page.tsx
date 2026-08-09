'use client';

import { useEffect, useMemo, useState } from 'react';
import { FolderKanban } from 'lucide-react';
import { ProjectCard } from '@/components/creative-studio/project-dashboard/project-card';
import { ProjectEmptyState } from '@/components/creative-studio/project-dashboard/project-empty-state';
import { ProjectSearch } from '@/components/creative-studio/project-dashboard/project-search';
import { searchAndSortProjects, type ProjectSort } from '@/components/creative-studio/project-dashboard/project-query';
import { ProjectStatusFilter, type ProjectStatusFilter as Filter } from '@/components/creative-studio/project-dashboard/project-status-filter';
import { listProjects } from '@/features/creative-studio/project-storage';
import { getCreativeTemplate } from '@/features/creative-studio/template-engine';
import { mockProperties } from '@/features/property-intelligence/mock-properties';

export default function CreativeProjectsPage() {
  const [filter, setFilter] = useState<Filter>('ALL');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<ProjectSort>('UPDATED');
  const [projects, setProjects] = useState<ReturnType<typeof listProjects>>([]);
  useEffect(() => setProjects(listProjects()), []);
  const items = useMemo(() => searchAndSortProjects(
    projects.filter((project) => filter === 'ALL' || project.status === filter).map((project) => ({
      project,
      propertyName: mockProperties.find((property) => property.id === project.propertyId)?.title ?? 'Mock Property',
      templateName: getCreativeTemplate(project.templateId).name,
    })), query, sort), [filter, projects, query, sort]);
  return <div className="mx-auto max-w-7xl pb-10"><section className="rounded-3xl border border-blue-300/20 bg-[radial-gradient(circle_at_85%_15%,rgba(126,167,255,.25),transparent_24%),linear-gradient(135deg,#071321,#102b4b)] p-6 sm:p-10"><div className="flex items-center gap-3"><FolderKanban className="text-amber-100" size={24} /><span className="text-xs tracking-[.16em] text-blue-100">CREATIVE WORKSPACE · LOCAL PROJECTS</span></div><h1 className="mt-4 text-3xl font-semibold sm:text-5xl">Creative Project Dashboard</h1><p className="mt-3 max-w-3xl leading-7 text-slate-300">依專案狀態、專案名稱、案件或模板快速找回目前瀏覽器中的示範專案；所有資料只保存在 localStorage。</p></section><div className="mt-7 grid gap-4 lg:grid-cols-[1fr_auto]"><ProjectSearch query={query} sort={sort} onQueryChange={setQuery} onSortChange={setSort} /><ProjectStatusFilter value={filter} onChange={setFilter} /></div><section className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{items.map(({ project, propertyName, templateName }) => <ProjectCard key={project.id} project={project} propertyName={propertyName} templateName={templateName} />)}</section>{!items.length && <div className="mt-6"><ProjectEmptyState /></div>}</div>;
}
