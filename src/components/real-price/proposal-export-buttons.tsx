'use client';

import {FileDown,ImageDown} from 'lucide-react';
import {toPng} from 'html-to-image';
import {jsPDF} from 'jspdf';

export function ProposalExportButtons({targetRef}:{targetRef:React.RefObject<HTMLDivElement|null>}) {
  const exportProposal = async (type:'PNG'|'PDF') => {
    const target = targetRef.current;
    if (!target) return;
    await document.fonts.ready;
    const dataUrl = await toPng(target,{backgroundColor:'#0a1323',pixelRatio:2,cacheBust:true});
    const stamp = Date.now();
    if (type === 'PNG') { const link=document.createElement('a'); link.download=`ex-realty-proposal-${stamp}.png`; link.href=dataUrl; link.click(); return; }
    const pdf = new jsPDF({orientation:'landscape',unit:'px',format:[1600,900]});
    pdf.addImage(dataUrl,'PNG',0,0,1600,900);
    pdf.save(`ex-realty-proposal-${stamp}.pdf`);
  };
  return <div className="flex flex-wrap gap-2"><button onClick={()=>exportProposal('PNG')} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-blue-300/30 bg-blue-300/10 px-4 py-2 text-sm text-blue-100"><ImageDown size={16}/>匯出 PNG</button><button onClick={()=>exportProposal('PDF')} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-sm text-amber-100"><FileDown size={16}/>匯出 PDF</button></div>;
}
