import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { runInNewContext } from 'node:vm';
import { readFileSync } from 'node:fs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { parseTrainingAppearance, readTrainingAppearance, persistTrainingAppearance, resolveTrainingAppearance, trainingAppearanceBootstrap, TRAINING_APPEARANCE_KEY } from '@/components/training/training-appearance-store';
import { TrainingAppearanceRoot, TrainingAppearanceControl } from '@/components/training/training-appearance';
import { TrainingScenarioExperience } from '@/components/training/training-scenario-experience';
import { InMemoryTrainingRepository } from '@/features/training/repository';
import { TrainingSessionApplicationService } from '@/features/training/session-service';

afterEach(() => vi.unstubAllGlobals());
function memoryStorage() {
  const values = new Map<string, string>([['unrelated-hub-theme', 'midnight']]);
  return { values, getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); } };
}
function markup() {
  vi.stubGlobal('React', React);
  return renderToStaticMarkup(React.createElement(TrainingAppearanceRoot, null,
    React.createElement(TrainingAppearanceControl), React.createElement(TrainingScenarioExperience)));
}
describe('Stage 5B Training appearance and presentation', () => {
  it('defaults to system and rejects corrupt or unsupported preferences', () => {
    for (const value of [null, undefined, '', 'midnight', '<script>', 42]) expect(parseTrainingAppearance(value)).toBe('system');
    expect(readTrainingAppearance(memoryStorage())).toBe('system');
  });
  it('resolves explicit light and dark independently of the OS', () => {
    expect(resolveTrainingAppearance('light', true)).toBe('light');
    expect(resolveTrainingAppearance('dark', false)).toBe('dark');
  });
  it('system follows both OS modes', () => {
    expect(resolveTrainingAppearance('system', false)).toBe('light');
    expect(resolveTrainingAppearance('system', true)).toBe('dark');
  });
  it('persists only the Training appearance key and restores all three choices', () => {
    const storage = memoryStorage();
    for (const value of ['light', 'dark', 'system'] as const) {
      expect(persistTrainingAppearance(storage, value)).toBe(true);
      expect(readTrainingAppearance(storage)).toBe(value);
    }
    expect(storage.values.get('unrelated-hub-theme')).toBe('midnight');
    expect(storage.values.size).toBe(2);
  });
  it('survives blocked storage without fabricating persistence', () => {
    const blocked = { getItem: () => { throw new Error('blocked'); }, setItem: () => { throw new Error('blocked'); } };
    expect(readTrainingAppearance(blocked)).toBe('system');
    expect(persistTrainingAppearance(blocked, 'dark')).toBe(false);
  });
  it('prepaint bootstrap only applies a valid local appearance', () => {
    for (const value of ['light', 'dark', 'system', '<script>', null]) {
      const element = { dataset: {} as Record<string, string> };
      runInNewContext(trainingAppearanceBootstrap, { document: { currentScript: { parentElement: element } }, localStorage: { getItem: (key: string) => key === TRAINING_APPEARANCE_KEY ? value : null } });
      expect(element.dataset.appearance).toBe(parseTrainingAppearance(value));
    }
  });
  it('bootstrap survives denied browser storage', () => {
    expect(() => runInNewContext(trainingAppearanceBootstrap, { document: { currentScript: { parentElement: { dataset: {} } } }, localStorage: { getItem: () => { throw new Error('blocked'); } } })).not.toThrow();
  });
  it('appearance updates do not mutate canonical session events or NPC state', () => {
    const sessions = new TrainingSessionApplicationService({ scenarioRepository: new InMemoryTrainingRepository() });
    const session = sessions.startSession({ scenarioId: 'S01', scenarioVersionId: 'S01-v1', organizationId: 'mock-org', agentRef: 'mock-agent', sessionId: 'theme-isolation' });
    const before = JSON.stringify(sessions.getSessionView(session.sessionId));
    const storage = memoryStorage();
    for (const value of ['dark', 'light', 'system'] as const) persistTrainingAppearance(storage, value);
    expect(JSON.stringify(sessions.getSessionView(session.sessionId))).toBe(before);
  });
  it('renders five uniquely labelled scenario buttons and an accessible system-default control', () => {
    const html = markup();
    for (const id of ['S01','S02','S03','S04','S05']) expect(html).toMatch(new RegExp('aria-label="' + id + ' [^"]+ 查看情境"'));
    expect((html.match(/查看情境"/g) ?? []).length).toBe(5);
    expect(html).toContain('aria-label="系統 System"');
    expect(html).toContain('aria-pressed="true"');
    expect(html).toContain('Mock 模擬練習');
  });
  it('home does not render hidden rules, negotiation secrets or system data', () => {
    const html = markup();
    expect(html).not.toMatch(/SYSTEM_ONLY|negotiationBoundary|hiddenInformation|riskRules|monthly-payment-anxiety/);
  });
  it('supports explicit focus and reduced motion/transparency fallbacks', () => {
    const css = readFileSync('src/components/training/training-visual.module.css', 'utf8');
    expect(css).toContain(':focus-visible');
    expect(css).toContain('prefers-reduced-motion:reduce');
    expect(css).toContain('prefers-reduced-transparency:reduce');
    expect(css).toContain('backdrop-filter:none');
    expect(css).not.toContain('docs/design-reference');
  });
});
