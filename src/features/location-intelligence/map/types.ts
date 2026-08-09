export type MapPosition = { x: number; y: number };

export type AreaRegion = {
  id: string;
  city: string;
  district: string;
  name: string;
  center: MapPosition;
  averagePrice: number;
  transactionCount: number;
  growthRate: number;
  popularityScore: number;
  popularCommunities: string[];
  lifestyleTags: string[];
  propertyTypes: Array<'大樓' | '透天' | '公寓'>;
  source: 'MOCK DATA';
};

export type MapMarker = {
  id: string;
  type: 'region' | 'community' | 'lifestyle';
  title: string;
  value: string;
  position: MapPosition;
};

export type AreaFilter = {
  district: '' | '鼓山區' | '左營區' | '鳳山區';
  propertyType: '' | '大樓' | '透天' | '公寓';
  priceRange: '' | '1000-3000萬';
  sizeRange: '' | '20-50坪';
  ageRange: '' | '5年內' | '5-15年' | '15年以上';
};

export interface AreaMapAdapter {
  getRegions(filter: AreaFilter): readonly AreaRegion[];
  getMarkers(regions: readonly AreaRegion[]): readonly MapMarker[];
}
