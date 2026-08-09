'use client';

import { useEffect, useMemo, useState } from 'react';

export type DemoTimerMode = 'FIVE' | 'TEN' | 'FULL';
export const demoTimerModes: Array<{ id: DemoTimerMode; label: string; seconds: number | null }> = [
  { id: 'FIVE', label: '5分鐘 Demo', seconds: 300 },
  { id: 'TEN', label: '10分鐘 Demo', seconds: 600 },
  { id: 'FULL', label: '完整 Demo', seconds: null },
];

export function formatDemoElapsed(totalSeconds: number) { const minutes = Math.floor(totalSeconds / 60); const seconds = totalSeconds % 60; return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`; }

export function DemoTimer() {
  const [mode, setMode] = useState<DemoTimerMode>('FIVE');
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(timer); }, []);
  const elapsed = Math.max(0, Math.floor((now - startedAt) / 1000));
  const selected = useMemo(() => demoTimerModes.find((item) => item.id === mode) ?? demoTimerModes[0], [mode]);
  const remaining = selected.seconds === null ? null : Math.max(0, selected.seconds - elapsed);
  return <div className="flex flex-wrap items-center gap-3"><select aria-label="Demo 計時模式" value={mode} onChange={(event) => { setMode(event.target.value as DemoTimerMode); setStartedAt(Date.now()); setNow(Date.now()); }} className="min-h-10 rounded-lg border border-slate-600 bg-slate-950 px-3 text-sm text-slate-100">{demoTimerModes.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select><div className="rounded-lg border border-blue-300/25 bg-blue-300/10 px-3 py-2 text-sm text-blue-100"><span className="text-xs text-slate-400">經過</span> {formatDemoElapsed(elapsed)}{remaining !== null && <span className="ml-2 text-xs text-amber-100">剩餘 {formatDemoElapsed(remaining)}</span>}</div></div>;
}
