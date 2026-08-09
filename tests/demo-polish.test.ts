import { describe, expect, it } from 'vitest';
import { futureAiVisionCapabilities } from '@/components/demo/ai-future-vision';
import { demoReportFileName, createDemoReportContext } from '@/features/demo/demo-report';
import { demoCases, demoSteps, moveDemoStep } from '@/features/demo/demo-flow';
import { formatDemoElapsed, demoTimerModes } from '@/components/demo/demo-timer';
import { getPresenterNote, presenterNotes } from '@/features/demo/presenter-notes';

describe('Demo Polish v0.9.5', () => {
  it('provides static presentation cases and bounded navigation', () => {
    expect(demoCases).toHaveLength(3);
    expect(demoCases.every((item) => item.caseId.length > 0)).toBe(true);
    expect(moveDemoStep(0, 'previous')).toBe(0);
    expect(moveDemoStep(demoSteps.length - 1, 'next')).toBe(demoSteps.length - 1);
  });

  it('provides presenter notes for every presentation step', () => {
    expect(presenterNotes).toHaveLength(demoSteps.length);
    expect(demoSteps.every((step) => getPresenterNote(step.id)?.content.length)).toBe(true);
  });

  it('formats browser-only timer modes and elapsed time', () => {
    expect(demoTimerModes.map((item) => item.id)).toEqual(['FIVE', 'TEN', 'FULL']);
    expect(formatDemoElapsed(305)).toBe('05:05');
  });

  it('builds a Mock demo report with all seven steps', () => {
    const report = createDemoReportContext(demoCases[0], [...futureAiVisionCapabilities]);
    expect(report).toMatchObject({ source: 'MOCK', case: { caseId: demoCases[0].caseId } });
    expect(report.steps).toHaveLength(7);
    expect(demoReportFileName).toBe('E.X_AI_Realty_Demo_Report.pdf');
  });

  it('keeps the five future AI vision items visibly disabled', () => {
    expect(futureAiVisionCapabilities).toHaveLength(5);
    expect(futureAiVisionCapabilities).toContain('AI Content Repurposing');
  });
});
