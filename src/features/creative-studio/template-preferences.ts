const FAVORITES_KEY = 'ex-realty-creative-template-favorites-v1';
const RECENT_KEY = 'ex-realty-creative-template-recents-v1';
let memoryFavorites: string[] = [];
let memoryRecents: string[] = [];

function read(key: string, fallback: string[]) {
  if (typeof window === 'undefined') return fallback;
  try { const raw = window.localStorage.getItem(key); return raw ? JSON.parse(raw) as string[] : []; } catch { return []; }
}

function write(key: string, value: string[], memory: 'favorites' | 'recents') {
  if (typeof window === 'undefined') { if (memory === 'favorites') memoryFavorites = value; else memoryRecents = value; return; }
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function listFavoriteTemplates() { return read(FAVORITES_KEY, memoryFavorites); }
export function listRecentTemplates() { return read(RECENT_KEY, memoryRecents); }
export function toggleFavoriteTemplate(templateId: string) {
  const favorites = listFavoriteTemplates();
  const next = favorites.includes(templateId) ? favorites.filter((id) => id !== templateId) : [templateId, ...favorites];
  write(FAVORITES_KEY, next, 'favorites');
  return next;
}
export function recordRecentTemplate(templateId: string) {
  const next = [templateId, ...listRecentTemplates().filter((id) => id !== templateId)].slice(0, 5);
  write(RECENT_KEY, next, 'recents');
  return next;
}
