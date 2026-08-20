'use client';

import { Moon, Sun } from 'lucide-react';
import { appThemeLabels } from '@/lib/theme';
import { useAppTheme } from './theme-provider';

export function ThemeSwitch() {
  const { theme, setTheme } = useAppTheme();
  return <div className="theme-switch" role="group" aria-label="切換介面主題">
    <button type="button" className={theme === 'midnight' ? 'active' : ''} aria-pressed={theme === 'midnight'} onClick={() => setTheme('midnight')}>
      <Moon size={14} aria-hidden="true" /><span>{appThemeLabels.midnight.zh}<small>{appThemeLabels.midnight.en}</small></span>
    </button>
    <button type="button" className={theme === 'rose-ivory' ? 'active' : ''} aria-pressed={theme === 'rose-ivory'} onClick={() => setTheme('rose-ivory')}>
      <Sun size={14} aria-hidden="true" /><span>{appThemeLabels['rose-ivory'].zh}<small>{appThemeLabels['rose-ivory'].en}</small></span>
    </button>
  </div>;
}
