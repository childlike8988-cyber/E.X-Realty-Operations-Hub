import { describe, expect, it } from 'vitest';
import { realPriceStorySteps, realPriceToolEntries, realPriceValuePillars } from '@/features/real-price/showcase-content';
import { realtyDemoCases } from '@/data/mock/real-price/demo-cases/demo-cases';

describe('Real Price Explorer public landing', () => {
  it('keeps the six-stage product story in the intended order', () => {
    expect(realPriceStorySteps).toEqual(['成交資料', '社區行情', '市場比較', '區域地圖分析', '生活圈智慧分析', '市場提案']);
  });

  it('exposes every core capability through a non-empty unique route', () => {
    expect(realPriceToolEntries).toHaveLength(7);
    expect(realPriceToolEntries.every((entry) => entry.title && entry.description && entry.route)).toBe(true);
    expect(new Set(realPriceToolEntries.map((entry) => entry.route)).size).toBe(realPriceToolEntries.length);
  });

  it('keeps three data-to-proposal product pillars and three linked demo cases', () => {
    expect(realPriceValuePillars.map((pillar) => pillar.title)).toEqual(['Data Intelligence', 'Market Analysis', 'Sales Proposal']);
    expect(realtyDemoCases).toHaveLength(3);
    expect(realtyDemoCases.every((item) => item.caseId && item.targetAudience && item.recommendedScenario)).toBe(true);
  });
});
