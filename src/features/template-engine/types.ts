export type TemplateKind='award'|'announcement';
export type TemplateField={id:string;label:string;type:'text'|'textarea'|'image'|'date';placeholder?:string};
export type Template={id:string;name:string;kind:TemplateKind;category:string;fields:TemplateField[]};
export type TemplateProject={id:string;title:string;templateId:string;data:Record<string,string>;status:'DRAFT'|'EXPORTED';createdAt:string;updatedAt:string;deletedAt?:string};
export type ExportJob={id:string;projectId:string;type:'PNG'|'PDF';status:'QUEUED'|'DONE'|'FAILED';createdAt:string};
