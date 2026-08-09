import { DemoPresentationMode } from '@/components/demo/demo-presentation-mode';
import { demoCases } from '@/features/demo/demo-flow';

export function generateStaticParams() { return demoCases.map((demoCase) => ({ caseId: demoCase.caseId })); }
export default async function DemoCasePage({ params }: { params: Promise<{ caseId: string }> }) { const { caseId } = await params; return <DemoPresentationMode caseId={caseId} />; }
