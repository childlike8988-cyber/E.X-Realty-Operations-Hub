import { describe, expect, it } from 'vitest';
import { navigation } from '@/config/navigation';
import { appThemeLabels, readStoredAppTheme } from '@/lib/theme';
import { readFileSync } from 'node:fs';

describe('v1.3.3 UI language and visual system', () => {
  it('keeps Midnight Blue as the safe default and exposes bilingual theme labels', () => {
    expect(readStoredAppTheme(undefined)).toBe('midnight');
    expect(readStoredAppTheme({ getItem: () => 'unknown' })).toBe('midnight');
    expect(appThemeLabels.midnight).toEqual({ zh: '深色', en: 'Midnight Blue' });
    expect(appThemeLabels['rose-ivory']).toEqual({ zh: '亮色', en: 'Rose Ivory' });
  });

  it('keeps primary navigation bilingual and the report entry discoverable', () => {
    expect(navigation.every((item) => item.title && item.subtitle)).toBe(true);
    expect(navigation.find((item) => item.id === 'property-report')).toMatchObject({ title: '房產市場智慧報告', subtitle: 'Property Market Report', route: '/tools/property-report' });
    expect(navigation.find((item) => item.id === 'property-intelligence')).toMatchObject({ title: '物件智慧分析', subtitle: 'Property Intelligence' });
    expect(navigation.find((item) => item.id === 'creative-studio')).toMatchObject({ title: '創意設計中心', subtitle: 'Creative Studio' });
  });

  it('keeps the Client Report theme scoped away from App Theme overrides', () => {
    const styles = readFileSync('src/app/globals.css', 'utf8');
    expect(styles).toContain('.property-report-shell');
    expect(styles).toContain('.property-report-presentation');
    expect(styles).not.toContain("[data-theme='rose-ivory'] .property-report");
  });

  it('keeps navigation scrollable in the shared AppShell structure', () => {
    const sidebar = readFileSync('src/components/layout/sidebar.tsx', 'utf8');
    const styles = readFileSync('src/app/globals.css', 'utf8');
    expect(sidebar).toContain('sidebar-nav');
    expect(styles).toContain('.sidebar-nav{min-height:0;flex:1;overflow-y:auto');
  });

  it('keeps circuit visibility tokenized separately from the hairline texture', () => {
    const styles = readFileSync('src/app/globals.css', 'utf8');
    expect(styles).toContain('--circuit-pattern:url(');
    expect(styles).toContain("[data-theme='rose-ivory']{--bg-base");
    expect(styles).toContain("stroke='rgb(134 177 218)'");
    expect(styles).toContain("stroke='rgb(151 124 114)'");
    expect(styles).toContain('--hairline-opacity:.1');
  });

  it('does not let the fallback module page overwrite concrete Static Export routes', () => {
    const fallback = readFileSync('src/app/[...slug]/page.tsx', 'utf8');
    expect(fallback).toContain("'/tools/property-report'");
    expect(fallback).toContain('navigation.filter');
  });
});
