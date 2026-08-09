'use client';

import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { getBrandKit, saveBrandKit } from '@/features/creative-studio/brand-kit';
import type { BrandKit } from '@/features/creative-studio/types';

export function BrandKitEditor() {
  const [kit, setKit] = useState<BrandKit>(getBrandKit());
  const [saved, setSaved] = useState(false);
  useEffect(() => setKit(getBrandKit()), []);
  const update = (field: keyof Omit<BrandKit, 'source'>, value: string) => { setSaved(false); setKit((current) => ({ ...current, [field]: value })); };
  const submit = () => { saveBrandKit({ companyName: kit.companyName, branchName: kit.branchName, logo: kit.logo, agentName: kit.agentName, phone: kit.phone, qrCode: kit.qrCode, primaryColor: kit.primaryColor, secondaryColor: kit.secondaryColor }); setSaved(true); };
  return <section className="rounded-2xl border border-slate-700 bg-slate-900/35 p-5"><p className="text-xs tracking-[.16em] text-blue-200">BRAND KIT · MOCK</p><h2 className="mt-1 text-xl font-semibold">Brand Kit Editor</h2><p className="mt-2 text-xs leading-5 text-slate-400">僅供展示環境使用，請勿輸入真實客戶或個人資料。</p><div className="mt-5 grid gap-4 sm:grid-cols-2">{([['companyName', '公司名稱'], ['branchName', '分店'], ['agentName', '業務名稱'], ['phone', '電話'], ['logo', 'Logo Asset ID'], ['qrCode', 'QR Code Asset ID']] as const).map(([field, label]) => <label key={field} className="block text-sm text-slate-200">{label}<input value={kit[field]} onChange={(event) => update(field, event.target.value)} className="mt-2 min-h-10 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100"/></label>)}<label className="block text-sm text-slate-200">Primary Color<input type="color" value={kit.primaryColor} onChange={(event) => update('primaryColor', event.target.value)} className="mt-2 h-10 w-full rounded-lg border border-slate-700 bg-slate-950 p-1"/></label><label className="block text-sm text-slate-200">Secondary Color<input type="color" value={kit.secondaryColor} onChange={(event) => update('secondaryColor', event.target.value)} className="mt-2 h-10 w-full rounded-lg border border-slate-700 bg-slate-950 p-1"/></label></div><button type="button" onClick={submit} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-950"><Save size={16}/>儲存 Brand Kit</button>{saved && <span className="ml-3 text-xs text-emerald-200">已儲存至 localStorage。</span>}</section>;
}
