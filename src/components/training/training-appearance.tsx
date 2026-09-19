'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { TRAINING_APPEARANCE_KEY, parseTrainingAppearance, readTrainingAppearance, persistTrainingAppearance, trainingAppearanceBootstrap, type TrainingAppearance } from './training-appearance-store';
import styles from './training-visual.module.css';

const AppearanceContext = createContext<{ appearance: TrainingAppearance; select: (value: TrainingAppearance) => void } | null>(null);

export function TrainingAppearanceRoot({ children }: { children: ReactNode }) {
  const [appearance, setAppearance] = useState<TrainingAppearance>('system');
  useEffect(() => {
    try { setAppearance(readTrainingAppearance(window.localStorage)); } catch { /* storage can be disabled */ }
    const sync = (event: StorageEvent) => {
      if (event.key === TRAINING_APPEARANCE_KEY) setAppearance(parseTrainingAppearance(event.newValue));
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  function select(value: TrainingAppearance) {
    setAppearance(value);
    try { persistTrainingAppearance(window.localStorage, value); } catch { /* keep the in-memory preference */ }
  }
  return <AppearanceContext.Provider value={{ appearance, select }}>
    <div className={styles.root} data-training-appearance data-appearance={appearance} suppressHydrationWarning>
      <script dangerouslySetInnerHTML={{ __html: trainingAppearanceBootstrap }} />
      {children}
    </div>
  </AppearanceContext.Provider>;
}

export function TrainingAppearanceControl() {
  const context = useContext(AppearanceContext);
  if (!context) return null;
  const options = [
    { value: 'light', label: '淺色', english: 'Light', Icon: Sun },
    { value: 'dark', label: '深色', english: 'Dark', Icon: Moon },
    { value: 'system', label: '系統', english: 'System', Icon: Monitor },
  ] as const;
  return <div className={styles.appearance} role="group" aria-label="外觀">
    {options.map(({ value, label, english, Icon }) => <button key={value} type="button"
      aria-label={label + ' ' + english} title={label} aria-pressed={context.appearance === value}
      onClick={() => context.select(value)}><Icon size={16} aria-hidden="true" /><span>{label}</span></button>)}
  </div>;
}
