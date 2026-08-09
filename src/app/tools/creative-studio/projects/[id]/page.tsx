import { ProjectDetail } from '@/components/creative-studio/project-dashboard/project-detail';
import { creativeTemplates } from '@/features/creative-studio/template-engine';
import { mockProperties } from '@/features/property-intelligence/mock-properties';

export function generateStaticParams() {
  return mockProperties.flatMap((property) => creativeTemplates.map((template) => ({ id: `creative-${property.id}-${template.id}` })));
}

export default async function CreativeProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProjectDetail projectId={id}/>;
}
