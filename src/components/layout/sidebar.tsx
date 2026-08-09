'use client';
import Link from 'next/link';
import {X} from 'lucide-react';
import {navigation} from '@/config/navigation';
export function Sidebar({mobileOpen,onClose}:{mobileOpen:boolean;onClose:()=>void}){
 return <aside className={`desktop-sidebar ${mobileOpen?'mobile-open':''} fixed inset-y-0 left-0 z-30 w-72 border-r border-slate-700/60 bg-[#071526]/95 p-5 ${mobileOpen?'block':'hidden'} md:block`}>
  <div className="mb-8 flex items-center justify-between"><Link href="/" className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-400 to-violet-500 font-black text-slate-950">EX</div><div><div className="text-sm font-bold tracking-[.18em]">E.X REALTY HUB</div><div className="text-[10px] text-slate-400">OPERATIONS CENTER</div></div></Link><button className="md:hidden" onClick={onClose}><X size={18}/></button></div>
  <div className="mb-5 rounded-xl border border-amber-300/20 bg-amber-300/5 p-3 text-xs text-amber-100">開發模式角色預覽<br/><span className="text-amber-200/70">不是正式登入系統</span></div>
  <nav className="space-y-1">{navigation.slice(0,12).map(item=><Link key={item.id} href={item.route} onClick={onClose} className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800/80 hover:text-white"><span>{item.title}</span><span className="text-[10px] text-slate-500">{item.status==='planned'?'開發中':''}</span></Link>)}</nav>
 </aside>
}
