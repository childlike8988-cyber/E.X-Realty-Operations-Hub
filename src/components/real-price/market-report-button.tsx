'use client';

import {toPng} from 'html-to-image';
import {jsPDF} from 'jspdf';
import type {RealEstateTransaction} from '@/data/mock/real-price/real-price-data';

type Summary = {count:number;average:number;highest:number;lowest:number};
const escapeHtml = (value:string|number) => String(value).replace(/[&<>"']/g,(character)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[character]!));

export function MarketReportButton({community,summary,items}:{community:string;summary:Summary;items:RealEstateTransaction[]}) {
  const exportPdf = async () => {
    const report = document.createElement('article');
    report.style.cssText = 'position:fixed;left:-10000px;top:0;width:760px;padding:48px;background:#ffffff;color:#172033;font-family:Arial,"Microsoft JhengHei",sans-serif;';
    report.innerHTML = `
      <div style="border-bottom:2px solid #c6974d;padding-bottom:16px">
        <p style="margin:0;color:#8b651f;font-size:12px;letter-spacing:1px">E.X REALTY DATA TOOLS · DEMO REPORT</p>
        <h1 style="margin:8px 0 0;font-size:30px">市場分析報告</h1>
        <p style="margin:8px 0 0;color:#526077">${escapeHtml(community || '區域市場')} · 展示版 Mock Data</p>
      </div>
      <div style="display:flex;gap:12px;margin:28px 0">
        ${[['平均單價',summary.average.toFixed(1)+' 萬/坪'],['最高單價',summary.highest.toFixed(1)+' 萬/坪'],['最低單價',summary.lowest.toFixed(1)+' 萬/坪'],['成交筆數',summary.count+' 筆']].map(([label,value])=>`<div style="flex:1;border:1px solid #d9dee8;border-radius:10px;padding:14px"><div style="font-size:12px;color:#667085">${label}</div><strong style="display:block;margin-top:6px;font-size:18px">${value}</strong></div>`).join('')}
      </div>
      <h2 style="font-size:18px">最近成交案例</h2>
      <table style="width:100%;border-collapse:collapse;font-size:13px"><thead><tr style="background:#eff3f8"><th style="padding:10px;text-align:left">日期</th><th style="padding:10px;text-align:left">樓層</th><th style="padding:10px;text-align:left">坪數</th><th style="padding:10px;text-align:left">總價</th><th style="padding:10px;text-align:left">單價</th></tr></thead><tbody>${items.slice(0,5).map(item=>`<tr><td style="padding:10px;border-bottom:1px solid #e5e7eb">${escapeHtml(item.transactionDate)}</td><td style="padding:10px;border-bottom:1px solid #e5e7eb">${escapeHtml(item.floor)}</td><td style="padding:10px;border-bottom:1px solid #e5e7eb">${escapeHtml(item.areaPing)}</td><td style="padding:10px;border-bottom:1px solid #e5e7eb">${escapeHtml(item.totalPrice)} 萬</td><td style="padding:10px;border-bottom:1px solid #e5e7eb">${escapeHtml(item.unitPrice)} 萬/坪</td></tr>`).join('')}</tbody></table>
      <p style="margin:28px 0 0;color:#667085;font-size:11px">本報告僅使用展示假資料，不代表政府實價登錄或任何真實市場行情。</p>`;
    document.body.appendChild(report);
    try {
      const image = await toPng(report,{backgroundColor:'#ffffff',pixelRatio:2});
      const pdf = new jsPDF({unit:'pt',format:'a4'});
      const width = 540;
      pdf.addImage(image,'PNG',28,28,width,(width / 760) * report.offsetHeight);
      pdf.save(`ex-realty-market-report-${Date.now()}.pdf`);
    } finally {
      report.remove();
    }
  };

  return <button onClick={exportPdf} className="rounded-lg border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-sm text-amber-100">匯出市場分析報告 PDF</button>;
}
