'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { APP_THEME_STORAGE_KEY, type AppTheme, readStoredAppTheme } from '@/lib/theme';

type ThemeContextValue = { theme: AppTheme; setTheme: (theme: AppTheme) => void };

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<AppTheme>('midnight');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setTheme(readStoredAppTheme(window.localStorage));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(APP_THEME_STORAGE_KEY, theme);
  }, [hydrated, theme]);

  return <ThemeContext.Provider value={{ theme, setTheme }}><div className="app-theme-root" data-theme={theme}>{children}</div></ThemeContext.Provider>;
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useAppTheme must be used inside ThemeProvider');
  return context;
}
