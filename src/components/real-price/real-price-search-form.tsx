'use client';

import type {RealPriceQuery} from '@/features/real-price/types';

export function RealPriceSearchForm({query,onChange,onSearch}:{query:RealPriceQuery;onChange:(query:RealPriceQuery)=>void;onSearch:()=>void}) {
  const change = (key:keyof RealPriceQuery,value:string) => onChange({...query,[key]:value});
  return <div className="glass rounded-2xl p-5">
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <label className="text-sm">行政區<select value={query.city} onChange={(event)=>change('city',event.target.value)} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"><option value="">全部</option><option value="高雄市">高雄市</option></select></label>
      <label className="text-sm">區<select value={query.district} onChange={(event)=>change('district',event.target.value)} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"><option value="">全部</option>{['鼓山區','左營區','鳳山區','三民區'].map((item)=><option key={item}>{item}</option>)}</select></label>
      <label className="text-sm">路段搜尋<input value={query.road ?? ''} onChange={(event)=>change('road',event.target.value)} placeholder="例如：美術東二路" className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"/></label>
      <label className="text-sm">社區名稱<input value={query.community} onChange={(event)=>change('community',event.target.value)} placeholder="例如：美術館首席" className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"/></label>
      <label className="text-sm">地址關鍵字<input value={query.addressKeyword ?? ''} onChange={(event)=>change('addressKeyword',event.target.value)} placeholder="門牌或地址關鍵字" className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"/></label>
      <label className="text-sm">屋齡區間<select value={query.ageRange ?? ''} onChange={(event)=>change('ageRange',event.target.value)} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"><option value="">全部</option><option value="0-5">0–5 年</option><option value="5-15">5–15 年</option><option value="15+">15 年以上</option></select></label>
      <label className="text-sm">產品類型<select value={query.buildingType} onChange={(event)=>change('buildingType',event.target.value)} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"><option value="">全部</option>{['大樓','華廈','公寓','透天','土地'].map((item)=><option key={item}>{item}</option>)}</select></label>
      <label className="text-sm">交易期間<select value={query.period} onChange={(event)=>change('period',event.target.value)} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2">{[['3m','近三個月'],['6m','近半年'],['1y','近一年'],['all','全部']].map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>
    </div>
    <button onClick={onSearch} className="mt-5 min-h-11 rounded-lg bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-950">查詢行情</button>
  </div>;
}
