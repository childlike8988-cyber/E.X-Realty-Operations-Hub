import { saveUserUploadAsset } from './asset-upload';
import { listExportHistory, recordExport } from './export-history';
import { listProjectHistory, recordProjectHistory } from './history';
import { saveProject } from './project-storage';
import { getCreativeTemplate } from './template-engine';
import type { AssetUploadResult, CreativeAsset, CreativeAssetLibraryItem, CreativeExportRecord, CreativeProject, CreativeProjectHistoryEntry, CreativeTemplate } from './types';
import { getCreativeLibraryAsset } from '@/data/mock/creative-assets/library';

export const PROJECT_BACKUP_VERSION = '1.0';
export type ProjectBackup = { version: typeof PROJECT_BACKUP_VERSION; createdAt: string; project: CreativeProject; template: CreativeTemplate; assets: CreativeAsset[]; history: CreativeProjectHistoryEntry[]; exportHistory: CreativeExportRecord[]; };

export function createProjectBackup(project: CreativeProject): ProjectBackup {
  return { version: PROJECT_BACKUP_VERSION, createdAt: new Date().toISOString(), project, template: getCreativeTemplate(project.templateId), assets: project.assets.map((assetId) => getCreativeLibraryAsset(assetId)).filter((asset): asset is CreativeAssetLibraryItem => Boolean(asset)), history: listProjectHistory(project.id), exportHistory: listExportHistory().filter((record) => record.projectId === project.id) };
}

export function serializeProjectBackup(project: CreativeProject) { return JSON.stringify(createProjectBackup(project), null, 2); }
export function getProjectBackupVersionWarning(version: unknown) { return version === PROJECT_BACKUP_VERSION ? null : `Backup version ${String(version ?? 'unknown')} is not supported. Expected ${PROJECT_BACKUP_VERSION}.`; }

export function parseProjectBackup(raw: string): ProjectBackup {
  const parsed = JSON.parse(raw) as Partial<ProjectBackup>;
  const versionWarning = getProjectBackupVersionWarning(parsed.version);
  if (versionWarning) throw new Error(versionWarning);
  if (!parsed.createdAt || !parsed.project || typeof parsed.project.id !== 'string' || typeof parsed.project.templateId !== 'string' || !parsed.template || !Array.isArray(parsed.assets) || !Array.isArray(parsed.history) || !Array.isArray(parsed.exportHistory)) throw new Error('Invalid Creative Project backup file.');
  return parsed as ProjectBackup;
}

export function restoreProjectBackup(backup: ProjectBackup) {
  const project = saveProject(backup.project);
  backup.assets.filter((asset) => asset.source === 'USER_UPLOAD').forEach((asset) => saveUserUploadAsset({ id: asset.id, name: asset.name, type: 'image/png', size: 0, previewUrl: asset.previewDataUrl, source: 'USER_UPLOAD' } satisfies AssetUploadResult));
  backup.history.forEach((entry) => recordProjectHistory(entry));
  backup.exportHistory.forEach((record) => recordExport(record));
  return project;
}

export function downloadProjectBackup(project: CreativeProject) {
  const link = document.createElement('a');
  const url = URL.createObjectURL(new Blob([serializeProjectBackup(project)], { type: 'application/json' }));
  link.href = url;
  link.download = 'creative-project-backup-v1.json';
  link.click();
  URL.revokeObjectURL(url);
}
