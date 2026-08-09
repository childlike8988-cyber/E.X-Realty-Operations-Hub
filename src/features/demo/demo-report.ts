import { demoSteps, type DemoCase } from './demo-flow';

export type DemoReportContext = {
  title: string;
  case: DemoCase;
  steps: Array<{ title: string; description: string }>;
  futureAiCapabilities: string[];
  brandInformation: { companyName: string; platformName: string; source: 'MOCK' };
  generatedAt: string;
  source: 'MOCK';
};

export function createDemoReportContext(demoCase: DemoCase, futureAiCapabilities: string[]): DemoReportContext {
  return {
    title: 'E.X AI Realty Demo Report',
    case: demoCase,
    steps: demoSteps.map((step) => ({ title: step.title, description: step.description })),
    futureAiCapabilities,
    brandInformation: { companyName: 'E.X Realty', platformName: 'E.X Realty AI Operation Platform', source: 'MOCK' },
    generatedAt: new Date().toISOString(),
    source: 'MOCK',
  };
}

export const demoReportFileName = 'E.X_AI_Realty_Demo_Report.pdf';
