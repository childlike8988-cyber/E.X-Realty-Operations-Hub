'use client';

import { Bell, Menu, Search, UserRound } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Sidebar } from './sidebar';
import { ThemeSwitch } from '@/components/theme/theme-switch';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isFullscreenPresentation = /^\/demo\/[^/]+\/present\/?$/.test(pathname) || /^\/tools\/property-report\/present\/?$/.test(pathname);
  if (isFullscreenPresentation) return <>{children}</>;
  return <div className="app-shell min-h-screen"><Sidebar mobileOpen={open} onClose={() => setOpen(false)} /><div className="app-shell-main md:pl-72"><header className="app-header sticky top-0 z-20 flex h-16 items-center gap-3 px-4"><button aria-label="開啟導覽" className="app-menu-button md:hidden" onClick={() => setOpen(true)}><Menu /></button><div className="app-search flex flex-1 items-center gap-2 rounded-xl px-3 py-2 text-sm"><Search size={17} /><span>搜尋模組、案件或工具</span></div><ThemeSwitch /><Bell size={18} className="app-header-icon hidden sm:block" /><div className="app-user flex items-center gap-2 text-sm"><UserRound size={18} /><span className="hidden sm:inline">開發預覽 · 行政角色</span></div></header><main className="app-main content-pad p-4 md:p-8">{children}</main></div></div>;
}
