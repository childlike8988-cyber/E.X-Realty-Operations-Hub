import { describe, expect, it } from 'vitest';
import { mockAreaRegions, mockMapMarkers } from '@/data/mock/location/map-data';
import { demoCaseMapAnalysis, demoCases } from '@/features/demo/demo-flow';
import { generateMarketInsight } from '@/features/location-intelligence/market-insight';
import { mockAreaMapAdapter } from '@/features/location-intelligence/map/mock-area-map-adapter';

describe('Real Price Map Intelligence', () => {
  it('provides three labelled Kaohsiung Mock regions and markers', () => {
    expect(mockAreaRegions).toHaveLength(3);
    expect(mockAreaRegions.map((region) => [region.district, region.averagePrice])).toEqual([['鼓山區', 42.5], ['左營區', 38.6], ['鳳山區', 28.9]]);
    expect(mockAreaRegions.every((region) => region.source === 'MOCK DATA' && region.popularCommunities.length > 0 && region.lifestyleTags.length > 0)).toBe(true);
    expect(mockMapMarkers).toHaveLength(3);
  });

  it('filters regions through the replaceable Mock adapter', () => {
    const results = mockAreaMapAdapter.getRegions({ district: '鼓山區', propertyType: '大樓', priceRange: '1000-3000萬', sizeRange: '20-50坪', ageRange: '5-15年' });
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('gushan-art-district');
    expect(mockAreaMapAdapter.getRegions({ district: '左營區', propertyType: '透天', priceRange: '', sizeRange: '', ageRange: '' })).toEqual([]);
  });

  it('generates a clearly labelled deterministic market insight', () => {
    const insight = generateMarketInsight(mockAreaRegions[0]);
    expect(insight).toMatchObject({ label: 'Demo Generated Insight', source: 'MOCK DATA' });
    expect(insight.audiences).toEqual(['換屋家庭', '高資產自住族']);
    expect(insight.reasons).toEqual(mockAreaRegions[0].lifestyleTags);
  });

  it('maps every Demo Case to a map region and the public map route', () => {
    expect(demoCases.map((demoCase) => demoCaseMapAnalysis[demoCase.caseId].regionId)).toEqual(mockAreaRegions.map((region) => region.id));
    expect(Object.values(demoCaseMapAnalysis).every((entry) => entry.route === '/tools/real-price/map')).toBe(true);
  });
});
