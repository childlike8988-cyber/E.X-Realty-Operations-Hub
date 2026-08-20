export const APP_THEME_STORAGE_KEY = 'ex-realty-app-theme';

export const appThemes = ['midnight', 'rose-ivory'] as const;
export type AppTheme = (typeof appThemes)[number];

export const appThemeLabels: Record<AppTheme, { zh: string; en: string }> = {
  midnight: { zh: '深色', en: 'Midnight Blue' },
  'rose-ivory': { zh: '亮色', en: 'Rose Ivory' },
};

export function isAppTheme(value: string | null | undefined): value is AppTheme {
  return value === 'midnight' || value === 'rose-ivory';
}

export function readStoredAppTheme(storage: Pick<Storage, 'getItem'> | undefined): AppTheme {
  if (!storage) return 'midnight';
  const stored = storage.getItem(APP_THEME_STORAGE_KEY);
  return isAppTheme(stored) ? stored : 'midnight';
}
