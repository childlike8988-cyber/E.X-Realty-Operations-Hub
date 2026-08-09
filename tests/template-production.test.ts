import { describe, expect, it } from 'vitest';
import { creativeAssets, getCreativeAsset } from '@/data/mock/creative-assets';
import { createCreativeContext } from '@/features/creative-studio/creative-context';
import { createCreativeProject } from '@/features/creative-studio/creative-project';
import { getCreativeExportFileName } from '@/features/creative-studio/export';
import { createTemplateFieldValues, creativeTemplates, updateTemplateFieldValue } from '@/features/creative-studio/template-engine';
import { adaptProposalContextToMarketingContext } from '@/features/property-intelligence/marketing-adapter';
import { mockProperties } from '@/features/property-intelligence/mock-properties';
import { adaptPropertyToProposalContext } from '@/features/property-intelligence/proposal-adapter';
import { generateMarketingContent } from '@/features/property-marketing/generate-marketing-content';

describe('Template Production Studio', () => {
  const marketing = adaptProposalContextToMarketingContext(adaptPropertyToProposalContext(mockProperties[0]));
  const context = createCreativeContext(marketing, generateMarketingContent(marketing));
  const template = creativeTemplates[0];

  it('provides a complete Template Schema with ordered text and image positions', () => {
    expect(template.fields.map((field) => field.id)).toEqual(expect.arrayContaining(['title', 'subtitle', 'price', 'address', 'layout', 'features', 'mainPhoto', 'floorPlan', 'logo', 'qrCode']));
    expect(template.layout.elements).toHaveLength(10);
    expect(template.layout.elements.every((element) => Number.isFinite(element.x) && Number.isFinite(element.y) && element.order > 0)).toBe(true);
  });

  it('updates a template field immutably for the live preview', () => {
    const values = createTemplateFieldValues(context, template);
    const updated = updateTemplateFieldValue(values, 'title', '自訂展示標題');
    expect(updated.title).toBe('自訂展示標題');
    expect(values.title).toBe(context.propertyName);
  });

  it('loads labelled Mock assets for property photo, logo, QR code, and floor plan', () => {
    expect(creativeAssets).toHaveLength(6);
    expect(getCreativeAsset('mock-house-gushan')).toMatchObject({ type: 'PROPERTY_PHOTO', source: 'MOCK' });
    expect(getCreativeAsset('mock-floor-plan')).toMatchObject({ type: 'FLOOR_PLAN', source: 'MOCK' });
    expect(getCreativeAsset('mock-logo')).toMatchObject({ type: 'LOGO', source: 'MOCK' });
    expect(getCreativeAsset('mock-qr-code')).toMatchObject({ type: 'QR_CODE', source: 'MOCK' });
  });

  it('creates complete PNG and PDF export file names', () => {
    const project = createCreativeProject({ propertyId: mockProperties[0].id, template, context, fieldValues: createTemplateFieldValues(context, template), status: 'READY' });
    expect(project.fieldValues).toEqual(expect.objectContaining({ title: context.propertyName, mainPhoto: expect.any(String), logo: expect.any(String), qrCode: expect.any(String) }));
    expect(project.assets).toHaveLength(4);
    expect(getCreativeExportFileName('鼓山美術館三房平車', 'Facebook Property Post', 'PNG')).toBe('鼓山美術館三房平車_Facebook-Property-Post.png');
    expect(getCreativeExportFileName('鼓山美術館三房平車', 'Facebook Property Post', 'PDF')).toBe('鼓山美術館三房平車_marketing.pdf');
  });
});
