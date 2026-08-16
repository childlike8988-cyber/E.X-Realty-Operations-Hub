import { Suspense } from 'react';
import { PropertyReportPresentation } from '@/components/property-report/property-report-presentation';

export default function PropertyMarketReportPresentationPage() {
  return <Suspense fallback={<div className="property-report-presentation-loading">Loading client presentation…</div>}><PropertyReportPresentation /></Suspense>;
}

