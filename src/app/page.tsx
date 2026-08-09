import {navigation} from '@/config/navigation';
import {RolePreview} from '@/components/dashboard/role-preview';
import {RealtyDataToolsShowcase} from '@/components/dashboard/realty-data-tools-showcase';
import {ModuleCard} from '@/components/ui/module-card';

export default function Home() {
  const admin = navigation.filter((item) => item.category === '行政');
  const sales = navigation.filter((item) => item.category === '業務');
  const shared = navigation.filter((item) => ['共用','工具','影音'].includes(item.category));
  const realtyDataTools = navigation.filter((item) => item.category === 'Realty Data Tools');
  return <div className="mx-auto max-w-7xl"><section className="mb-10 grid gap-6 lg:grid-cols-[1.2fr_.8fr]"><div><div className="mb-4 inline-flex rounded-full border border-blue-300/20 bg-blue-300/10 px-3 py-1 text-xs text-blue-100">AI-Powered Real Estate Operations Center</div><h1 className="max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">房仲營運 × 行銷製作<br/><span className="text-blue-300">案件管理 × 團隊協作</span></h1><p className="mt-5 max-w-2xl text-base leading-7 text-slate-400">E.X REALTY HUB 是面向內部團隊的工作台。先把資訊放在正確的位置，再讓 AI 在需要時讀取它。</p></div><RolePreview/></section><section className="mb-10 grid gap-4 md:grid-cols-3"><div className="glass rounded-2xl p-5"><p className="text-sm text-slate-400">目前展示版本</p><p className="mt-2 text-3xl font-semibold">v0.2.5</p><p className="mt-1 text-xs text-emerald-300">Realty Data Tools Showcase</p></div><div className="glass rounded-2xl p-5"><p className="text-sm text-slate-400">Realty Data Tools</p><p className="mt-2 text-3xl font-semibold">{realtyDataTools.length}</p><p className="mt-1 text-xs text-slate-500">集中查詢、分析、提案與展示入口</p></div><div className="glass rounded-2xl p-5"><p className="text-sm text-slate-400">系統公告</p><p className="mt-2 text-lg font-semibold">展示資料模式</p><p className="mt-1 text-xs text-slate-500">僅使用示範資料</p></div></section><RealtyDataToolsShowcase/><Block title="Realty Data Tools" items={realtyDataTools}/><Block title="行政入口" items={admin}/><Block title="業務入口" items={sales}/><Block title="共用與工具" items={shared}/></div>;
}

function Block({title,items}:{title:string;items:typeof navigation}) {
  return <section className="mb-10"><div className="mb-4 flex items-end justify-between"><div><p className="text-xs uppercase tracking-[.18em] text-blue-300/70">WORKSPACE</p><h2 className="mt-1 text-2xl font-semibold">{title}</h2></div><span className="text-xs text-slate-500">{items.length} 個入口</span></div><div className="grid-auto grid gap-4 md:grid-cols-2 xl:grid-cols-3">{items.map((item) => <ModuleCard key={item.id} {...item} eyebrow={item.category}/>)}</div></section>;
}
