import type { AssetUploadResult, CreativeAssetCategory } from './types';

const USER_ASSET_STORAGE_KEY = 'ex-realty-creative-user-assets-v1';
const acceptedTypes = new Set(['image/png', 'image/jpeg', 'image/svg+xml']);
const MAX_UPLOAD_SIZE = 2 * 1024 * 1024;
let memoryAssets: AssetUploadResult[] = [];

function readAssets(): AssetUploadResult[] {
  if (typeof window === 'undefined') return memoryAssets;
  try { const raw = window.localStorage.getItem(USER_ASSET_STORAGE_KEY); return raw ? JSON.parse(raw) as AssetUploadResult[] : []; } catch { return []; }
}

function writeAssets(assets: AssetUploadResult[]) {
  if (typeof window === 'undefined') { memoryAssets = assets; return; }
  window.localStorage.setItem(USER_ASSET_STORAGE_KEY, JSON.stringify(assets));
}

export function saveUserUploadAsset(asset: AssetUploadResult) {
  const next = [asset, ...readAssets().filter((item) => item.id !== asset.id)].slice(0, 30);
  writeAssets(next);
  return asset;
}

export function listUserUploadAssets() { return readAssets(); }
export function deleteUserUploadAsset(assetId: string) { const assets = readAssets(); const exists = assets.some((asset) => asset.id === assetId); writeAssets(assets.filter((asset) => asset.id !== assetId)); return exists; }
function readFileAsDataUrl(file: File) { return new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(new Error('Unable to read asset file.')); reader.readAsDataURL(file); }); }

export async function uploadCreativeAsset(file: File, category: CreativeAssetCategory = 'property'): Promise<AssetUploadResult> {
  if (!acceptedTypes.has(file.type)) throw new Error('Only PNG, JPG, and SVG files are supported.');
  if (file.size > MAX_UPLOAD_SIZE) throw new Error('Asset must be 2 MB or smaller for local browser storage.');
  const asset: AssetUploadResult = { id: `user-asset-${crypto.randomUUID()}`, name: file.name, type: file.type, size: file.size, previewUrl: await readFileAsDataUrl(file), category, source: 'USER_UPLOAD' };
  return saveUserUploadAsset(asset);
}
