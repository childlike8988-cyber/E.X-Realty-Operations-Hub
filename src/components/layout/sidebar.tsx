'use client';

import Link from 'next/link';
import { X } from 'lucide-react';
import { navigation } from '@/config/navigation';

const tools = ['real-price', 'property-report', 'community-market', 'community-compare', 'real-price-map', 'location-intelligence', 'property-intelligence', 'property-marketing-studio', 'creative-studio', 'proposal-studio'];
const demos = ['public-showcase', 'product-tour', 'platform-demo', 'realty-demo-presentation'];

export function Sidebar({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) {
  const byIds = (ids: string[]) => ids.map((id) => navigation.find((item) => item.id === id)).filter((item): item is (typeof navigation)[number] => Boolean(item));
  return <aside className={`desktop-sidebar ${mobileOpen ? 'mobile-open' : ''} fixed inset-y-0 left-0 z-30 w-72 border-r border-slate-700/60 bg-[#071526]/95 p-5 ${mobileOpen ? 'block' : 'hidden'} md:block`}><div className="mb-8 flex items-center justify-between"><Link href="/" className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-400 to-violet-500 font-black text-slate-950">EX</div><div><div className="text-sm font-bold tracking-[.18em]">E.X REALTY HUB</div><div className="text-[10px] text-slate-400">OPERATIONS CENTER</div></div></Link><button aria-label="關閉導覽" className="md:hidden" onClick={onClose}><X size={18} /></button></div><div className="mb-5 rounded-xl border border-amber-300/20 bg-amber-300/5 p-3 text-xs text-amber-100">開發模式角色預覽<br /><span className="text-amber-200/70">非正式登入或權限系統</span></div><NavigationGroup title="Tools" items={byIds(tools)} onClose={onClose} /><NavigationGroup title="Demo" items={byIds(demos)} onClose={onClose} /></aside>;
}

function NavigationGroup({ title, items, onClose }: { title: string; items: typeof navigation; onClose: () => void }) { return <nav aria-label={title} className="mb-6"><p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[.18em] text-slate-500">{title}</p><div className="space-y-1">{items.map((item) => <Link key={item.id} href={item.route} onClick={onClose} className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800/80 hover:text-white"><span>{item.title}</span><span className="text-[10px] text-slate-500">{item.status === 'planned' ? 'Planned' : ''}</span></Link>)}</div></nav>; }
