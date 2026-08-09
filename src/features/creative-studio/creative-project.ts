import { createTemplateFieldValues } from './template-engine';
import type { CreativeContext, CreativeProject, CreativeTemplate, TemplateFieldValues } from './types';

export function createCreativeProject({ propertyId, template, context, fieldValues, status = 'DRAFT' }: { propertyId: string; template: CreativeTemplate; context: CreativeContext; fieldValues?: TemplateFieldValues; status?: CreativeProject['status'] }): CreativeProject {
  const values = fieldValues ?? createTemplateFieldValues(context, template);
  return {
    id: `creative-${propertyId}-${template.id}`,
    name: `${context.propertyName} · ${template.name}`,
    propertyId,
    templateId: template.id,
    format: template.aspectRatio,
    content: context,
    fieldValues: values,
    assets: template.fields.filter((field) => field.type === 'image').map((field) => values[field.id]).filter(Boolean),
    status,
    source: 'MOCK',
  };
}
