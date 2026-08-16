import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { mockProperties } from '@/data/mock/property/property-data';
import { getAllDemoPropertyReports, getDemoPropertyReport } from '@/features/property-report/report-adapter';
import { getAssetInventoryStatus, resolveReportAssets } from '@/features/property-report/asset-resolver';
import { isCompletePropertyMarketReport } from '@/features/property-report/report-builder';

describe('Property Market Report v1.3', () => {
  it('resolves available case assets and reports their status', () => {
    const assets = resolveReportAssets('gushan-art-district');
    const status = getAssetInventoryStatus(assets);
    expect(assets.propertyImages.length).toBeGreaterThanOrEqual(2);
    expect(assets.map.status).toBe('AVAILABLE');
    expect(status.available).toBeGreaterThan(0);
  });

  it('falls back safely when a case asset is missing', () => {
    const assets = resolveReportAssets('unknown-demo-case');
    expect(assets.propertyImages[0].status).toBe('MISSING');
    expect(assets.propertyImages[0].id).toContain('fallback');
    expect(assets.floorplan.src).toContain('data:image/svg+xml');
    expect(assets.map.status).toBe('MISSING');
  });

  it('adapts existing property, market, map and location data without a second domain dataset', () => {
    const report = getDemoPropertyReport('gushan-art-district');
    expect(report.property.id).toBe('property-gushan-3br');
    expect(report.marketSummary.source).toBe('MOCK DATA');
    expect(report.mapSummary.region.id).toBe('gushan-art-district');
    expect(report.lifestyleSummary.score.overallScore).toBeGreaterThan(0);
    expect(report.propertyContext.property.id).toBe(report.property.id);
  });

  it('builds all three demo cases with eight fixed report sections', () => {
    const reports = getAllDemoPropertyReports();
    expect(reports).toHaveLength(3);
    reports.forEach((report) => {
      expect(report.sections).toHaveLength(8);
      expect(report.sections.map((section) => section.order)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
      expect(report.sourceLabels).toContain('MOCK DATA');
      expect(report.sourceLabels).toContain('Demo Generated Insight');
      expect(isCompletePropertyMarketReport(report)).toBe(true);
    });
    expect(reports.map((report) => report.property.id)).toEqual(mockProperties.map((property) => property.id));
  });

  it('keeps the presentation route static-export safe', () => {
    const route = path.join(process.cwd(), 'src/app/tools/property-report/present/page.tsx');
    const config = path.join(process.cwd(), 'next.config.ts');
    const styles = path.join(process.cwd(), 'src/app/globals.css');
    expect(existsSync(route)).toBe(true);
    expect(readFileSync(config, 'utf8')).toContain("output: 'export'");
    expect(readFileSync(styles, 'utf8')).toContain('@page{size:A4 portrait');
    expect(readFileSync(styles, 'utf8')).toContain('break-before:page!important');
  });

  it('keeps report presentation and print styles independent from the app dark theme', () => {
    const styles = readFileSync(path.join(process.cwd(), 'src/app/globals.css'), 'utf8');
    const reportPage = readFileSync(path.join(process.cwd(), 'src/components/property-report/property-report-page.tsx'), 'utf8');
    expect(styles).toContain('.report-surface-light');
    expect(styles).toContain('.report-text-on-dark');
    expect(styles).toContain('height:auto!important');
    expect(styles).toContain('overflow:visible!important');
    expect(styles).toContain('.property-report-cover-image img');
    expect(reportPage).toContain('report-surface-light');
  });

  it('gives every non-cover presentation section the same 16:9 stage and print-safe flow', () => {
    const styles = readFileSync(path.join(process.cwd(), 'src/app/globals.css'), 'utf8');
    const presentation = readFileSync(path.join(process.cwd(), 'src/components/property-report/property-report-presentation.tsx'), 'utf8');
    expect(styles).toContain('.property-report-presentation-main > .property-report-page:not(.property-report-cover)');
    expect(styles).toContain('.property-report-presentation{--report-navy:#12233b');
    expect(styles).toContain('.property-report-contact-page .property-report-page-inner{justify-content:flex-start!important}');
    expect(styles).not.toContain('.property-report-page{width:210mm;height:297mm');
    expect(presentation).toContain('const section = report.sections[pageIndex]');
    expect(presentation).toContain('<PropertyReportPage report={report} section={section} presentation />');
  });

  it('starts print output with Cover and uses page breaks only before later report sections', () => {
    const styles = readFileSync(path.join(process.cwd(), 'src/app/globals.css'), 'utf8');
    expect(styles).toContain('.property-report-pages > .property-report-page:first-child{break-before:auto!important;page-break-before:auto!important}');
    expect(styles).toContain('.property-report-pages > .property-report-page:not(:first-child){break-before:page!important;page-break-before:always!important}');
    expect(styles).toContain('.property-report-pages > .property-report-page:last-child{break-after:auto!important;page-break-after:auto!important}');
  });
});
