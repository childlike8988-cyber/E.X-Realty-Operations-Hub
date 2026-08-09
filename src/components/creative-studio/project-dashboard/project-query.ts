import type { CreativeProject } from '@/features/creative-studio/types';

export type ProjectSort = 'UPDATED' | 'CREATED' | 'EXPORTED';
export type ProjectDashboardItem = { project: CreativeProject; propertyName: string; templateName: string; };

const timeValue = (value?: string) => value ? new Date(value).getTime() : 0;

export function searchAndSortProjects(items: ProjectDashboardItem[], query: string, sort: ProjectSort) {
  const keyword = query.trim().toLocaleLowerCase();
  const filtered = keyword ? items.filter(({ project, propertyName, templateName }) => [project.name, propertyName, templateName].some((value) => value.toLocaleLowerCase().includes(keyword))) : items;
  const key = sort === 'CREATED' ? 'createdAt' : sort === 'EXPORTED' ? 'exportedAt' : 'updatedAt';
  return [...filtered].sort((left, right) => timeValue(right.project[key]) - timeValue(left.project[key]));
}
