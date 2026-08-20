import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { navigation } from '@/config/navigation';
import { RolePreview } from '@/components/dashboard/role-preview';
import { RealtyDataToolsShowcase } from '@/components/dashboard/realty-data-tools-showcase';
import { ModuleCard } from '@/components/ui/module-card';

const coreIds = ['property-report', 'property-intelligence', 'real-price', 'real-price-map'];
const marketingIds = ['property-marketing-studio', 'creative-studio', 'proposal-studio'];
const showcaseIds = ['realty-demo-presentation', 'platform-demo', 'public-showcase'];

export default function Home() {
  const byIds = (ids: string[]) => ids.map((id) => navigation.find((item) => item.id === id)).filter((item): item is (typeof navigation)[number] => Boolean(item));
  const utilities = navigation.filter((item) => ['行政', '業務', '共用', '工具', '影音'].includes(item.category));
  return <div className="home-page mx-auto max-w-7xl">
    <section className="home-hero mb-10 grid gap-6 lg:grid-cols-[1.25fr_.75fr]">
      <div className="home-hero-copy">
        <div className="home-kicker mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs"><Sparkles size={13} /> AI-POWERED REALTY OPERATIONS</div>
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">房仲營運 × 行銷製作<br /><span>案件管理 × 團隊協作</span></h1>
        <p className="mt-5 max-w-2xl text-base leading-7">E.X REALTY HUB 將市場資料、物件洞察與客戶提案放在同一個可持續開發的工作台。</p>
        <div className="home-hero-actions mt-7 flex flex-wrap gap-3">
          <Link href="/tools/property-report" className="primary-cta inline-flex min-h-11 items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold">開啟房產報告 <ArrowRight size={16} /></Link>
          <Link href="/tools/property-report/present" className="secondary-cta inline-flex min-h-11 items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold">簡報模式 <ArrowRight size={16} /></Link>
        </div>
      </div>
      <RolePreview />
    </section>

    <section className="mb-10 grid gap-4 md:grid-cols-3">
      <div className="home-stat glass rounded-2xl p-5"><p>目前版本</p><strong>v1.3.3</strong><span>UI Language + Visual System Polish</span></div>
      <div className="home-stat glass rounded-2xl p-5"><p>Realty Data Tools</p><strong>核心展示</strong><span>資料、分析、提案與簡報</span></div>
      <div className="home-stat glass rounded-2xl p-5"><p>系統模式</p><strong>展示資料模式</strong><span>Powered by Mock Data</span></div>
    </section>

    <RealtyDataToolsShowcase />
    <Block title="核心房產工作流" subtitle="Realty Core Workflow" items={byIds(coreIds)} />
    <Block title="行銷與創意" subtitle="Marketing & Creative" items={byIds(marketingIds)} />
    <Block title="展示與簡報" subtitle="Presentation & Showcase" items={byIds(showcaseIds)} />
    <Block title="行政與共用工具" subtitle="Admin & Utilities" items={utilities} />
  </div>;
}

function Block({ title, subtitle, items }: { title: string; subtitle: string; items: typeof navigation }) {
  return <section className="home-section mb-10"><div className="mb-4 flex items-end justify-between gap-4"><div><p className="home-section-eyebrow">{subtitle}</p><h2 className="mt-1 text-2xl font-semibold">{title}</h2></div><span className="home-section-count">{items.length} 個入口</span></div><div className="grid-auto grid gap-4 md:grid-cols-2 xl:grid-cols-3">{items.map((item) => <ModuleCard key={item.id} {...item} eyebrow={item.category} />)}</div></section>;
}
