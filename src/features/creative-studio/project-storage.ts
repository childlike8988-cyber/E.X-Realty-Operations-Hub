import type { CreativeProject } from './types';

const PROJECT_STORAGE_KEY = 'ex-realty-creative-projects-v1';
const memoryProjects = new Map<string, CreativeProject>();

function getBrowserStorage() {
  return typeof window === 'undefined' ? null : window.localStorage;
}

function readProjects(): CreativeProject[] {
  const storage = getBrowserStorage();
  if (!storage) return Array.from(memoryProjects.values());
  try {
    const raw = storage.getItem(PROJECT_STORAGE_KEY);
    return raw ? JSON.parse(raw) as CreativeProject[] : [];
  } catch {
    return [];
  }
}

function writeProjects(projects: CreativeProject[]) {
  const storage = getBrowserStorage();
  if (!storage) {
    memoryProjects.clear();
    projects.forEach((project) => memoryProjects.set(project.id, project));
    return;
  }
  storage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(projects));
}

export function saveProject(project: CreativeProject) {
  const projects = readProjects();
  const existing = projects.find((item) => item.id === project.id);
  const saved: CreativeProject = { ...project, createdAt: existing?.createdAt ?? project.createdAt ?? new Date().toISOString(), updatedAt: new Date().toISOString() };
  const next = [saved, ...projects.filter((item) => item.id !== project.id)].slice(0, 30);
  writeProjects(next);
  return saved;
}

export function loadProject(projectId: string) {
  return readProjects().find((project) => project.id === projectId) ?? null;
}

export function deleteProject(projectId: string) {
  const projects = readProjects();
  const exists = projects.some((project) => project.id === projectId);
  writeProjects(projects.filter((project) => project.id !== projectId));
  return exists;
}

export function listProjects() {
  return readProjects();
}
