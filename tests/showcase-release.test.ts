import { describe, expect, it } from 'vitest';
import { demoCases, demoSteps } from '@/features/demo/demo-flow';
import { mockBrandKit } from '@/features/creative-studio/brand-kit';

describe('v1.0 Showcase Release', () => {
  it('keeps three commercially positioned Mock demo cases', () => {
    expect(demoCases).toHaveLength(3);
    expect(demoCases.every((item) => item.coverStyle && item.description && item.suitableFor && item.salesScenario)).toBe(true);
  });

  it('keeps the complete product story flow ordered for the showcase', () => {
    expect(demoSteps).toHaveLength(7);
    expect(demoSteps.map((item) => item.title)).toEqual(['Property Overview', 'Market Analysis', 'Location Intelligence', 'Property Intelligence', 'Marketing Content', 'Creative Studio', 'Proposal Export']);
  });

  it('uses Mock-only brand information for public showcase rendering', () => {
    expect(mockBrandKit).toMatchObject({ source: 'MOCK', companyName: 'E.X Realty Data Tools' });
    expect(mockBrandKit.phone).toBe('0000-000-000');
  });
});
