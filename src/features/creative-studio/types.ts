import type {PropertyMarketingContent, PropertyMarketingContext} from '@/features/property-marketing/types';

export type CreativeFormat = '16:9' | '4:5' | '9:16';
export type CreativeProjectStatus = 'DRAFT' | 'EDITING' | 'READY' | 'EXPORTED';

export type CreativeContext = {
  propertyName: string;
  propertySummary: string;
  marketingContent: PropertyMarketingContent;
  sellingPoints: string[];
  targetAudience: string;
  brandInfo: {companyName:string;brandMessage:string;primaryColor:string;secondaryColor:string;};
  suggestedVisualStyle: string;
  imagePromptDraft: string;
  videoConceptDraft: string;
  source: 'MOCK';
};

export type TemplateFieldType = 'text' | 'image';

export type TemplateField = {
  id: string;
  label: string;
  type: TemplateFieldType;
  order: number;
  placeholder: string;
  defaultValue: string;
};

export type TemplateLayoutElement = {
  fieldId: string;
  type: TemplateFieldType;
  order: number;
  x: number;
  y: number;
  width: number;
  height?: number;
};

export type TemplateSchema = {
  id: string;
  name: string;
  category: 'Property Social Templates';
  aspectRatio: CreativeFormat;
  preview: string;
  fields: TemplateField[];
  layout: {
    background: string;
    foreground: string;
    accent: string;
    elements: TemplateLayoutElement[];
  };
};

export type CreativeTemplate = TemplateSchema;
export type TemplateFieldValues = Record<string, string>;

export type CreativeAsset = {
  id: string;
  name: string;
  type: 'PROPERTY_PHOTO' | 'FLOOR_PLAN' | 'LOGO' | 'QR_CODE';
  previewDataUrl: string;
  source: 'MOCK' | 'USER_UPLOAD';
};

export type CreativeAssetCategory = 'logo' | 'agent' | 'property' | 'floorplan' | 'background' | 'icon';

export type CreativeAssetLibraryItem = CreativeAsset & {
  category: CreativeAssetCategory;
};

export type CreativeProjectHistoryEntry = {
  projectId: string;
  action: 'SAVED' | 'EDITED' | 'EXPORTED' | 'DELETED';
  timestamp: string;
  description: string;
};

export type CreativeExportRecord = {
  filename: string;
  format: 'PNG' | 'PDF';
  template: string;
  projectId: string;
  time: string;
};

export type AssetUploadResult = {
  id: string;
  name: string;
  type: string;
  size: number;
  previewUrl: string;
  category?: CreativeAssetCategory;
  source: 'USER_UPLOAD';
};

export type BrandKit = {
  companyName: string;
  branchName: string;
  logo: string;
  agentName: string;
  phone: string;
  qrCode: string;
  primaryColor: string;
  secondaryColor: string;
  source: 'MOCK';
};

export type CreativeProject = {
  id: string;
  name: string;
  propertyId: string;
  templateId: string;
  format: CreativeFormat;
  content: CreativeContext;
  fieldValues: TemplateFieldValues;
  assets: string[];
  status: CreativeProjectStatus;
  source: 'MOCK';
  createdAt?: string;
  updatedAt?: string;
  exportedAt?: string;
};

export type ImageGenerationRequest = {
  prompt: string;
  referenceImages: string[];
  style: string;
  aspectRatio: CreativeFormat;
  credits: number;
};

export type MockImageGenerationResponse = {
  id: string;
  status: 'MOCK_COMPLETED';
  request: ImageGenerationRequest;
  mockImageDataUrl: string;
  source: 'MOCK';
};

export type CreditAction = 'FREE_TEMPLATE' | 'AI_IMAGE_GENERATION' | 'IMAGE_EDIT' | 'ADVANCED_EDIT';

export type CreativeStudioInput = {propertyId:string;marketingContext:PropertyMarketingContext;marketingContent:PropertyMarketingContent;};
