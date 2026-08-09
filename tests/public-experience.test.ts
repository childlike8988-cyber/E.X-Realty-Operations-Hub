import { describe, expect, it } from 'vitest';
import { demoCompletionCapabilities, productTourSteps, workflowComparison } from '@/features/public-experience/tour-content';
import { caseGuideSteps, createCaseGuideQuery } from '@/features/real-price/case-guide';
import { realtyDemoCases } from '@/data/mock/real-price/demo-cases/demo-cases';

describe('v1.1 public experience', () => {
  it('keeps a six-step problem-to-solution product tour with destinations', () => {
    expect(productTourSteps).toHaveLength(6);
    expect(productTourSteps.map((step) => step.order)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(productTourSteps.every((step) => step.question && step.solution && step.route)).toBe(true);
  });

  it('keeps the traditional and AI Realty workflow comparison aligned', () => {
    expect(workflowComparison).toEqual([
      { traditional: '人工搜尋', aiWorkflow: '資料分析' },
      { traditional: '人工整理', aiWorkflow: '市場洞察' },
      { traditional: '人工製作', aiWorkflow: '自動提案' },
      { traditional: '人工排版', aiWorkflow: '快速產出' },
    ]);
  });

  it('maps every Mock demo case into a typed market query and a five-stage guide', () => {
    expect(caseGuideSteps.map((step) => step.id)).toEqual(['market', 'community', 'compare', 'location', 'proposal']);
    expect(realtyDemoCases.every((demoCase) => {
      const query = createCaseGuideQuery(demoCase);
      return query.city === '高雄市' && query.district === demoCase.district && query.community === demoCase.community;
    })).toBe(true);
  });

  it('keeps the public demo completion statement scoped to current showcase capabilities', () => {
    expect(demoCompletionCapabilities).toEqual(['Data Intelligence', 'Property Intelligence', 'Marketing Automation', 'Creative Production']);
  });
});
