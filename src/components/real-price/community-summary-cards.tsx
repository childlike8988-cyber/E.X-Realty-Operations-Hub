import type {CommunitySummary} from '@/features/real-price/types';

export function CommunitySummaryCards({summary}:{summary:CommunitySummary}) {
  const cards = [
    ['成交筆數',`${summary.transactionCount} 筆`],['平均單價',`${summary.averageUnitPrice.toFixed(1)} 萬/坪`],['最高單價',`${summary.highestUnitPrice.toFixed(1)} 萬/坪`],['最低單價',`${summary.lowestUnitPrice.toFixed(1)} 萬/坪`],['平均總價',`${summary.averageTotalPrice.toLocaleString()} 萬`],['平均坪數',`${summary.averageAreaPing.toFixed(1)} 坪`],['平均屋齡',`${summary.averageBuildingAge.toFixed(1)} 年`],['資料來源',summary.source],
  ];
  return <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{cards.map(([label,value])=><article key={label} className="glass rounded-xl p-4"><p className="text-xs text-slate-500">{label}</p><p className="mt-2 text-xl font-semibold text-slate-100">{value}</p></article>)}</div>;
}
