import type { CreativeAsset } from '@/features/creative-studio/types';

function svgDataUrl(label: string, background: string, foreground = '#f8fafc') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 560"><rect width="800" height="560" fill="${background}"/><circle cx="655" cy="115" r="128" fill="#f4c96a" opacity=".22"/><rect x="62" y="76" width="676" height="370" rx="24" fill="#0f172a" opacity=".42"/><text x="70" y="245" fill="${foreground}" font-family="Arial" font-size="45" font-weight="700">${label}</text><text x="70" y="305" fill="#cbd5e1" font-family="Arial" font-size="24">MOCK CREATIVE ASSET</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export const creativeAssets: CreativeAsset[] = [
  { id: 'mock-house-gushan', name: '鼓山住宅主照片', type: 'PROPERTY_PHOTO', previewDataUrl: svgDataUrl('Gushan Residence', '#264b66'), source: 'MOCK' },
  { id: 'mock-house-zuoying', name: '左營住宅主照片', type: 'PROPERTY_PHOTO', previewDataUrl: svgDataUrl('Zuoying Residence', '#3b4a75'), source: 'MOCK' },
  { id: 'mock-house-fengshan', name: '鳳山住宅主照片', type: 'PROPERTY_PHOTO', previewDataUrl: svgDataUrl('Fengshan Residence', '#4d3d68'), source: 'MOCK' },
  { id: 'mock-floor-plan', name: '三房平面圖', type: 'FLOOR_PLAN', previewDataUrl: svgDataUrl('Floor Plan', '#475569'), source: 'MOCK' },
  { id: 'mock-logo', name: 'E.X Realty Logo', type: 'LOGO', previewDataUrl: svgDataUrl('E.X', '#0f2747'), source: 'MOCK' },
  { id: 'mock-qr-code', name: 'E.X Contact QR', type: 'QR_CODE', previewDataUrl: svgDataUrl('QR', '#111827'), source: 'MOCK' },
];

export function getCreativeAsset(assetId: string) {
  return creativeAssets.find((asset) => asset.id === assetId);
}
