'use client';

import { ChevronLeft, ChevronRight, LogOut, Printer } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { mockProperties } from '@/data/mock/property/property-data';
import { adaptPropertyToMarketReport } from '@/features/property-report/report-adapter';
import { PropertyReportPage } from './property-report-page';

export function PropertyReportPresentation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCaseId = searchParams.get('caseId') ?? mockProperties[0].realPriceCaseId;
  const [propertyId, setPropertyId] = useState(() => mockProperties.find((item) => item.realPriceCaseId === initialCaseId)?.id ?? mockProperties[0].id);
  const [pageIndex, setPageIndex] = useState(0);
  const property = mockProperties.find((item) => item.id === propertyId) ?? mockProperties[0];
  const report = useMemo(() => adaptPropertyToMarketReport(property), [property]);
  useEffect(() => { const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'ArrowRight') setPageIndex((index) => Math.min(report.sections.length - 1, index + 1)); if (event.key === 'ArrowLeft') setPageIndex((index) => Math.max(0, index - 1)); if (event.key === 'Escape') router.push('/tools/property-report'); }; window.addEventListener('keydown', onKeyDown); return () => window.removeEventListener('keydown', onKeyDown); }, [report.sections.length, router]);
  const section = report.sections[pageIndex];
  return <div className="property-report-presentation"><header className="property-report-presentation-header"><div><span className="property-report-presentation-kicker">E.X REALTY · CLIENT PRESENTATION</span><strong>{property.title}</strong></div><div className="property-report-presentation-case-select"><label htmlFor="presentation-case">案例</label><select id="presentation-case" value={property.id} onChange={(event) => { setPropertyId(event.target.value); setPageIndex(0); }}>{mockProperties.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></div><div className="property-report-presentation-header-actions"><span>{pageIndex + 1} / {report.sections.length}</span><button type="button" aria-label="列印報告" onClick={() => window.print()}><Printer size={16} /></button><button type="button" aria-label="離開展示" onClick={() => router.push('/tools/property-report')}><LogOut size={16} /></button></div></header><main className="property-report-presentation-main"><PropertyReportPage report={report} section={section} presentation /></main><footer className="property-report-presentation-footer"><button type="button" onClick={() => setPageIndex((index) => Math.max(0, index - 1))} disabled={pageIndex === 0}><ChevronLeft size={18} />上一頁</button><div className="property-report-presentation-progress" aria-label={`報告進度 ${pageIndex + 1} / ${report.sections.length}`}>{report.sections.map((item, index) => <button type="button" key={item.id} className={index === pageIndex ? 'active' : ''} aria-label={`前往第 ${index + 1} 頁`} onClick={() => setPageIndex(index)} />)}</div><button type="button" onClick={() => setPageIndex((index) => Math.min(report.sections.length - 1, index + 1))} disabled={pageIndex === report.sections.length - 1}>下一頁<ChevronRight size={18} /></button></footer></div>;
}

