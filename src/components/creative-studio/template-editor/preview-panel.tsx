'use client';

import { forwardRef } from 'react';
import { Download, FileDown, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { getCreativeLibraryAsset } from '@/data/mock/creative-assets/library';
import type { CreativeProject, CreativeTemplate } from '@/features/creative-studio/types';

function elementStyle(template: CreativeTemplate, fieldId: string) {
  const element = template.layout.elements.find((item) => item.fieldId === fieldId);
  return element ? { left: `${element.x}%`, top: `${element.y}%`, width: `${element.width}%`, height: element.height ? `${element.height}%` : undefined, zIndex: element.order } : undefined;
}

export const PreviewPanel = forwardRef<HTMLDivElement, { project: CreativeProject; template: CreativeTemplate; isExporting: boolean; onExport: (type: 'PNG' | 'PDF') => void }>(({ project, template, isExporting, onExport }, ref) => {
  const values = project.fieldValues;
  const mainPhoto = getCreativeLibraryAsset(values.mainPhoto);
  const floorPlan = getCreativeLibraryAsset(values.floorPlan);
  const logo = getCreativeLibraryAsset(values.logo);
  const qrCode = getCreativeLibraryAsset(values.qrCode);
  const aspectClass = project.format === '4:5' ? 'aspect-[4/5] max-w-[560px]' : project.format === '9:16' ? 'aspect-[9/16] max-w-[460px]' : 'aspect-video max-w-4xl';
  return <section className="space-y-4"><div><p className="text-xs tracking-[.16em] text-blue-200">LIVE PREVIEW</p><h2 className="mt-1 text-xl font-semibold">即時素材預覽</h2></div><div ref={ref} className={`relative mx-auto w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl ${aspectClass}`} style={{ background: template.layout.background, color: template.layout.foreground }}><div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_8%,rgba(255,255,255,.14),transparent_22%)]"/>{mainPhoto && <Image unoptimized src={mainPhoto.previewDataUrl} alt="Mock 房屋主照片" width={800} height={560} className="absolute rounded-xl object-cover shadow-xl" style={elementStyle(template, 'mainPhoto')}/>} {logo && <Image unoptimized src={logo.previewDataUrl} alt="Mock Logo" width={800} height={560} className="absolute rounded-md object-cover" style={elementStyle(template, 'logo')}/>}<div className="absolute" style={elementStyle(template, 'title')}><p className="line-clamp-3 text-2xl font-bold leading-tight sm:text-4xl">{values.title}</p></div><div className="absolute text-xs leading-5 text-slate-200 sm:text-sm" style={elementStyle(template, 'subtitle')}>{values.subtitle}</div><div className="absolute text-lg font-semibold sm:text-2xl" style={{ ...elementStyle(template, 'price'), color: template.layout.accent }}>{values.price}</div><div className="absolute line-clamp-2 text-[10px] text-slate-300 sm:text-xs" style={elementStyle(template, 'address')}>{values.address}</div><div className="absolute text-[10px] text-slate-200 sm:text-xs" style={elementStyle(template, 'layout')}>{values.layout}</div><div className="absolute line-clamp-2 text-[9px] text-slate-300 sm:text-xs" style={elementStyle(template, 'features')}>{values.features}</div>{floorPlan && <Image unoptimized src={floorPlan.previewDataUrl} alt="Mock 平面圖" width={800} height={560} className="absolute rounded-md border border-white/20 object-cover" style={elementStyle(template, 'floorPlan')}/>} {qrCode && <Image unoptimized src={qrCode.previewDataUrl} alt="Mock QR Code" width={800} height={560} className="absolute rounded-md bg-white object-cover p-1" style={elementStyle(template, 'qrCode')}/>}<p className="absolute bottom-2 left-3 text-[8px] tracking-[.12em] text-slate-300">E.X REALTY · MOCK DATA · {template.aspectRatio}</p></div><div className="flex flex-wrap gap-3"><button type="button" disabled={isExporting} onClick={() => onExport('PNG')} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-60"><ImageIcon size={16}/>{isExporting ? '處理中…' : '匯出 PNG'}</button><button type="button" disabled={isExporting} onClick={() => onExport('PDF')} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-blue-300/30 bg-blue-300/10 px-4 py-2 text-sm text-blue-100 disabled:opacity-60"><FileDown size={16}/>匯出 PDF</button><span className="inline-flex min-h-11 items-center gap-2 text-xs text-slate-500"><Download size={14}/>瀏覽器端匯出，不會上傳素材。</span></div></section>;
});

PreviewPanel.displayName = 'PreviewPanel';
