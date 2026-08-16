import { PROPERTY_REPORT_SECTIONS } from './report-template';
import type { PropertyMarketReport, ReportSection } from './types';

export function buildReportSections(): ReportSection[] {
  return PROPERTY_REPORT_SECTIONS.map((section) => ({...section}));
}

export function buildReportId(propertyId: string): string {
  return `property-market-report-${propertyId}`;
}

export function isCompletePropertyMarketReport(report: PropertyMarketReport): boolean {
  return report.sections.length === 8
    && report.sourceLabels.includes('MOCK DATA')
    && report.sourceLabels.includes('Demo Generated Insight')
    && Boolean(report.property.id && report.brand.companyName && report.contact.phone);
}

