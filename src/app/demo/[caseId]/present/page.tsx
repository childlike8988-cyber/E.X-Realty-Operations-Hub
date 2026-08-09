import { FullscreenPresentation } from '@/components/demo/fullscreen-presentation';
import { demoCases } from '@/features/demo/demo-flow';

export function generateStaticParams() { return demoCases.map((demoCase) => ({ caseId: demoCase.caseId })); }
export default async function DemoPresentPage({ params }: { params: Promise<{ caseId: string }> }) { const { caseId } = await params; return <FullscreenPresentation caseId={caseId} />; }
