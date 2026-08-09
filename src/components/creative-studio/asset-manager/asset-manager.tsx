'use client';

import Image from 'next/image';
import { Eye, Search, Trash2, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { listCreativeAssets } from '@/data/mock/creative-assets/library';
import { deleteUserUploadAsset, uploadCreativeAsset } from '@/features/creative-studio/asset-upload';
import type { CreativeAssetCategory, CreativeAssetLibraryItem } from '@/features/creative-studio/types';

const categories: Array<'ALL' | CreativeAssetCategory> = ['ALL', 'logo', 'agent', 'property', 'floorplan', 'background', 'icon'];

export function AssetManager() {
  const [category, setCategory] = useState<(typeof categories)[number]>('ALL');
  const [query, setQuery] = useState('');
  const [, setRevision] = useState(0);
  const [preview, setPreview] = useState<CreativeAssetLibraryItem | null>(null);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const keyword = query.trim().toLocaleLowerCase();
  const assets = listCreativeAssets(category === 'ALL' ? undefined : category).filter((asset) => !keyword || asset.name.toLocaleLowerCase().includes(keyword));

  const remove = (asset: CreativeAssetLibraryItem) => {
    if (asset.source !== 'USER_UPLOAD') return;
    if (!window.confirm(`確定要刪除使用者上傳素材「${asset.name}」嗎？此操作只影響目前瀏覽器。`)) return;
    deleteUserUploadAsset(asset.id);
    setPreview(null);
    setRevision((value) => value + 1);
    setMessage('已刪除使用者上傳素材。');
  };

  const upload = async (file: File | undefined) => {
    if (!file) return;
    try {
      await uploadCreativeAsset(file, category === 'ALL' ? 'property' : category);
      setRevision((value) => value + 1);
      setMessage('素材已儲存至目前瀏覽器。');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '無法加入素材。');
    }
  };

  return (
    <section className="rounded-2xl border border-slate-700 bg-slate-900/35 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><p className="text-xs tracking-[.16em] text-blue-200">ASSET MANAGER</p><h2 className="mt-1 text-xl font-semibold">素材管理</h2></div>
        <button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-blue-300/30 px-3 text-sm text-blue-100"><Upload size={15} />加入素材</button>
        <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/svg+xml" className="sr-only" onChange={(event) => void upload(event.target.files?.[0])} />
      </div>
      <p className="mt-2 text-xs text-slate-500">Mock Asset 無法刪除；使用者上傳素材僅存於目前瀏覽器。PNG、JPG、SVG 最大 2 MB。</p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <label className="relative min-w-0 flex-1"><Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜尋素材名稱" className="min-h-10 w-full rounded-lg border border-slate-700 bg-slate-950 py-2 pl-9 pr-3 text-sm text-slate-100" /></label>
        <select value={category} onChange={(event) => setCategory(event.target.value as typeof category)} className="min-h-10 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-slate-200">{categories.map((item) => <option key={item} value={item}>{item === 'ALL' ? '全部分類' : item}</option>)}</select>
      </div>
      {message && <p className="mt-3 text-xs text-slate-400">{message}</p>}
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {assets.map((asset) => <article key={asset.id} className="rounded-xl border border-slate-700 p-3"><Image unoptimized src={asset.previewDataUrl} alt={asset.name} width={360} height={240} className="h-28 w-full rounded-lg object-cover" /><div className="mt-3 flex items-start justify-between gap-2"><div className="min-w-0"><p className="truncate text-sm text-slate-100">{asset.name}</p><p className="mt-1 text-xs text-slate-500">{asset.category} · {asset.source}</p></div><div className="flex gap-1"><button type="button" aria-label={`預覽 ${asset.name}`} onClick={() => setPreview(asset)} className="grid h-8 w-8 place-items-center rounded border border-slate-600 text-blue-100"><Eye size={14} /></button>{asset.source === 'USER_UPLOAD' && <button type="button" aria-label={`刪除 ${asset.name}`} onClick={() => remove(asset)} className="grid h-8 w-8 place-items-center rounded border border-red-300/30 text-red-200"><Trash2 size={14} /></button>}</div></div></article>)}
      </div>
      {!assets.length && <p className="mt-5 text-sm text-slate-500">找不到符合條件的素材。</p>}
      {preview && <div role="dialog" aria-modal="true" aria-label="素材預覽" className="fixed inset-0 z-50 grid place-items-center bg-slate-950/80 p-5"><article className="relative w-full max-w-3xl rounded-2xl border border-slate-600 bg-slate-900 p-5"><button type="button" aria-label="關閉預覽" onClick={() => setPreview(null)} className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded border border-slate-600"><X size={16} /></button><p className="pr-10 text-sm text-slate-300">{preview.name}</p><Image unoptimized src={preview.previewDataUrl} alt={preview.name} width={900} height={600} className="mt-4 max-h-[70vh] w-full rounded-xl object-contain" /></article></div>}
    </section>
  );
}
