import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync('src/components/training/training-visual.module.css', 'utf8');
const material = css.slice(css.indexOf('/* Stage 7.2:'));
describe('Stage 7.2 material boundaries', () => {
  it('defines all five levels for light, dark and system without component theme copies', () => {
    for (const level of ['surface-base', 'surface-elevated', 'glass-light', 'glass-medium', 'surface-critical']) {
      expect(material.match(new RegExp(`--training-${level}:#|--training-${level}:rgba`, 'g'))).toHaveLength(3);
    }
    expect(material).not.toMatch(/data-appearance[^\n]*\.(primary|scenarioCard|managerDetail)/);
  });
  it('keeps reflections static and pointer transparent with no runtime reference images', () => {
    expect(material).toContain('pointer-events:none');
    expect(material).not.toMatch(/url\(|animation:|@keyframes/);
  });
  it('does not add blur to conversation or manager data surfaces', () => {
    for (const block of material.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      if (block[2].includes('backdrop-filter:blur')) expect(block[1]).toMatch(/app-header|contextSheet/);
    }
  });
  it('uses an opaque critical surface and solid reduced-transparency fallback', () => {
    expect(material).toContain('--training-risk-bg:var(--training-surface-critical)');
    expect(material).toContain('@media(prefers-reduced-transparency:reduce)');
    expect(material).toContain('--training-glass-medium:var(--training-surface-elevated)');
    expect(css).toContain('transition:none!important');
    expect(css).toContain('outline:3px solid var(--training-focus)');
  });
});
