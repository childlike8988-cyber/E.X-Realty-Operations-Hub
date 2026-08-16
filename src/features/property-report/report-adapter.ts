import { mockAreaRegions, mockMapMarkers } from '@/data/mock/location/map-data';
import { locationDemoCases } from '@/data/mock/location/location-data';
import { realPriceTransactions } from '@/data/mock/real-price/real-price-data';
import { realtyDemoCases } from '@/data/mock/real-price/demo-cases/demo-cases';
import { mockBranding } from '@/features/real-price/branding';
import { calculateCommunitySummary } from '@/features/real-price/community-analysis';
import { compareCommunities } from '@/features/real-price/community-comparison';
import { trendData } from '@/features/real-price/analysis';
import { generateMarketInsight } from '@/features/location-intelligence/market-insight';
import { calculateLifestyleScore, createLocationInsight } from '@/features/location-intelligence/analysis';
import { adaptPropertyToProposalContext } from '@/features/property-intelligence/proposal-adapter';
import { mockProperties } from '@/data/mock/property/property-data';
import { buildReportId, buildReportSections } from './report-builder';
import { resolveReportAssets } from './asset-resolver';
import type { CommunitySummary } from '@/features/real-price/types';
import type { PropertyMarketReport, ReportComparisonSummary, ReportLifestyleSummary, ReportMarketSummary } from './types';
import type { PropertyProfile } from '@/features/property-intelligence/types';

const DEMO_GENERATED_AT = '2026-08-14T00:00:00.000Z';

const transactionsForProperty = (property: PropertyProfile) => {
  const byCommunity = realPriceTransactions.filter((item) => item.community === property.community);
  return byCommunity.length ? byCommunity : realPriceTransactions.filter((item) => item.district === property.district);
};

function buildMarketSummary(property: PropertyProfile): ReportMarketSummary {
  const transactions = transactionsForProperty(property);
  const summary = calculateCommunitySummary(transactions, property.community);
  return {...summary, trend: trendData(transactions), recentTransactions: [...transactions].sort((a, b) => b.transactionDate.localeCompare(a.transactionDate)).slice(0, 5), source: 'MOCK DATA'};
}

function buildComparisonSummary(property: PropertyProfile, subject: ReportMarketSummary): ReportComparisonSummary {
  const demoCase = realtyDemoCases.find((item) => item.caseId === property.realPriceCaseId);
  const comparisonTransactions = demoCase ? realPriceTransactions.filter((item) => item.community === demoCase.comparisonCommunity) : [];
  const comparison = comparisonTransactions.length ? calculateCommunitySummary(comparisonTransactions, demoCase?.comparisonCommunity) : null;
  const subjectSummary: CommunitySummary = {...subject, source: 'MOCK'};
  if (!comparison) return {subject: subjectSummary, comparison: null, unitPriceDifference: 0, unitPriceDifferencePercent: 0, marketPosition: '目前沒有可比社區資料，建議以區域平均與近期成交案例說明。', source: 'MOCK DATA'};
  const result = compareCommunities([subjectSummary, comparison]);
  return {subject: subjectSummary, comparison, unitPriceDifference: result.averageUnitPriceDifference, unitPriceDifferencePercent: result.averageUnitPriceDifferencePercent, marketPosition: result.higherAverageUnitPriceCommunity === subject.community ? '本案社區平均單價高於比較社區，適合以生活圈與產品條件說明價值。' : '本案社區平均單價低於比較社區，可聚焦總價帶與自住使用情境。', source: 'MOCK DATA'};
}

function buildLifestyleSummary(property: PropertyProfile, region: (typeof mockAreaRegions)[number]): ReportLifestyleSummary {
  const locationCase = locationDemoCases.find((item) => item.id === property.locationId);
  const nearbyPlaces = locationCase?.nearbyPlaces ?? [];
  const score = calculateLifestyleScore(nearbyPlaces);
  const locationInsight = locationCase ? createLocationInsight(locationCase.property, nearbyPlaces, score) : null;
  return {
    score,
    nearbyPlaces,
    categories: [
      {label: '交通', value: nearbyPlaces.some((item) => item.type === 'mrt') ? '捷運／轉乘可達' : '區域交通', score: score.transportScore},
      {label: '學區', value: nearbyPlaces.some((item) => item.type === 'school') ? '學區資源完整' : '學區資源', score: score.schoolScore},
      {label: '採買', value: nearbyPlaces.some((item) => item.type === 'market' || item.type === 'shopping') ? '日常機能成熟' : '日常機能', score: score.shoppingScore},
      {label: '休閒', value: nearbyPlaces.some((item) => item.type === 'park') ? '公園綠地可達' : '休閒資源', score: score.leisureScore},
    ],
    insight: locationInsight?.summary ?? `${region.name}具備可供展示的生活機能資料。`,
    audience: locationInsight?.audience ?? '建議客群：重視生活便利的買方。',
    image: resolveReportAssets(property.locationId).location,
    source: 'MOCK DATA',
  };
}

export function adaptPropertyToMarketReport(property: PropertyProfile): PropertyMarketReport {
  const propertyContext = adaptPropertyToProposalContext(property);
  const region = mockAreaRegions.find((item) => item.id === property.locationId) ?? mockAreaRegions[0];
  const marketInsight = generateMarketInsight(region);
  const marketSummary = buildMarketSummary(property);
  const comparisonSummary = buildComparisonSummary(property, marketSummary);
  const lifestyleSummary = buildLifestyleSummary(property, region);
  const assets = resolveReportAssets(property.locationId);
  return {
    reportId: buildReportId(property.id),
    property,
    propertyContext,
    brand: mockBranding,
    agent: {name: mockBranding.agentName, phone: mockBranding.phone, portrait: assets.agent},
    propertyImages: assets.propertyImages,
    floorplan: assets.floorplan,
    logo: assets.logo,
    qrCode: assets.qrCode,
    marketSummary,
    mapSummary: {region, markers: mockMapMarkers.filter((item) => item.id === `marker-${region.id}`), mapImage: assets.map, source: 'MOCK DATA'},
    lifestyleSummary,
    comparisonSummary,
    propertyInsight: {title: marketInsight.title, summary: `${marketInsight.summary} ${marketInsight.reasons.slice(0, 2).join('、')}。`, score: propertyContext.score, source: 'Demo Generated Insight'},
    targetCustomer: propertyContext.targetCustomer,
    sellingPoints: propertyContext.sellingPoints,
    salesStrategy: propertyContext.salesStrategy,
    contact: {company: mockBranding.companyName, branch: mockBranding.branchName, agent: mockBranding.agentName, phone: mockBranding.phone, address: mockBranding.address},
    sourceLabels: ['MOCK DATA', 'Demo Generated Insight'],
    generatedAt: DEMO_GENERATED_AT,
    sections: buildReportSections(),
  };
}

export function getDemoPropertyReport(caseId: string): PropertyMarketReport {
  const property = mockProperties.find((item) => item.realPriceCaseId === caseId) ?? mockProperties[0];
  return adaptPropertyToMarketReport(property);
}

export function getAllDemoPropertyReports(): PropertyMarketReport[] {
  return mockProperties.map(adaptPropertyToMarketReport);
}
