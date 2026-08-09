import { describe, expect, it } from 'vitest';
import { creativeAssetLibrary, listCreativeAssets } from '@/data/mock/creative-assets/library';
import { createCreativeContext } from '@/features/creative-studio/creative-context';
import { createCreativeProject } from '@/features/creative-studio/creative-project';
import { listExportHistory, recordExport } from '@/features/creative-studio/export-history';
import { listProjectHistory, recordProjectHistory } from '@/features/creative-studio/history';
import { deleteProject, listProjects, loadProject, saveProject } from '@/features/creative-studio/project-storage';
import { creativeTemplates } from '@/features/creative-studio/template-engine';
import { listFavoriteTemplates, listRecentTemplates, recordRecentTemplate, toggleFavoriteTemplate } from '@/features/creative-studio/template-preferences';
import { adaptProposalContextToMarketingContext } from '@/features/property-intelligence/marketing-adapter';
import { mockProperties } from '@/features/property-intelligence/mock-properties';
import { adaptPropertyToProposalContext } from '@/features/property-intelligence/proposal-adapter';
import { generateMarketingContent } from '@/features/property-marketing/generate-marketing-content';

describe('Creative Asset Management Foundation', () => {
  const property = mockProperties[1];
  const marketing = adaptProposalContextToMarketingContext(adaptPropertyToProposalContext(property));
  const context = createCreativeContext(marketing, generateMarketingContent(marketing));
  const project = { ...createCreativeProject({ propertyId: property.id, template: creativeTemplates[1], context, status: 'EDITING' }), id: 'creative-management-test-project' };

  it('saves, loads, lists, and deletes a Creative Project locally', () => {
    saveProject(project);
    expect(loadProject(project.id)).toMatchObject({ id: project.id, status: 'EDITING' });
    expect(listProjects().some((item) => item.id === project.id)).toBe(true);
    expect(deleteProject(project.id)).toBe(true);
    expect(loadProject(project.id)).toBeNull();
  });

  it('records typed project history entries', () => {
    const entry = recordProjectHistory({ projectId: project.id, action: 'SAVED', description: 'Test local project save', timestamp: '2026-08-09T00:00:00.000Z' });
    expect(entry).toMatchObject({ projectId: project.id, action: 'SAVED' });
    expect(listProjectHistory(project.id)).toContainEqual(entry);
  });

  it('exposes all six labelled Mock asset-library categories', () => {
    expect(creativeAssetLibrary.every((asset) => asset.source === 'MOCK')).toBe(true);
    expect(new Set(creativeAssetLibrary.map((asset) => asset.category))).toEqual(new Set(['logo', 'agent', 'property', 'floorplan', 'background', 'icon']));
    expect(listCreativeAssets('property').length).toBeGreaterThan(0);
  });

  it('manages favorite and recent templates locally', () => {
    const templateId = creativeTemplates[2].id;
    if (listFavoriteTemplates().includes(templateId)) toggleFavoriteTemplate(templateId);
    expect(toggleFavoriteTemplate(templateId)).toContain(templateId);
    expect(recordRecentTemplate(templateId)[0]).toBe(templateId);
    expect(listRecentTemplates()[0]).toBe(templateId);
  });

  it('records export metadata without storing exported files', () => {
    const record = recordExport({ filename: 'demo_marketing.pdf', format: 'PDF', template: creativeTemplates[1].name, projectId: project.id, time: '2026-08-09T00:01:00.000Z' });
    expect(record).toMatchObject({ filename: 'demo_marketing.pdf', format: 'PDF', projectId: project.id });
    expect(listExportHistory()).toContainEqual(record);
  });
});
