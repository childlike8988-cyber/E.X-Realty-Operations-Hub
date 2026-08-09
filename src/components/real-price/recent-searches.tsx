'use client';

import type {RecentSearch} from '@/features/real-price/recent-searches';

export function RecentSearches({items,onSelect}:{items:RecentSearch[];onSelect:(item:RecentSearch)=>void}) {
  if (!items.length) return null;
  return <section className="mt-5"><div className="mb-2 flex items-center justify-between"><h2 className="text-sm font-semibold text-slate-300">最近查詢</h2><span className="text-xs text-slate-500">僅儲存在此瀏覽器</span></div><div className="flex gap-2 overflow-x-auto pb-1">{items.map((item)=><button key={item.id} onClick={()=>onSelect(item)} className="shrink-0 rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-left text-xs text-slate-300 hover:border-blue-300/50"><span className="block font-medium text-slate-100">{item.query.community || item.query.road || item.query.district || '全部區域'}</span><span className="mt-1 block text-slate-500">{[item.query.city,item.query.district,item.query.ageRange].filter(Boolean).join(' · ')}</span></button>)}</div></section>;
}
