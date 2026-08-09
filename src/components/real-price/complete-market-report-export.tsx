'use client';

import {useState} from 'react';
import {FileDown,LoaderCircle} from 'lucide-react';
import {toPng} from 'html-to-image';
import {jsPDF} from 'jspdf';
import type {CompleteMarketReport} from '@/features/real-price/demo-presentation';

function escapeHtml(value:string) {
  return value.replace(/[&<>'"]/g,(character) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[character] ?? character));
}

export function CompleteMarketReportExport({report}:{report:CompleteMarketReport}) {
  const [isExporting,setIsExporting] = useState(false);

  const exportReport = async () => {
    if(isExporting) return;
    setIsExporting(true);
    try {
      await document.fonts.ready;
      const pdf = new jsPDF({orientation:'landscape',unit:'px',format:[1600,900]});
      for(const [index,section] of report.sections.entries()) {
        const page = document.createElement('article');
        page.style.cssText = 'position:fixed;left:-10000px;top:0;width:1200px;height:675px;box-sizing:border-box;padding:64px;overflow:hidden;color:#f8fafc;background:radial-gradient(circle at 82% 10%,rgba(126,167,255,.35),transparent 24%),linear-gradient(135deg,#091425,#152d4d 55%,#111a2d);font-family:Arial,"Noto Sans TC",sans-serif;';
        page.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;color:#b9d2ff;font-size:14px;letter-spacing:.18em"><span>E.X REALTY DATA TOOLS</span><span>${String(index + 1).padStart(2,'0')} / ${String(report.sections.length).padStart(2,'0')}</span></div><div style="margin-top:96px;max-width:950px"><p style="margin:0;color:#f4c96a;font-size:17px;letter-spacing:.14em">MARKET PROPOSAL PACKAGE</p><h1 style="margin:18px 0 10px;font-size:48px;line-height:1.2">${escapeHtml(section.title)}</h1><p style="margin:0;color:#cbd5e1;font-size:24px">${escapeHtml(section.subtitle)}</p><ul style="display:grid;gap:18px;margin:58px 0 0;padding:0;list-style:none">${section.highlights.map((item) => `<li style="padding:18px 22px;border:1px solid rgba(255,255,255,.18);border-radius:14px;background:rgba(15,23,42,.38);font-size:22px;line-height:1.45">${escapeHtml(item)}</li>`).join('')}</ul></div><p style="position:absolute;left:64px;bottom:44px;margin:0;color:#94a3b8;font-size:14px">資料來源：Mock Data｜僅供展示，不代表正式實價登錄或估價建議。</p>`;
        document.body.appendChild(page);
        try {
          const image = await toPng(page,{backgroundColor:'#091425',pixelRatio:2,cacheBust:true});
          if(index > 0) pdf.addPage([1600,900],'landscape');
          pdf.addImage(image,'PNG',0,0,1600,900);
        } finally {
          page.remove();
        }
      }
      pdf.save(`${report.fileBaseName}.pdf`);
    } finally {
      setIsExporting(false);
    }
  };

  return <button type="button" onClick={exportReport} disabled={isExporting} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-950 disabled:cursor-wait disabled:opacity-70"><>{isExporting ? <LoaderCircle className="animate-spin" size={16}/> : <FileDown size={16}/>}</>匯出完整市場報告 PDF</button>;
}
