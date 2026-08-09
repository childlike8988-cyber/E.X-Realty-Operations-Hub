'use client';

import { Download } from 'lucide-react';
import { demoReportFileName, type DemoReportContext } from '@/features/demo/demo-report';

export function DemoReportExport({ report }: { report: DemoReportContext }) {
  const exportPdf = async () => {
    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
    pdf.setFontSize(20);
    pdf.text(report.title, 48, 58);
    pdf.setFontSize(11);
    pdf.text(`Case: ${report.case.title}`, 48, 86);
    pdf.text('Source: MOCK DATA · Presentation-only report', 48, 104);
    let y = 140;
    report.steps.forEach((step, index) => { pdf.setFontSize(13); pdf.text(`${index + 1}. ${step.title}`, 48, y); y += 18; pdf.setFontSize(10); const lines = pdf.splitTextToSize(step.description, 490); pdf.text(lines, 60, y); y += lines.length * 14 + 12; });
    pdf.setFontSize(12); pdf.text('Future AI Capability — Not Enabled', 48, y); y += 18;
    pdf.setFontSize(10); pdf.text(pdf.splitTextToSize(report.futureAiCapabilities.join(' · '), 490), 60, y);
    pdf.save(demoReportFileName);
  };
  return <button type="button" onClick={() => void exportPdf()} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-950"><Download size={16} />Demo PDF Export</button>;
}
