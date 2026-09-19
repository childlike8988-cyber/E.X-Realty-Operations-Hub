import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync, statSync } from 'node:fs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TrainingScenarioExperience } from '@/components/training/training-scenario-experience';

afterEach(() => vi.unstubAllGlobals());
describe('Approved Training Hero', () => {
  it('renders HTML title and working CTA separately from one decorative photo', () => {
    vi.stubGlobal('React', React);
    const html = renderToStaticMarkup(React.createElement(TrainingScenarioExperience));
    expect(html).toContain('id="training-home-heading"');
    expect(html).toContain('開始第一個練習');
    expect(html.match(/<picture/g)).toHaveLength(1);
    expect(html).toContain('hero-consultation-800.webp');
    expect(html).toContain('hero-consultation-1600.webp');
    expect(html).not.toContain('docs/design-reference');
    expect(html).not.toContain('hero-art-direction-reference');
  });
  it('ships bounded WebP derivatives, not oversized source PNG', () => {
    for (const size of [800, 1600]) {
      const path = `public/training/hero-consultation-${size}.webp`;
      expect(readFileSync(path).subarray(8, 12).toString()).toBe('WEBP');
      expect(statSync(path).size).toBeLessThan(size === 800 ? 80000 : 180000);
    }
    const script = readFileSync('scripts/prepare-training-hero.mjs', 'utf8');
    expect(script).toContain('withoutEnlargement: true');
    expect(script).toContain('hero-production-source-v1.png');
    expect(script).not.toContain('hero-art-direction-reference.png');
  });
  it('uses the same image across themes and static pointer-transparent tonal treatment', () => {
    const css = readFileSync('src/components/training/training-visual.module.css', 'utf8');
    expect(css).toContain('.heroPhoto::after');
    expect(css).toContain('--hero-tint:rgba(13,32,49,.24)');
    expect(css).toContain('object-position:100% 48%');
    expect(css).not.toMatch(/url\([^)]*hero/);
    const component = readFileSync('src/components/training/training-scenario-experience.tsx', 'utf8');
    expect(component).not.toMatch(/hero-consultation-dark/);
  });
});
