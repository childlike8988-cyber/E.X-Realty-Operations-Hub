import type { CreativeProjectHistoryEntry } from './types';

const HISTORY_STORAGE_KEY = 'ex-realty-creative-project-history-v1';
let memoryHistory: CreativeProjectHistoryEntry[] = [];

function readHistory(): CreativeProjectHistoryEntry[] {
  if (typeof window === 'undefined') return memoryHistory;
  try { const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY); return raw ? JSON.parse(raw) as CreativeProjectHistoryEntry[] : []; } catch { return []; }
}

function writeHistory(entries: CreativeProjectHistoryEntry[]) {
  if (typeof window === 'undefined') { memoryHistory = entries; return; }
  window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(entries));
}

export function recordProjectHistory(entry: Omit<CreativeProjectHistoryEntry, 'timestamp'> & { timestamp?: string }) {
  const item: CreativeProjectHistoryEntry = { ...entry, timestamp: entry.timestamp ?? new Date().toISOString() };
  writeHistory([item, ...readHistory()].slice(0, 100));
  return item;
}

export function listProjectHistory(projectId?: string) {
  return readHistory().filter((entry) => !projectId || entry.projectId === projectId);
}
