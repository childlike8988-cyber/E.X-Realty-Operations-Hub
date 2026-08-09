'use client';

import {useRef} from 'react';
import {X} from 'lucide-react';
import {compareTransactionToCommunity} from '@/features/real-price/community-analysis';
import type {CommunitySummary, RealEstateTransaction} from '@/features/real-price/types';
import {ProposalExportButtons} from './proposal-export-buttons';
import {TransactionProposalCard} from './transaction-proposal-card';

export function TransactionDetailDrawer({transaction,summary,onClose}:{transaction:RealEstateTransaction|null;summary:CommunitySummary;onClose:()=>void}) {
  const proposalRef = useRef<HTMLDivElement>(null);
  if (!transaction) return null;
  const comparison = compareTransactionToCommunity(transaction,summary);
  const indicator = comparison.direction === 'above' ? '高於社區平均' : comparison.direction === 'below' ? '低於社區平均' : '與社區平均相同';
  const tone = comparison.direction === 'above' ? 'text-emerald-200 border-emerald-300/30 bg-emerald-300/10' : comparison.direction === 'below' ? 'text-orange-200 border-orange-300/30 bg-orange-300/10' : 'text-slate-200 border-slate-300/30 bg-slate-300/10';
  const details = [['成交日期',transaction.transactionDate],['社區',transaction.community],['地址',transaction.address],['建物類型',transaction.buildingType],['坪數',`${transaction.areaPing} 坪`],['總價',`${transaction.totalPrice.toLocaleString()} 萬`],['單價',`${transaction.unitPrice.toFixed(1)} 萬/坪`],['樓層',transaction.floor],['屋齡',`${transaction.buildingAge} 年`],['車位',transaction.parking]];
  return <div role="dialog" aria-modal="true" aria-label="成交案例分析" className="fixed inset-0 z-50 flex justify-end"><button aria-label="關閉成交案例分析" onClick={onClose} className="absolute inset-0 bg-slate-950/70"/><aside className="relative h-full w-full max-w-xl overflow-y-auto border-l border-slate-700 bg-[#0c1524] p-6 shadow-2xl"><div className="flex items-start justify-between gap-4"><div><p className="text-xs tracking-[.16em] text-blue-200/70">TRANSACTION DETAIL</p><h2 className="mt-2 text-2xl font-semibold">成交案例分析</h2></div><button aria-label="關閉" onClick={onClose} className="grid min-h-11 min-w-11 place-items-center rounded-lg border border-slate-700 text-slate-300"><X size={18}/></button></div><section className="mt-6 rounded-2xl border border-amber-300/20 bg-amber-300/5 p-4"><p className="text-sm text-slate-400">與社區平均比較</p><p className="mt-2 text-2xl font-semibold text-amber-100">{transaction.unitPrice.toFixed(1)} 萬/坪</p><p className="mt-1 text-sm text-slate-400">社區平均 {summary.averageUnitPrice.toFixed(1)} 萬/坪</p><span className={`mt-3 inline-flex rounded-full border px-3 py-1 text-xs ${tone}`}>{indicator} {comparison.unitPriceDifferencePercent >= 0 ? '+' : ''}{comparison.unitPriceDifferencePercent.toFixed(1)}%</span></section><dl className="mt-6 divide-y divide-slate-800">{details.map(([label,value])=><div key={label} className="flex items-center justify-between gap-4 py-3 text-sm"><dt className="text-slate-500">{label}</dt><dd className="text-right text-slate-100">{value}</dd></div>)}</dl><section className="mt-7 border-t border-slate-800 pt-6"><div className="mb-3"><p className="text-xs tracking-[.16em] text-blue-200/70">PROPOSAL PREVIEW · 16:9</p><h3 className="mt-1 text-lg font-semibold">成交案例提案卡</h3></div><TransactionProposalCard ref={proposalRef} transaction={transaction} summary={summary}/><div className="mt-3"><ProposalExportButtons targetRef={proposalRef}/></div></section><p className="mt-6 text-xs leading-5 text-slate-500">資料來源：Mock Data。此分析僅供展示，不代表正式實價登錄或估價建議。</p></aside></div>;
}
