import type { CreativeExportRecord } from './types';

const EXPORT_STORAGE_KEY = 'ex-realty-creative-export-history-v1';
let memoryExports: CreativeExportRecord[] = [];

function readExportHistory(): CreativeExportRecord[] {
  if (typeof window === 'undefined') return memoryExports;
  try { const raw = window.localStorage.getItem(EXPORT_STORAGE_KEY); return raw ? JSON.parse(raw) as CreativeExportRecord[] : []; } catch { return []; }
}

function writeExportHistory(records: CreativeExportRecord[]) {
  if (typeof window === 'undefined') { memoryExports = records; return; }
  window.localStorage.setItem(EXPORT_STORAGE_KEY, JSON.stringify(records));
}

export function recordExport(record: Omit<CreativeExportRecord, 'time'> & { time?: string }) {
  const item: CreativeExportRecord = { ...record, time: record.time ?? new Date().toISOString() };
  writeExportHistory([item, ...readExportHistory()].slice(0, 100));
  return item;
}

export function listExportHistory() {
  return readExportHistory();
}
