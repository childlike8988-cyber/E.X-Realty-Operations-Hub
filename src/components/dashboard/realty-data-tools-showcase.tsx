import Link from 'next/link';

const entries = [
  ['實價行情分析', 'Real Price Intelligence', '以 Mock 成交資料展示查詢、摘要與趨勢。', '/tools/real-price'],
  ['社區比較分析', 'Community Comparison', '比較兩個社區的單價與成交量。', '/tools/real-price/compare'],
  ['物件智慧分析', 'Property Intelligence', '整合市場、生活圈與銷售定位。', '/tools/property-analysis'],
  ['市場提案生成', 'Proposal Studio', '將分析組合成品牌化提案素材。', '/tools/real-price/proposal'],
  ['房產行銷內容', 'Property Marketing', '輸出展示用的多平台行銷文案。', '/tools/property-marketing'],
] as const;

const flow = ['案件', '分析', '提案', '行銷'];

export function RealtyDataToolsShowcase() {
  return <section className="showcase-panel mb-10 rounded-3xl p-6"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="showcase-kicker text-xs tracking-[.18em]">REALTY DATA TOOLS SHOWCASE</p><h2 className="mt-2 text-2xl font-semibold">從市場資料到客戶展示的一體化流程</h2><p className="showcase-copy mt-2 max-w-2xl text-sm leading-6">使用固定 Mock Data 呈現房仲市場分析、物件定位、提案與行銷素材工作流。</p></div><Link href="/demo" className="primary-cta inline-flex min-h-11 items-center rounded-lg px-4 py-2 text-sm font-semibold">開始 AI 房產展示</Link></div><div className="mt-5 flex flex-wrap items-center gap-2 text-sm">{flow.map((item, index) => <span key={item} className="flow-step flex items-center gap-2"><span className="rounded-lg px-3 py-2">{item}</span>{index < flow.length - 1 && <span className="flow-arrow">→</span>}</span>)}</div><div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-5">{entries.map(([title, subtitle, description, route], index) => <Link key={route} href={route} className="showcase-entry rounded-xl p-4 transition hover:-translate-y-0.5"><p className="showcase-entry-number text-xs">0{index + 1}</p><h3 className="mt-2 font-semibold">{title}</h3><p className="showcase-entry-subtitle">{subtitle}</p><p className="showcase-entry-copy mt-2 text-sm leading-5">{description}</p></Link>)}</div></section>;
}
