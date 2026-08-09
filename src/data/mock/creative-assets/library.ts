import type { CreativeAssetLibraryItem } from '@/features/creative-studio/types';
import { listUserUploadAssets } from '@/features/creative-studio/asset-upload';
import { creativeAssets } from './creative-assets';

const existingAssets: CreativeAssetLibraryItem[] = creativeAssets.map((asset) => ({
  ...asset,
  category: asset.type === 'PROPERTY_PHOTO' ? 'property' : asset.type === 'FLOOR_PLAN' ? 'floorplan' : asset.type === 'LOGO' ? 'logo' : 'icon',
}));

const placeholder = (label: string, background: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 240"><rect width="360" height="240" fill="${background}"/><text x="36" y="126" fill="#f8fafc" font-family="Arial" font-size="28" font-weight="700">${label}</text><text x="36" y="164" fill="#cbd5e1" font-family="Arial" font-size="16">MOCK ASSET LIBRARY</text></svg>`)}`;

export const creativeAssetLibrary: CreativeAssetLibraryItem[] = [
  ...existingAssets,
  { id: 'mock-agent-avatar', name: 'Demo Agent Avatar', type: 'PROPERTY_PHOTO', category: 'agent', previewDataUrl: placeholder('Agent', '#334155'), source: 'MOCK' },
  { id: 'mock-navy-background', name: 'Navy Gradient Background', type: 'PROPERTY_PHOTO', category: 'background', previewDataUrl: placeholder('Background', '#0f2747'), source: 'MOCK' },
  { id: 'mock-location-icon', name: 'Location Icon', type: 'QR_CODE', category: 'icon', previewDataUrl: placeholder('Icon', '#1e293b'), source: 'MOCK' },
];

export function listCreativeAssets(category?: CreativeAssetLibraryItem['category']) {
  const uploads: CreativeAssetLibraryItem[] = listUserUploadAssets().map((asset) => ({ id: asset.id, name: asset.name, type: 'PROPERTY_PHOTO', category: asset.category ?? 'property', previewDataUrl: asset.previewUrl, source: 'USER_UPLOAD' }));
  const allAssets = [...creativeAssetLibrary, ...uploads];
  return category ? allAssets.filter((asset) => asset.category === category) : allAssets;
}

export function getCreativeLibraryAsset(assetId: string) { return listCreativeAssets().find((asset) => asset.id === assetId); }

export function listAssetsForTemplateField(fieldId: string) {
  const category = fieldId === 'mainPhoto' ? 'property' : fieldId === 'floorPlan' ? 'floorplan' : fieldId === 'logo' ? 'logo' : 'icon';
  return listCreativeAssets(category);
}
