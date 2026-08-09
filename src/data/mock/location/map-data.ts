import type { AreaRegion, MapMarker } from '@/features/location-intelligence/map/types';

export const mockAreaRegions: AreaRegion[] = [
  { id: 'gushan-art-district', city: '高雄市', district: '鼓山區', name: '美術館生活圈', center: { x: 31, y: 48 }, averagePrice: 42.5, transactionCount: 36, growthRate: 7.8, popularityScore: 92, popularCommunities: ['美術館首席', '美術東世界', '藝術城堡'], lifestyleTags: ['公園綠地', '成熟商圈', '高品質住宅'], propertyTypes: ['大樓', '透天'], source: 'MOCK DATA' },
  { id: 'zuoying-hsr-district', city: '高雄市', district: '左營區', name: '高鐵生活圈', center: { x: 56, y: 26 }, averagePrice: 38.6, transactionCount: 42, growthRate: 6.2, popularityScore: 88, popularCommunities: ['高鐵特區', '站前之星', '左營匯'], lifestyleTags: ['高鐵交通', '商場機能', '首購投資'], propertyTypes: ['大樓', '公寓'], source: 'MOCK DATA' },
  { id: 'fengshan-metro-district', city: '高雄市', district: '鳳山區', name: '捷運生活圈', center: { x: 71, y: 72 }, averagePrice: 28.9, transactionCount: 51, growthRate: 4.9, popularityScore: 81, popularCommunities: ['鳳山捷運宅', '大東新苑', '文山首席'], lifestyleTags: ['捷運便利', '家庭自住', '生活機能'], propertyTypes: ['大樓', '透天', '公寓'], source: 'MOCK DATA' },
];

export const mockMapMarkers: MapMarker[] = mockAreaRegions.map((region) => ({ id: `marker-${region.id}`, type: 'region', title: `${region.district} ${region.name}`, value: `${region.averagePrice}萬/坪`, position: region.center }));
