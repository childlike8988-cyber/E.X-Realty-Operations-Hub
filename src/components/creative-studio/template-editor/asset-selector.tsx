'use client';

import { useState } from 'react';
import { Image as ImageIcon, Upload } from 'lucide-react';
import Image from 'next/image';
import { listAssetsForTemplateField } from '@/data/mock/creative-assets/library';
import { uploadCreativeAsset } from '@/features/creative-studio/asset-upload';
import type { TemplateField } from '@/features/creative-studio/types';

export function AssetSelector({ field, value, onChange }: { field: TemplateField; value: string; onChange: (assetId: string) => void }) {
  const [refresh, setRefresh] = useState(0);
  const [message, setMessage] = useState('');
  const assets = listAssetsForTemplateField(field.id);
  const upload = async (file: File | undefined) => { if (!file) return; try { const asset = await uploadCreativeAsset(file); onChange(asset.id); setRefresh((value) => value + 1); setMessage(`已加入本機素材：${asset.name}`); } catch (error) { setMessage(error instanceof Error ? error.message : '無法加入素材。'); } };
  return <div className="mt-2 grid gap-2" key={refresh}>{assets.map((asset) => <button key={asset.id} type="button" onClick={() => onChange(asset.id)} className={`flex min-h-12 items-center gap-3 rounded-lg border p-2 text-left ${asset.id === value ? 'border-amber-300/60 bg-amber-300/10' : 'border-slate-700 hover:border-blue-300/40'}`}><Image unoptimized src={asset.previewDataUrl} alt="" width={48} height={36} className="h-9 w-12 rounded object-cover"/><span className="min-w-0 flex-1 truncate text-xs text-slate-200">{asset.name}</span><span className="text-[10px] uppercase text-slate-500">{asset.category}</span><ImageIcon size={14} className="text-slate-400"/></button>)}<label className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-blue-300/40 px-3 py-2 text-xs text-blue-100"><Upload size={14}/>新增本機素材<input type="file" accept="image/png,image/jpeg,image/svg+xml" className="sr-only" onChange={(event) => void upload(event.target.files?.[0])}/></label>{message && <p className="text-xs leading-5 text-slate-400">{message}</p>}</div>;
}
