import {describe,expect,it} from 'vitest';
import {adaptProposalContextToMarketingContext} from '@/features/property-intelligence/marketing-adapter';
import {mockProperties} from '@/features/property-intelligence/mock-properties';
import {adaptPropertyToProposalContext} from '@/features/property-intelligence/proposal-adapter';
import {createPropertyCreativeContext,generateMarketingContent} from '@/features/property-marketing/generate-marketing-content';

describe('Property Marketing Studio', () => {
  const marketingContext = adaptProposalContextToMarketingContext(adaptPropertyToProposalContext(mockProperties[0]));

  it('converts PropertyProposalContext into PropertyMarketingContext', () => {
    expect(marketingContext).toMatchObject({propertyName:'鼓山美術館三房平車',targetAudience:'家庭換屋族',source:'MOCK'});
    expect(marketingContext.sellingPoints.length).toBeGreaterThan(0);
    expect(marketingContext.keywords).toContain('Mock Data');
  });

  it('generates content for all three Mock Property Cases', () => {
    expect(mockProperties.map((property) => generateMarketingContent(adaptProposalContextToMarketingContext(adaptPropertyToProposalContext(property))).listing591.title)).toHaveLength(3);
  });

  it('provides 591, Facebook, Instagram, LINE, and TV Wall content', () => {
    const content = generateMarketingContent(marketingContext);
    expect([content.listing591,content.facebook,content.instagram,content.line,content.tvWall].every((item) => item.title && item.body && item.callToAction)).toBe(true);
  });

  it('provides a complete future creative context without generating media', () => {
    const creative = createPropertyCreativeContext(marketingContext);
    expect(creative).toMatchObject({propertyName:marketingContext.propertyName,source:'MOCK'});
    expect(creative.imagePrompt).toBeTruthy();
    expect(creative.visualStyle).toBeTruthy();
    expect(creative.sceneSuggestions.length).toBeGreaterThan(0);
    expect(creative.videoConcept).toBeTruthy();
  });
});
