import { QrCode } from 'lucide-react';
import { mockBrandKit } from '@/features/creative-studio/brand-kit';

export function BrandShowcase() {
  const brand = mockBrandKit;
  return <section className="overflow-hidden rounded-3xl border border-blue-300/20 bg-slate-900/45"><div className="grid gap-6 p-6 lg:grid-cols-[1fr_280px]"><div><p className="text-xs tracking-[.18em] text-blue-200">MOCK BRAND SHOWCASE</p><h2 className="mt-2 text-3xl font-semibold">{brand.companyName}</h2><p className="mt-2 text-slate-400">此處使用展示用 Brand Kit，未包含真實公司、分店或業務個資。</p><div className="mt-6 grid gap-3 sm:grid-cols-2"><BrandField label="分店名稱" value={brand.branchName} /><BrandField label="業務名稱" value={brand.agentName} /><BrandField label="展示電話" value={brand.phone} /><BrandField label="品牌色" value={`${brand.primaryColor} · ${brand.secondaryColor}`} /></div></div><div className="flex items-center justify-center gap-5 rounded-2xl border border-white/10 bg-slate-950/35 p-6"><div className="grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-blue-400 to-violet-500 text-2xl font-black text-slate-950">EX</div><div className="grid h-20 w-20 place-items-center rounded-xl border border-slate-600 bg-white text-slate-950"><QrCode size={54} /></div></div></div></section>;
}
function BrandField({ label, value }: { label: string; value: string }) { return <div className="rounded-xl border border-slate-700 bg-slate-950/30 p-4"><p className="text-xs text-slate-500">{label}</p><p className="mt-2 text-sm font-medium text-slate-200">{value}</p></div>; }
