import {notFound} from 'next/navigation'; import {navigation} from '@/config/navigation'; import {PageHeader} from '@/components/ui/page-header'; import {EmptyState} from '@/components/ui/empty-state';

// Concrete App Router pages own these paths. The fallback module page must not
// emit duplicate static files that can overwrite their richer implementations.
const concreteRoutes = new Set([
  '/admin/production', '/admin/production/announcements', '/admin/production/award-graphics', '/admin/production/history', '/admin/production/templates',
  '/assets/library', '/demo', '/showcase', '/tour',
  '/tools/creative-studio', '/tools/creative-studio/projects', '/tools/location-intelligence', '/tools/mortgage-calculator',
  '/tools/property-analysis', '/tools/property-marketing', '/tools/property-report', '/tools/property-report/present',
  '/tools/real-price', '/tools/real-price/community', '/tools/real-price/compare', '/tools/real-price/demo', '/tools/real-price/demo/presentation', '/tools/real-price/map', '/tools/real-price/proposal', '/tools/real-price/showcase',
]);

export function generateStaticParams(){return navigation.filter((item)=>!concreteRoutes.has(item.route)).map(n=>({slug:n.route.slice(1).split('/')}))}
export default async function ModulePage({params}:{params:Promise<{slug:string[]}>}){const {slug}=await params; const route='/'+slug.join('/'); const item=navigation.find(n=>n.route===route); if(!item) notFound(); return <div className="mx-auto max-w-5xl"><PageHeader title={item.title} description={item.description}/><div className="mb-5 flex items-center gap-3"><span className="rounded-full border border-blue-300/20 bg-blue-300/10 px-3 py-1 text-xs text-blue-100">{item.status==='planned'?'開發中':item.status}</span><span className="text-xs text-slate-500">路由 {item.route} · 版本 {item.version}</span></div><EmptyState description="本輪建立可持續開發的穩定骨架，尚未啟用正式資料流程或外部服務。"/></div>}
