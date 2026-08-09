import { describe, expect, it } from 'vitest';
import { createCreativeContext } from '@/features/creative-studio/creative-context';
import { createCreativeProject } from '@/features/creative-studio/creative-project';
import { CREDIT_COSTS, getCreditCost } from '@/features/creative-studio/credits';
import { createImageGenerationRequest } from '@/features/creative-studio/image-generation';
import { creativeTemplates, getCreativeTemplate } from '@/features/creative-studio/template-engine';
import { adaptProposalContextToMarketingContext } from '@/features/property-intelligence/marketing-adapter';
import { mockProperties } from '@/features/property-intelligence/mock-properties';
import { adaptPropertyToProposalContext } from '@/features/property-intelligence/proposal-adapter';
import { generateMarketingContent } from '@/features/property-marketing/generate-marketing-content';

describe('Creative Workflow Foundation', () => {
  const property = mockProperties[0];
  const marketingContext = adaptProposalContextToMarketingContext(adaptPropertyToProposalContext(property));
  const marketingContent = generateMarketingContent(marketingContext);
  const creativeContext = createCreativeContext(marketingContext, marketingContent);
  const template = creativeTemplates[0];

  it('converts PropertyMarketingContext into a reusable CreativeContext', () => {
    expect(creativeContext).toMatchObject({
      propertyName: marketingContext.propertyName,
      targetAudience: marketingContext.targetAudience,
      source: 'MOCK',
    });
    expect(creativeContext.imagePromptDraft).toBeTruthy();
    expect(creativeContext.videoConceptDraft).toBeTruthy();
  });

  it('loads the five fixed property social templates', () => {
    expect(creativeTemplates).toHaveLength(5);
    expect(getCreativeTemplate('instagram-story')).toMatchObject({ aspectRatio: '9:16' });
  });

  it('creates a typed creative project from selected property and template', () => {
    const project = createCreativeProject({ propertyId: property.id, template, context: creativeContext, status: 'EDITING' });
    expect(project).toMatchObject({ propertyId: property.id, templateId: template.id, format: '16:9', status: 'EDITING', source: 'MOCK' });
  });

  it('creates a local-only image generation request with the selected format', () => {
    const request = createImageGenerationRequest(creativeContext, template);
    expect(request).toEqual(expect.objectContaining({
      prompt: creativeContext.imagePromptDraft,
      referenceImages: [],
      aspectRatio: template.aspectRatio,
      credits: 0,
    }));
  });

  it('keeps the reserved credit costs explicit and deterministic', () => {
    expect(CREDIT_COSTS).toEqual({ FREE_TEMPLATE: 0, AI_IMAGE_GENERATION: 10, IMAGE_EDIT: 5, ADVANCED_EDIT: 15 });
    expect(getCreditCost('AI_IMAGE_GENERATION')).toBe(10);
  });
});
