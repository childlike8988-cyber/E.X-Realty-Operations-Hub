import type {RealPriceQuery} from '@/features/real-price/types';

const ageLabels:Record<string,string> = {'0-5':'0–5 年','5-15':'5–15 年','15+':'15 年以上'};

export function QuerySummary({query,count}:{query:RealPriceQuery;count:number}) {
  const entries = [
    ['行政區',query.city || '全部'],
    ['區域',query.district || '全部'],
    ['路段',query.road || '未指定'],
    ['社區',query.community || '未指定'],
    ['地址',query.addressKeyword || '未指定'],
    ['屋齡',ageLabels[query.ageRange ?? ''] || '全部'],
    ['資料來源','MOCK'],
  ];
  return <section aria-label="查詢摘要" className="mt-6 rounded-2xl border border-blue-300/15 bg-blue-300/5 p-4"><div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-sm font-semibold text-blue-100">目前搜尋條件</h2><span className="text-xs text-slate-400">{count} 筆展示資料</span></div><dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">{entries.map(([label,value])=><div key={label} className="min-w-0"><dt className="text-xs text-slate-500">{label}</dt><dd className="mt-1 truncate text-slate-200">{value}</dd></div>)}</dl></section>;
}
