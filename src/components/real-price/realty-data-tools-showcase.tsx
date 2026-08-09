'use client';

import {useMemo} from 'react';
import Link from 'next/link';
import {ArrowRight,BarChart3,FileText,Lightbulb,Scale,ScanSearch,Sparkles} from 'lucide-react';
import {realtyDemoCases} from '@/data/mock/real-price/demo-cases/demo-cases';
import {mockBranding} from '@/features/real-price/branding';
import {calculateCommunitySummary} from '@/features/real-price/community-analysis';
import {compareCommunities} from '@/features/real-price/community-comparison';
import {createCompleteMarketReport} from '@/features/real-price/demo-presentation';
import {createMarketProposalPackage} from '@/features/real-price/proposal-templates/proposal-package';
import {getProposalTemplate} from '@/features/real-price/proposal-templates/templates';
import {mockTransactionRepository} from '@/features/real-price/repositories/mock-transaction-repository';
import {CompleteMarketReportExport} from './complete-market-report-export';

const features = [
  {icon:ScanSearch,title:'實價行情分析',description:'從篩選條件快速整理成交清單、行情摘要與價格趨勢。'},
  {icon:Scale,title:'社區比較分析',description:'將兩個社區的平均單價、成交量與市場定位放在同一畫面。'},
  {icon:BarChart3,title:'成交案例分析',description:'用單筆成交資料建立可解讀、可溝通的市場案例。'},
  {icon:Sparkles,title:'市場提案生成',description:'依固定品牌模板組合社區、比較與案例資訊。'},
  {icon:FileText,title:'PDF 報告輸出',description:'產生品牌化市場分析 PDF，所有內容皆清楚標示 Mock Data。'},
] as const;

const flow = ['資料','分析','洞察','提案','成交'];

export function RealtyDataToolsShowcasePage() {
  const report = useMemo(() => {
    const demoCase = realtyDemoCases[0];
    const transactions = mockTransactionRepository.getTransactions();
    const communityTransactions = transactions.filter((item) => item.community === demoCase.community);
    const comparisonTransactions = transactions.filter((item) => item.community === demoCase.comparisonCommunity);
    const summary = calculateCommunitySummary(communityTransactions,demoCase.community);
    const comparison = compareCommunities([summary,calculateCommunitySummary(comparisonTransactions,demoCase.comparisonCommunity)]);
    const proposal = createMarketProposalPackage({template:getProposalTemplate(demoCase.recommendedTemplate),branding:mockBranding,communitySummary:summary,comparison,transaction:communityTransactions.find((item) => demoCase.featuredTransactions.includes(item.id)) ?? null,transactions:communityTransactions});
    return createCompleteMarketReport(demoCase,proposal);
  },[]);

  return <div className="mx-auto max-w-7xl pb-12"><section className="overflow-hidden rounded-3xl border border-blue-300/20 bg-[radial-gradient(circle_at_82%_18%,rgba(126,167,255,.3),transparent_25%),radial-gradient(circle_at_72%_88%,rgba(244,201,106,.12),transparent_22%),linear-gradient(135deg,#071321,#102b4b)] px-6 py-12 sm:px-10 sm:py-16"><div className="grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr]"><div><span className="inline-flex rounded-full border border-blue-200/25 bg-blue-300/10 px-3 py-1 text-xs tracking-[.16em] text-blue-100">AI REAL ESTATE INTELLIGENCE · DEMO</span><h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-6xl">E.X Realty Data Tools</h1><p className="mt-4 text-xl text-blue-100">AI 房產市場分析與銷售提案平台</p><p className="mt-5 max-w-2xl leading-7 text-slate-300">以結構化資料流程，將成交資訊轉化為可展示、可比較、可提供客戶閱讀的市場提案。此版本使用 Mock Data，專為主管展示與產品方向驗證而設計。</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/tools/real-price/demo/presentation" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-amber-300 px-5 py-3 text-sm font-semibold text-slate-950">開始 AI 房產分析 Demo<ArrowRight size={16}/></Link><CompleteMarketReportExport report={report}/></div></div><div className="rounded-3xl border border-white/10 bg-slate-950/35 p-5 shadow-2xl"><div className="flex items-center justify-between"><span className="text-xs tracking-[.16em] text-blue-200">DEMO SCREENSHOT PLACEHOLDER</span><span className="rounded-full bg-emerald-300/10 px-2 py-1 text-xs text-emerald-100">MOCK DATA</span></div><div className="mt-5 overflow-hidden rounded-2xl border border-slate-700 bg-[#081526] p-4"><div className="flex gap-2"><span className="h-2 w-2 rounded-full bg-rose-300"/><span className="h-2 w-2 rounded-full bg-amber-300"/><span className="h-2 w-2 rounded-full bg-emerald-300"/></div><div className="mt-5 grid grid-cols-[.75fr_1.25fr] gap-3"><div className="space-y-3"><div className="h-16 rounded-lg bg-blue-300/10"/><div className="h-24 rounded-lg bg-white/5"/><div className="h-12 rounded-lg bg-white/5"/></div><div className="space-y-3"><div className="h-24 rounded-lg bg-[linear-gradient(120deg,rgba(126,167,255,.35),rgba(244,201,106,.16))]"/><div className="grid grid-cols-3 gap-2">{[1,2,3].map((item) => <div key={item} className="h-16 rounded-lg bg-white/5"/>)}</div><div className="flex h-20 items-end gap-2 rounded-lg bg-white/5 p-3">{[40,64,48,78,58,86].map((height,index) => <span key={index} style={{height:`${height}%`}} className="flex-1 rounded-t bg-blue-300/70"/>)}</div></div></div></div><p className="mt-4 text-sm leading-6 text-slate-400">展示畫面預留：未使用外部圖片或實際客戶資料。</p></div></div></section><section className="mt-12"><p className="text-xs tracking-[.18em] text-blue-200">PRODUCT CAPABILITIES</p><h2 className="mt-2 text-3xl font-semibold">一個可展示的市場分析工作流</h2><div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">{features.map(({icon:Icon,title,description}) => <article key={title} className="rounded-2xl border border-slate-700 bg-slate-900/35 p-5"><Icon size={20} className="text-amber-200"/><h3 className="mt-4 font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{description}</p></article>)}</div></section><section className="mt-12 rounded-3xl border border-slate-700 bg-slate-900/30 p-6 sm:p-9"><p className="text-xs tracking-[.18em] text-blue-200">FEATURE TIMELINE</p><h2 className="mt-2 text-3xl font-semibold">資料到成交的提案路徑</h2><div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center">{flow.map((item,index) => <div key={item} className="flex flex-1 items-center gap-3"><div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-blue-300/30 bg-blue-300/10 text-sm font-bold text-blue-100">0{index + 1}</div><span className="font-semibold">{item}</span>{index < flow.length - 1 && <ArrowRight className="ml-auto hidden text-slate-500 md:block" size={18}/>}</div>)}</div><div className="mt-8 rounded-2xl border border-amber-300/20 bg-amber-300/5 p-5"><div className="flex items-start gap-3"><Lightbulb className="mt-0.5 text-amber-200" size={20}/><div><h3 className="font-semibold">規則式 Demo Generated Insight</h3><p className="mt-2 text-sm leading-6 text-slate-300">洞察以 Mock 成交筆數、平均單價、社區比較與案例的商業描述組合，不呼叫任何 AI API，也不應視為正式估價或投資建議。</p></div></div></div></section></div>;
}
