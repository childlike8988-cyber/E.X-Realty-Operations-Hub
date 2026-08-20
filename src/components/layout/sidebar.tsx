'use client';

import Link from 'next/link';
import { X } from 'lucide-react';
import { navigation } from '@/config/navigation';

const tools = ['real-price', 'property-report', 'community-market', 'community-compare', 'real-price-map', 'location-intelligence', 'property-intelligence', 'property-marketing-studio', 'creative-studio', 'proposal-studio'];
const demos = ['public-showcase', 'product-tour', 'platform-demo', 'realty-demo-presentation'];

export function Sidebar({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) {
  const byIds = (ids: string[]) => ids.map((id) => navigation.find((item) => item.id === id)).filter((item): item is (typeof navigation)[number] => Boolean(item));
  return <aside className={`desktop-sidebar ${mobileOpen ? 'mobile-open' : ''} fixed inset-y-0 left-0 z-30 w-72 ${mobileOpen ? 'block' : 'hidden'} md:block`}><div className="sidebar-brand flex items-center justify-between"><Link href="/" className="flex items-center gap-3"><div className="sidebar-logo grid h-10 w-10 place-items-center rounded-xl font-black">EX</div><div><div className="text-sm font-bold tracking-[.18em]">E.X REALTY HUB</div><div className="sidebar-subtitle">OPERATIONS CENTER</div></div></Link><button aria-label="關閉導覽" className="md:hidden" onClick={onClose}><X size={18} /></button></div><div className="sidebar-role mb-5 rounded-xl p-3 text-xs">開發模式角色預覽<br /><span>非正式登入或權限系統</span></div><div className="sidebar-nav"><NavigationGroup title="Tools" items={byIds(tools)} onClose={onClose} /><NavigationGroup title="Demo" items={byIds(demos)} onClose={onClose} /></div><div className="sidebar-footer">E.X REALTY HUB <span>v1.3.3</span></div></aside>;
}

function NavigationGroup({ title, items, onClose }: { title: string; items: typeof navigation; onClose: () => void }) { return <nav aria-label={title} className="sidebar-group"><p className="sidebar-group-title">{title}</p><div className="sidebar-items">{items.map((item) => <Link key={item.id} href={item.route} onClick={onClose} className="sidebar-item"><span className="sidebar-item-copy"><strong>{item.title}</strong><small>{item.subtitle}</small></span><span className="sidebar-status">{item.status === 'planned' ? 'Planned' : ''}</span></Link>)}</div></nav>; }
