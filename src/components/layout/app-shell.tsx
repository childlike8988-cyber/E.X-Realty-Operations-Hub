'use client';

import { Bell, Menu, Search, UserRound } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Sidebar } from './sidebar';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isFullscreenPresentation = /^\/demo\/[^/]+\/present\/?$/.test(pathname) || /^\/tools\/property-report\/present\/?$/.test(pathname);
  if (isFullscreenPresentation) return <>{children}</>;
  return <div className="min-h-screen"><Sidebar mobileOpen={open} onClose={() => setOpen(false)} /><div className="md:pl-72"><header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-700/60 bg-[#071526]/85 px-4 backdrop-blur"><button aria-label="開啟導覽" className="md:hidden" onClick={() => setOpen(true)}><Menu /></button><div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm text-slate-400"><Search size={17} /><span>搜尋模組、案件或工具</span></div><Bell size={18} className="text-slate-300" /><div className="flex items-center gap-2 text-sm text-slate-300"><UserRound size={18} /><span className="hidden sm:inline">開發預覽 · 行政角色</span></div></header><main className="content-pad p-4 md:p-8">{children}</main></div></div>;
}
