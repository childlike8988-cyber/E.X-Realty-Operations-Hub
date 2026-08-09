'use client';

import {toPng} from 'html-to-image';
import {jsPDF} from 'jspdf';
import type {CommunitySummary, RealEstateTransaction, RealPriceQuery} from '@/features/real-price/types';

type Summary = {count:number;average:number;highest:number;lowest:number};
const escapeHtml = (value:string|number) => String(value).replace(/[&<>"']/g,(character)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[character]!));

export function MarketReportButton({query,community,summary,communitySummary,items}:{query:RealPriceQuery;community:string;summary:Summary;communitySummary:CommunitySummary;items:readonly RealEstateTransaction[]}) {
  const exportPdf = async () => {
    const report = document.createElement('article');
    report.style.cssText = 'position:fixed;left:-10000px;top:0;width:760px;padding:48px;background:#ffffff;color:#172033;font-family:Arial,"Microsoft JhengHei",sans-serif;';
    const generatedAt = new Intl.DateTimeFormat('zh-TW',{dateStyle:'medium',timeStyle:'short'}).format(new Date());
    const conditions = [
      ['行政區',query.city || '全部'],['區域',query.district || '全部'],['路段',query.road || '未指定'],['社區',query.community || '未指定'],['地址',query.addressKeyword || '未指定'],['屋齡',query.ageRange || '全部'],['資料來源','Mock Data'],
    ].map(([label,value])=>`<span style="display:inline-block;margin:0 12px 8px 0;color:#526077;font-size:12px">${escapeHtml(label)}：${escapeHtml(value)}</span>`).join('');
    const maxPrice = Math.max(...items.map((item)=>item.unitPrice));
    const trend = [...items].sort((a,b)=>a.transactionDate.localeCompare(b.transactionDate)).map((item)=>`<div style="flex:1;min-width:26px;text-align:center"><div style="height:${Math.max(18,Math.round((item.unitPrice / maxPrice) * 84))}px;background:#5d88df;border-radius:5px 5px 0 0"></div><span style="display:block;margin-top:5px;color:#667085;font-size:9px">${escapeHtml(item.transactionDate.slice(5))}</span></div>`).join('');
    report.innerHTML = `
      <div style="border-bottom:2px solid #c6974d;padding-bottom:16px">
        <p style="margin:0;color:#8b651f;font-size:12px;letter-spacing:1px">E.X REALTY DATA TOOLS · DEMO REPORT</p>
        <h1 style="margin:8px 0 0;font-size:30px">市場分析報告</h1>
        <p style="margin:8px 0 0;color:#526077">${escapeHtml(community || '區域市場')} · 展示版 Mock Data</p>
      </div>
      <div style="margin-top:18px">${conditions}<p style="margin:4px 0 0;color:#667085;font-size:11px">產生時間：${escapeHtml(generatedAt)}</p></div>
      <div style="display:flex;gap:12px;margin:28px 0">
        ${[['平均單價',summary.average.toFixed(1)+' 萬/坪'],['最高單價',summary.highest.toFixed(1)+' 萬/坪'],['最低單價',summary.lowest.toFixed(1)+' 萬/坪'],['成交筆數',summary.count+' 筆']].map(([label,value])=>`<div style="flex:1;border:1px solid #d9dee8;border-radius:10px;padding:14px"><div style="font-size:12px;color:#667085">${label}</div><strong style="display:block;margin-top:6px;font-size:18px">${value}</strong></div>`).join('')}
      </div>
      <h2 style="font-size:18px">價格趨勢</h2>
      <div style="display:flex;align-items:flex-end;gap:5px;height:120px;margin:12px 0 28px;padding:14px;background:#f4f7fb;border-radius:10px">${trend}</div>
      <h2 style="font-size:18px">社區分析</h2>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:12px 0 28px">${[['成交筆數',`${communitySummary.transactionCount} 筆`],['平均單價',`${communitySummary.averageUnitPrice.toFixed(1)} 萬/坪`],['平均總價',`${communitySummary.averageTotalPrice.toLocaleString()} 萬`],['平均屋齡',`${communitySummary.averageBuildingAge.toFixed(1)} 年`]].map(([label,value])=>`<div style="border:1px solid #d9dee8;border-radius:8px;padding:10px"><div style="font-size:11px;color:#667085">${label}</div><strong style="display:block;margin-top:5px;font-size:14px">${value}</strong></div>`).join('')}</div>
      <h2 style="font-size:18px">最近成交案例</h2>
      <table style="width:100%;border-collapse:collapse;font-size:13px"><thead><tr style="background:#eff3f8"><th style="padding:10px;text-align:left">日期</th><th style="padding:10px;text-align:left">樓層</th><th style="padding:10px;text-align:left">坪數</th><th style="padding:10px;text-align:left">總價</th><th style="padding:10px;text-align:left">單價</th></tr></thead><tbody>${items.slice(0,5).map(item=>`<tr><td style="padding:10px;border-bottom:1px solid #e5e7eb">${escapeHtml(item.transactionDate)}</td><td style="padding:10px;border-bottom:1px solid #e5e7eb">${escapeHtml(item.floor)}</td><td style="padding:10px;border-bottom:1px solid #e5e7eb">${escapeHtml(item.areaPing)}</td><td style="padding:10px;border-bottom:1px solid #e5e7eb">${escapeHtml(item.totalPrice)} 萬</td><td style="padding:10px;border-bottom:1px solid #e5e7eb">${escapeHtml(item.unitPrice)} 萬/坪</td></tr>`).join('')}</tbody></table>
      <p style="margin:28px 0 0;color:#667085;font-size:11px">資料來源：Mock Data。本報告僅使用展示假資料，不代表政府實價登錄或任何真實市場行情。</p>`;
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
