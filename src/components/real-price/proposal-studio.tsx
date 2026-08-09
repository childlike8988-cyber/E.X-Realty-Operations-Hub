'use client';

import {useMemo,useRef,useState} from 'react';
import Link from 'next/link';
import {mockProperties} from '@/features/property-intelligence/mock-properties';
import {createPropertyMarketProposalPackage} from '@/features/property-intelligence/proposal-adapter';
import {PropertyProposalPreview} from '@/components/property-intelligence/property-proposal-preview';
import {mockBranding} from '@/features/real-price/branding';
import {calculateCommunitySummary} from '@/features/real-price/community-analysis';
import {compareCommunities} from '@/features/real-price/community-comparison';
import {createMarketProposalPackage} from '@/features/real-price/proposal-templates/proposal-package';
import {getProposalTemplate,proposalTemplates} from '@/features/real-price/proposal-templates/templates';
import type {ProposalTemplateId} from '@/features/real-price/proposal-templates/types';
import {mockTransactionRepository} from '@/features/real-price/repositories/mock-transaction-repository';
import {BrandPreview} from './brand-preview';
import {MarketProposalPreview} from './market-proposal-preview';
import {ProposalPackageExport} from './proposal-package-export';
import {ProposalTemplateSelector} from './proposal-template-selector';

export function ProposalStudio() {
  const transactions = useMemo(() => mockTransactionRepository.getTransactions(),[]);
  const communities = useMemo(() => [...new Set(transactions.map((item) => item.community))],[transactions]);
  const [community,setCommunity] = useState(communities[0] ?? '');
  const [comparisonCommunity,setComparisonCommunity] = useState(communities[1] ?? '');
  const [transactionId,setTransactionId] = useState('rp-01');
  const [templateId,setTemplateId] = useState<ProposalTemplateId>('business-standard');
  const [propertyId,setPropertyId] = useState('');
  const [proposalReady,setProposalReady] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const communityTransactions = useMemo(() => transactions.filter((item) => item.community === community),[community,transactions]);
  const comparisonTransactions = useMemo(() => transactions.filter((item) => item.community === comparisonCommunity),[comparisonCommunity,transactions]);
  const summary = useMemo(() => calculateCommunitySummary(communityTransactions,community),[community,communityTransactions]);
  const comparison = useMemo(() => comparisonCommunity && comparisonCommunity !== community ? compareCommunities([summary,calculateCommunitySummary(comparisonTransactions,comparisonCommunity)]) : null,[community,comparisonCommunity,comparisonTransactions,summary]);
  const selectedTransaction = useMemo(() => communityTransactions.find((item) => item.id === transactionId) ?? communityTransactions[0] ?? null,[communityTransactions,transactionId]);
  const manualProposal = useMemo(() => createMarketProposalPackage({template:getProposalTemplate(templateId),branding:mockBranding,communitySummary:summary,comparison,transaction:selectedTransaction,transactions:communityTransactions}),[communityTransactions,comparison,selectedTransaction,summary,templateId]);
  const selectedProperty = mockProperties.find((item) => item.id === propertyId) ?? null;
  const importedProposal = useMemo(() => selectedProperty ? createPropertyMarketProposalPackage(selectedProperty,getProposalTemplate(templateId)) : null,[selectedProperty,templateId]);
  const proposal = importedProposal ?? manualProposal;

  const selectCommunity = (next:string) => { setPropertyId(''); setProposalReady(false); setCommunity(next); const transaction = transactions.find((item) => item.community === next); setTransactionId(transaction?.id ?? ''); if(next === comparisonCommunity) setComparisonCommunity(communities.find((item) => item !== next) ?? ''); };
  const importProperty = (next:string) => { setPropertyId(next); setProposalReady(Boolean(next)); };

  return <div className="mx-auto max-w-7xl"><div className="flex flex-wrap items-start justify-between gap-4"><div><div className="inline-flex rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs text-amber-100">PROPOSAL STUDIO · MOCK DATA</div><h1 className="mt-4 text-4xl font-semibold md:text-5xl">市場分析提案中心</h1><p className="mt-3 max-w-3xl text-lg text-slate-400">可使用既有市場資料手動組合，或直接匯入 Property Intelligence 的智慧分析案件。</p></div><Link href="/tools/real-price" className="min-h-11 rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200">返回實價行情</Link></div><div className="mt-8 grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]"><aside className="space-y-6"><section className="rounded-2xl border border-emerald-300/25 bg-emerald-300/5 p-5"><p className="text-xs tracking-[.16em] text-emerald-100">智慧分析案件匯入</p><h2 className="mt-2 text-lg font-semibold">Demo Property Cases</h2><label className="mt-4 block text-sm">選擇案件<select value={propertyId} onChange={(event) => importProperty(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"><option value="">手動市場資料組合</option>{mockProperties.map((property) => <option key={property.id} value={property.id}>{property.title}</option>)}</select></label><p className="mt-3 text-xs leading-5 text-slate-400">匯入後自動帶入市場摘要、生活圈、評分、推薦客群、銷售策略與可比成交案例。</p></section>{proposal.propertyContext && <PropertyProposalPreview context={proposal.propertyContext} onCreate={() => setProposalReady(true)}/>}<section className="glass rounded-2xl p-5"><p className="text-xs tracking-[.16em] text-blue-200/70">PACKAGE DATA</p><h2 className="mt-1 text-lg font-semibold">手動資料來源</h2><div className="mt-4 space-y-4"><label className="block text-sm">社區<select value={community} onChange={(event) => selectCommunity(event.target.value)} disabled={Boolean(selectedProperty)} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50">{communities.map((item) => <option key={item}>{item}</option>)}</select></label><label className="block text-sm">比較社區<select value={comparisonCommunity} onChange={(event) => setComparisonCommunity(event.target.value)} disabled={Boolean(selectedProperty)} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50">{communities.filter((item) => item !== community).map((item) => <option key={item}>{item}</option>)}</select></label><label className="block text-sm">成交案例<select value={transactionId} onChange={(event) => setTransactionId(event.target.value)} disabled={Boolean(selectedProperty)} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50">{communityTransactions.map((item) => <option key={item.id} value={item.id}>{item.transactionDate} · {item.floor} · {item.unitPrice} 萬/坪</option>)}</select></label></div></section><ProposalTemplateSelector templates={proposalTemplates} value={templateId} onChange={setTemplateId}/><BrandPreview branding={mockBranding}/></aside><main><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs tracking-[.16em] text-blue-200/70">PROPOSAL PREVIEW · 16:9</p><h2 className="mt-1 text-xl font-semibold">{proposalReady && selectedProperty ? 'Property Intelligence Market Proposal Package' : 'Market Proposal Package'}</h2></div><ProposalPackageExport targetRef={previewRef} fileBaseName={proposal.exportFileBaseName}/></div><MarketProposalPreview ref={previewRef} proposal={proposal}/>{proposal.propertyContext && <section className="mt-5 rounded-xl border border-emerald-300/25 bg-emerald-300/5 p-4 text-sm text-slate-200"><span className="font-medium text-emerald-100">智慧案件已匯入：</span>{proposal.propertyContext.property.title} · {proposal.propertyContext.score.label} {proposal.propertyContext.score.overallScore}/100 · PropertyProposalContext 已附加至 Proposal Package。</section>}<section className="mt-5 rounded-xl border border-slate-700 bg-slate-900/40 p-4 text-sm text-slate-400"><span className="font-medium text-slate-200">支援區塊：</span>{proposal.template.supportedSections.join(' · ')}。所有內容為 Mock Data，未串接外部 API。</section></main></div></div>;
}
