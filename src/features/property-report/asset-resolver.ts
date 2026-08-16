import type { ReportAsset, ReportAssetKind } from './types';

type CaseAssetPaths = {
  property: string[];
  floorplan: string;
  map: string;
  location: string;
};

const ASSET_ROOT = 'report-assets/v1.3-client-presentation';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const caseAssetPaths: Record<string, CaseAssetPaths> = {
  'gushan-art-district': {
    property: ['cases/gushan-art-district/gushan-art-district-exterior.png', 'cases/gushan-art-district/gushan-art-district-living-room.png', 'cases/gushan-art-district/gushan-art-district-balcony.png'],
    floorplan: 'cases/gushan-art-district/gushan-art-district-floorplan.png',
    map: 'cases/gushan-art-district/gushan-art-district-map-mock.png',
    location: 'location/gushan-art-district-neighborhood-placeholder.png',
  },
  'zuoying-hsr-district': {
    property: ['cases/zuoying-hsr-district/zuoying-hsr-district-exterior.png', 'cases/zuoying-hsr-district/zuoying-hsr-district-living-room.png', 'cases/zuoying-hsr-district/zuoying-hsr-district-balcony.png'],
    floorplan: 'cases/zuoying-hsr-district/zuoying-hsr-district-floorplan.png',
    map: 'cases/zuoying-hsr-district/zuoying-hsr-district-map-mock.png',
    location: 'location/zuoying-hsr-district-neighborhood-placeholder.png',
  },
  'fengshan-metro-district': {
    property: ['cases/fengshan-metro-district/fengshan-metro-district-exterior.png', 'cases/fengshan-metro-district/fengshan-metro-district-living-room.png', 'cases/fengshan-metro-district/fengshan-metro-district-balcony.png'],
    floorplan: 'cases/fengshan-metro-district/fengshan-metro-district-floorplan.png',
    map: 'cases/fengshan-metro-district/fengshan-metro-district-map-mock.png',
    location: 'location/fengshan-metro-district-neighborhood-placeholder.png',
  },
};

const fallbackSvg = (label: string, accent = '#c9a66b') => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 760"><rect width="1200" height="760" fill="#f4efe7"/><path d="M0 580L290 330l190 150 210-220 510 360v140H0z" fill="${accent}" opacity=".32"/><circle cx="930" cy="190" r="90" fill="${accent}" opacity=".48"/><text x="600" y="400" text-anchor="middle" fill="#12233b" font-family="Arial,sans-serif" font-size="42">${label}</text><text x="600" y="455" text-anchor="middle" fill="#5d6a79" font-family="Arial,sans-serif" font-size="22">Demo placeholder</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

const withBasePath = (relativePath: string) => `${basePath}/${ASSET_ROOT}/${relativePath}`;
const fallback = (id: string, kind: ReportAssetKind, label: string): ReportAsset => ({id, src: fallbackSvg(label), alt: label, kind, status: 'MISSING'});
const fromPath = (id: string, kind: ReportAssetKind, relativePath: string | undefined, alt: string): ReportAsset => relativePath
  ? {id, src: withBasePath(relativePath), fallbackSrc: fallbackSvg(alt), alt, kind, status: 'AVAILABLE'}
  : fallback(id, kind, alt);

export type ReportAssetBundle = {
  propertyImages: ReportAsset[];
  floorplan: ReportAsset;
  map: ReportAsset;
  location: ReportAsset;
  logo: ReportAsset;
  agent: ReportAsset;
  qrCode: ReportAsset;
};

export function resolveReportAssets(caseId: string): ReportAssetBundle {
  const sources = caseAssetPaths[caseId];
  return {
    propertyImages: sources?.property.map((relativePath, index) => fromPath(`${caseId}-property-${index + 1}`, 'property', relativePath, `${caseId} 物件照片 ${index + 1}`)) ?? [fallback(`${caseId}-property-fallback`, 'property', 'MissingPropertyImage')],
    floorplan: fromPath(`${caseId}-floorplan`, 'floorplan', sources?.floorplan, '物件平面圖'),
    map: fromPath(`${caseId}-map`, 'map', sources?.map, '區域地圖示意'),
    location: fromPath(`${caseId}-location`, 'location', sources?.location, '生活圈示意'),
    logo: fromPath('ex-realty-logo', 'logo', 'brand/brand-logo-primary-transparent.png', 'E.X Realty Logo'),
    agent: fromPath(`${caseId}-agent`, 'agent', caseId === 'fengshan-metro-district' ? 'agents/demo-agent-female-cutout.png' : 'agents/demo-agent-male-cutout.png', 'Demo Agent'),
    qrCode: fromPath('demo-qr', 'qr', 'brand/demo-qr-public-showcase.png', 'Demo QR Code'),
  };
}

export function resolveMissingAsset(kind: ReportAssetKind, label?: string): ReportAsset {
  const labels: Record<ReportAssetKind, string> = {logo: 'MissingLogo', agent: 'MissingAgent', property: 'MissingPropertyImage', floorplan: 'MissingFloorplan', map: 'MissingMap', location: 'MissingLocation', qr: 'MissingQRCode'};
  return fallback(`missing-${kind}`, kind, label ?? labels[kind]);
}

export function getAssetInventoryStatus(bundle: ReportAssetBundle): ReportAssetStatusSummary {
  const assets = [...bundle.propertyImages, bundle.floorplan, bundle.map, bundle.location, bundle.logo, bundle.agent, bundle.qrCode];
  return {available: assets.filter((asset) => asset.status === 'AVAILABLE').length, missing: assets.filter((asset) => asset.status === 'MISSING').length, optional: assets.filter((asset) => asset.status === 'OPTIONAL').length};
}

export type ReportAssetStatusSummary = { available: number; missing: number; optional: number };

