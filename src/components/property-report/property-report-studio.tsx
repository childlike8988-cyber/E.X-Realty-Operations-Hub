'use client';

import Link from 'next/link';
import { FileDown, Maximize2, Printer } from 'lucide-react';
import { useMemo, useState } from 'react';
import { mockProperties } from '@/data/mock/property/property-data';
import { adaptPropertyToMarketReport } from '@/features/property-report/report-adapter';
import { PROPERTY_REPORT_PAGE_COUNT } from '@/features/property-report/report-template';
import { PropertyReportPage } from './property-report-page';

export function PropertyReportStudio() {
  const [propertyId, setPropertyId] = useState(mockProperties[0].id);
  const property = mockProperties.find((item) => item.id === propertyId) ?? mockProperties[0];
  const report = useMemo(() => adaptPropertyToMarketReport(property), [property]);
  return <div className="property-report-shell"><section className="property-report-toolbar"><div><p className="property-report-eyebrow">REALTY DATA TOOLS · CLIENT REPORT</p><h1>Property Market Report</h1><p>房產市場智慧報告</p><span>從物件、行情、區域到銷售定位，一次完成客戶提案</span></div><div className="property-report-actions"><label htmlFor="property-report-case">Demo Case</label><select id="property-report-case" value={property.id} onChange={(event) => setPropertyId(event.target.value)}>{mockProperties.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select><div className="property-report-action-row"><button type="button" onClick={() => window.print()}><Printer size={16} />列印 / Save as PDF</button><Link href={`/tools/property-report/present?caseId=${property.realPriceCaseId}`}><Maximize2 size={16} />Presentation</Link><button type="button" onClick={() => window.print()}><FileDown size={16} />Export PDF</button></div></div></section><section className="property-report-intro"><div><strong>{PROPERTY_REPORT_PAGE_COUNT} 頁固定報告架構</strong><span>每頁保留清楚結論、核心數字與資料來源。</span></div><div className="property-report-labels">{report.sourceLabels.map((label) => <span key={label}>{label}</span>)}</div></section><div className="property-report-pages">{report.sections.map((section) => <PropertyReportPage key={section.id} report={report} section={section} />)}</div></div>;
}

