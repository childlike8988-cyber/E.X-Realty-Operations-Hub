import type { BrandKit } from './types';

const BRAND_KIT_STORAGE_KEY = 'ex-realty-creative-brand-kit-v1';
export const mockBrandKit: BrandKit = { companyName: 'E.X Realty Data Tools', branchName: 'Demo Branch', logo: 'mock-logo', agentName: 'Demo Agent', phone: '0000-000-000', qrCode: 'mock-qr-code', primaryColor: '#0f2747', secondaryColor: '#f4c96a', source: 'MOCK' };
let memoryBrandKit = mockBrandKit;

export function getBrandKit() {
  if (typeof window === 'undefined') return memoryBrandKit;
  try { const raw = window.localStorage.getItem(BRAND_KIT_STORAGE_KEY); return raw ? { ...mockBrandKit, ...JSON.parse(raw) as Partial<BrandKit>, source: 'MOCK' as const } : mockBrandKit; } catch { return mockBrandKit; }
}

export function saveBrandKit(input: Omit<BrandKit, 'source'>) {
  const kit: BrandKit = { ...input, source: 'MOCK' };
  if (typeof window === 'undefined') memoryBrandKit = kit;
  else window.localStorage.setItem(BRAND_KIT_STORAGE_KEY, JSON.stringify(kit));
  return kit;
}
