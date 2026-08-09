import { describe, expect, it } from 'vitest';
import { futureAiCapabilities } from '@/components/demo/ai-future-preview';
import { demoCases, demoSteps, getDemoCase, moveDemoStep } from '@/features/demo/demo-flow';

describe('Demo Experience v0.9', () => {
  it('exposes the three fixed Mock demo cases', () => {
    expect(demoCases).toHaveLength(3);
    expect(demoCases.map((item) => item.caseId)).toEqual(['gushan-art-district', 'zuoying-hsr-district', 'fengshan-metro-district']);
    expect(getDemoCase('gushan-art-district')?.propertyId).toBe('property-gushan-3br');
  });

  it('defines the ordered seven-step customer presentation flow', () => {
    expect(demoSteps).toHaveLength(7);
    expect(demoSteps.map((item) => item.order)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(demoSteps.every((item) => item.route.startsWith('/tools/'))).toBe(true);
  });

  it('keeps presentation navigation within the flow boundaries', () => {
    expect(moveDemoStep(0, 'previous')).toBe(0);
    expect(moveDemoStep(0, 'next')).toBe(1);
    expect(moveDemoStep(6, 'next')).toBe(6);
  });

  it('labels all future AI capabilities as placeholders without enabling services', () => {
    expect(futureAiCapabilities).toEqual(['AI Image Generation', 'AI Video Creation', 'AI Market Insight', 'AI Sales Assistant']);
  });
});
