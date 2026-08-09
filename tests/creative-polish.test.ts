import { afterAll, describe, expect, it } from 'vitest';
import { listCreativeAssets } from '@/data/mock/creative-assets/library';
import { deleteUserUploadAsset, saveUserUploadAsset } from '@/features/creative-studio/asset-upload';
import { getBrandKit, mockBrandKit, saveBrandKit } from '@/features/creative-studio/brand-kit';
import { createCreativeContext } from '@/features/creative-studio/creative-context';
import { createCreativeProject } from '@/features/creative-studio/creative-project';
import { PROJECT_BACKUP_VERSION, createProjectBackup, getProjectBackupVersionWarning, parseProjectBackup, serializeProjectBackup } from '@/features/creative-studio/project-backup';
import { deleteProject, loadProject, saveProject } from '@/features/creative-studio/project-storage';
import { creativeTemplates } from '@/features/creative-studio/template-engine';
import { searchAndSortProjects } from '@/components/creative-studio/project-dashboard/project-query';
import { adaptProposalContextToMarketingContext } from '@/features/property-intelligence/marketing-adapter';
import { mockProperties } from '@/features/property-intelligence/mock-properties';
import { adaptPropertyToProposalContext } from '@/features/property-intelligence/proposal-adapter';
import { generateMarketingContent } from '@/features/property-marketing/generate-marketing-content';

const property = mockProperties[0];
const marketing = adaptProposalContextToMarketingContext(adaptPropertyToProposalContext(property));
const context = createCreativeContext(marketing, generateMarketingContent(marketing));
const project = {
  ...createCreativeProject({ propertyId: property.id, template: creativeTemplates[0], context, status: 'READY' }),
  id: 'creative-polish-test-project',
  name: 'Showcase Search Project',
  createdAt: '2026-08-09T00:00:00.000Z',
  updatedAt: '2026-08-09T01:00:00.000Z',
  exportedAt: '2026-08-09T02:00:00.000Z',
};
const uploadId = 'creative-polish-user-upload';

afterAll(() => {
  deleteProject(project.id);
  deleteUserUploadAsset(uploadId);
  saveBrandKit({ ...mockBrandKit });
});

describe('Creative Studio v0.8 polish', () => {
  it('searches project, property, and template names and sorts by requested time', () => {
    const items = [{ project, propertyName: property.title, templateName: creativeTemplates[0].name }];
    expect(searchAndSortProjects(items, 'showcase', 'UPDATED')).toHaveLength(1);
    expect(searchAndSortProjects(items, property.title.slice(0, 3), 'CREATED')).toHaveLength(1);
    expect(searchAndSortProjects(items, creativeTemplates[0].name.slice(0, 4), 'EXPORTED')[0].project.exportedAt).toBe(project.exportedAt);
    expect(searchAndSortProjects(items, 'no-match', 'UPDATED')).toHaveLength(0);
  });

  it('keeps user-upload assets distinct from mock assets and supports category filtering', () => {
    saveUserUploadAsset({ id: uploadId, name: 'User Logo', type: 'image/png', size: 12, previewUrl: 'data:image/svg+xml;base64,PHN2Zy8+', category: 'logo', source: 'USER_UPLOAD' });
    expect(listCreativeAssets('logo').some((asset) => asset.id === uploadId && asset.source === 'USER_UPLOAD')).toBe(true);
    expect(listCreativeAssets().some((asset) => asset.source === 'MOCK')).toBe(true);
    expect(deleteUserUploadAsset(uploadId)).toBe(true);
  });

  it('creates versioned backups and rejects incompatible versions', () => {
    saveProject(project);
    const backup = createProjectBackup(project);
    expect(backup).toMatchObject({ version: PROJECT_BACKUP_VERSION, project: { id: project.id } });
    expect(backup.createdAt).toBeTruthy();
    expect(parseProjectBackup(serializeProjectBackup(project)).version).toBe('1.0');
    expect(getProjectBackupVersionWarning('0.9')).toContain('not supported');
    expect(() => parseProjectBackup(JSON.stringify({ ...backup, version: '0.9' }))).toThrow('Backup version');
  });

  it('keeps project data available to the detail route through local storage', () => {
    saveProject(project);
    expect(loadProject(project.id)).toMatchObject({ id: project.id, templateId: creativeTemplates[0].id, exportedAt: project.exportedAt });
  });

  it('saves the Mock Brand Kit editor values locally', () => {
    const saved = saveBrandKit({ ...mockBrandKit, companyName: 'Demo Showcase Realty', branchName: 'Creative Demo Branch', agentName: 'Demo Consultant', phone: '0000-000-000' });
    expect(saved.companyName).toBe('Demo Showcase Realty');
    expect(getBrandKit()).toMatchObject({ companyName: 'Demo Showcase Realty', source: 'MOCK' });
  });
});
