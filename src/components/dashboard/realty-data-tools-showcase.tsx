import Link from 'next/link';

const entries = [
  ['實價行情分析', '以 Mock 成交資料展示查詢、摘要與趨勢。', '/tools/real-price'],
  ['社區比較分析', '比較兩個社區的單價與成交量。', '/tools/real-price/compare'],
  ['Property Intelligence', '整合市場、生活圈與銷售定位。', '/tools/property-analysis'],
  ['市場提案生成', '將分析組合成品牌化提案素材。', '/tools/real-price/proposal'],
  ['Property Marketing Studio', '輸出展示用的多平台行銷文案。', '/tools/property-marketing'],
] as const;

const flow = ['案件', '分析', '提案', '行銷'];

export function RealtyDataToolsShowcase() {
  return <section className="mb-10 rounded-3xl border border-blue-300/15 bg-[radial-gradient(circle_at_85%_20%,rgba(126,167,255,.15),transparent_28%),linear-gradient(135deg,rgba(13,27,49,.75),rgba(13,20,34,.65))] p-6"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs tracking-[.18em] text-blue-200/70">REALTY DATA TOOLS SHOWCASE</p><h2 className="mt-2 text-2xl font-semibold">從市場資料到客戶展示的一體化流程</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">使用固定 Mock Data 呈現房仲市場分析、物件定位、提案與行銷素材工作流。</p></div><Link href="/demo" className="min-h-11 rounded-lg bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-950">開始 AI 房產展示</Link></div><div className="mt-5 flex flex-wrap items-center gap-2 text-sm">{flow.map((item, index) => <span key={item} className="flex items-center gap-2"><span className="rounded-lg border border-blue-300/25 bg-blue-300/10 px-3 py-2 text-blue-100">{item}</span>{index < flow.length - 1 && <span className="text-slate-500">→</span>}</span>)}</div><div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-5">{entries.map(([title, description, route], index) => <Link key={route} href={route} className="rounded-xl border border-white/10 bg-slate-950/25 p-4 transition hover:border-blue-300/50"><p className="text-xs text-amber-100">0{index + 1}</p><h3 className="mt-2 font-semibold">{title}</h3><p className="mt-2 text-sm leading-5 text-slate-400">{description}</p></Link>)}</div></section>;
}
