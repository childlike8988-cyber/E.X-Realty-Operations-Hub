import { afterAll, describe, expect, it } from 'vitest';
import { listCreativeAssets } from '@/data/mock/creative-assets/library';
import { getBrandKit } from '@/features/creative-studio/brand-kit';
import { createCreativeContext } from '@/features/creative-studio/creative-context';
import { createCreativeProject } from '@/features/creative-studio/creative-project';
import { parseProjectBackup, restoreProjectBackup, serializeProjectBackup } from '@/features/creative-studio/project-backup';
import { deleteProject, listProjects, saveProject } from '@/features/creative-studio/project-storage';
import { saveUserUploadAsset, deleteUserUploadAsset } from '@/features/creative-studio/asset-upload';
import { creativeTemplates } from '@/features/creative-studio/template-engine';
import { adaptProposalContextToMarketingContext } from '@/features/property-intelligence/marketing-adapter';
import { mockProperties } from '@/features/property-intelligence/mock-properties';
import { adaptPropertyToProposalContext } from '@/features/property-intelligence/proposal-adapter';
import { generateMarketingContent } from '@/features/property-marketing/generate-marketing-content';

describe('Creative Workspace', () => {
  const property = mockProperties[2];
  const marketing = adaptProposalContextToMarketingContext(adaptPropertyToProposalContext(property));
  const context = createCreativeContext(marketing, generateMarketingContent(marketing));
  const project = { ...createCreativeProject({ propertyId: property.id, template: creativeTemplates[4], context, status: 'READY' }), id: 'creative-workspace-test-project' };

  it('provides project data suitable for Dashboard status filtering', () => {
    saveProject(project);
    const saved = listProjects().find((item) => item.id === project.id);
    expect(saved).toMatchObject({ id: project.id, status: 'READY' });
    expect(saved?.updatedAt).toBeTruthy();
  });

  it('serializes, parses, and restores a browser-only Project Backup', () => {
    const parsed = parseProjectBackup(serializeProjectBackup(project));
    expect(parsed).toMatchObject({ project: { id: project.id }, template: { id: project.templateId } });
    expect(restoreProjectBackup(parsed)).toMatchObject({ id: project.id, status: 'READY' });
  });

  it('stores a user upload as a local-only asset-library item', () => {
    const upload = { id: 'user-asset-workspace-test', name: 'demo-upload.png', type: 'image/png', size: 120, previewUrl: 'data:image/png;base64,AAAA', source: 'USER_UPLOAD' as const };
    saveUserUploadAsset(upload);
    expect(listCreativeAssets('property')).toContainEqual(expect.objectContaining({ id: upload.id, source: 'USER_UPLOAD' }));
    expect(deleteUserUploadAsset(upload.id)).toBe(true);
  });

  it('provides five fixed Template Gallery entries', () => {
    expect(creativeTemplates.map((template) => template.name)).toEqual(['Facebook Property Post', 'Instagram Property Post', 'Instagram Story', 'TV Wall Banner', '591 Cover']);
  });

  it('provides a complete Mock Brand Kit without account data', () => {
    expect(getBrandKit()).toMatchObject({ companyName: 'E.X Realty Data Tools', logo: 'mock-logo', qrCode: 'mock-qr-code', source: 'MOCK' });
  });
});

afterAll(() => { deleteProject('creative-workspace-test-project'); });
