import type { CreativeContext, CreativeTemplate, TemplateField, TemplateFieldValues } from './types';

const fields: TemplateField[] = [
  { id: 'title', label: '標題', type: 'text', order: 1, placeholder: '輸入主標題', defaultValue: '' },
  { id: 'subtitle', label: '副標', type: 'text', order: 2, placeholder: '輸入副標', defaultValue: '' },
  { id: 'price', label: '價格', type: 'text', order: 3, placeholder: '例如：2,188 萬', defaultValue: '價格請洽專人' },
  { id: 'address', label: '地址', type: 'text', order: 4, placeholder: '輸入物件地址', defaultValue: '' },
  { id: 'layout', label: '房型', type: 'text', order: 5, placeholder: '例如：3 房 2 廳 2 衛', defaultValue: '' },
  { id: 'features', label: '特色', type: 'text', order: 6, placeholder: '以 · 分隔特色', defaultValue: '' },
  { id: 'mainPhoto', label: '主照片', type: 'image', order: 7, placeholder: '選擇 Mock 房屋照片', defaultValue: 'mock-house-gushan' },
  { id: 'floorPlan', label: '平面圖', type: 'image', order: 8, placeholder: '選擇 Mock 平面圖', defaultValue: 'mock-floor-plan' },
  { id: 'logo', label: 'Logo', type: 'image', order: 9, placeholder: '選擇 Mock Logo', defaultValue: 'mock-logo' },
  { id: 'qrCode', label: 'QR Code', type: 'image', order: 10, placeholder: '選擇 Mock QR Code', defaultValue: 'mock-qr-code' },
];

function createTemplate(id: string, name: string, aspectRatio: CreativeTemplate['aspectRatio'], preview: string, background: string, accent: string): CreativeTemplate {
  return {
    id,
    name,
    category: 'Property Social Templates',
    aspectRatio,
    preview,
    fields,
    layout: {
      background,
      foreground: '#f8fafc',
      accent,
      elements: [
        { fieldId: 'mainPhoto', type: 'image', order: 1, x: 56, y: 5, width: 39, height: 58 },
        { fieldId: 'logo', type: 'image', order: 2, x: 6, y: 7, width: 16, height: 10 },
        { fieldId: 'title', type: 'text', order: 3, x: 7, y: 25, width: 48 },
        { fieldId: 'subtitle', type: 'text', order: 4, x: 7, y: 45, width: 45 },
        { fieldId: 'price', type: 'text', order: 5, x: 7, y: 60, width: 34 },
        { fieldId: 'address', type: 'text', order: 6, x: 7, y: 72, width: 52 },
        { fieldId: 'layout', type: 'text', order: 7, x: 7, y: 80, width: 50 },
        { fieldId: 'features', type: 'text', order: 8, x: 7, y: 88, width: 64 },
        { fieldId: 'floorPlan', type: 'image', order: 9, x: 76, y: 68, width: 18, height: 16 },
        { fieldId: 'qrCode', type: 'image', order: 10, x: 82, y: 86, width: 12, height: 10 },
      ],
    },
  };
}

export const creativeTemplates: CreativeTemplate[] = [
  createTemplate('facebook-property-post', 'Facebook Property Post', '16:9', 'facebook', '#091425', '#f4c96a'),
  createTemplate('instagram-property-post', 'Instagram Property Post', '4:5', 'instagram', '#16233d', '#d9a8ff'),
  createTemplate('instagram-story', 'Instagram Story', '9:16', 'story', '#102342', '#7ea7ff'),
  createTemplate('tv-wall-banner', 'TV Wall Banner', '16:9', 'tv-wall', '#111827', '#f4c96a'),
  createTemplate('cover-591', '591 Cover', '16:9', 'cover', '#14283a', '#75d4b1'),
];

export function createTemplateFieldValues(context: CreativeContext, template: CreativeTemplate): TemplateFieldValues {
  const defaults: TemplateFieldValues = {
    title: context.propertyName,
    subtitle: context.marketingContent.listing591.subtitle ?? context.targetAudience,
    price: '價格請洽專人',
    address: context.propertySummary,
    layout: context.propertySummary.split('，')[0] ?? context.propertySummary,
    features: context.sellingPoints.slice(0, 3).join(' · '),
    mainPhoto: 'mock-house-gushan',
    floorPlan: 'mock-floor-plan',
    logo: 'mock-logo',
    qrCode: 'mock-qr-code',
  };
  return Object.fromEntries(template.fields.map((field) => [field.id, defaults[field.id] || field.defaultValue]));
}

export function updateTemplateFieldValue(values: TemplateFieldValues, fieldId: string, value: string): TemplateFieldValues {
  return { ...values, [fieldId]: value };
}

export function getCreativeTemplate(templateId:string):CreativeTemplate {
  const template = creativeTemplates.find((item) => item.id === templateId);
  if(!template) throw new Error(`Unknown creative template: ${templateId}`);
  return template;
}
