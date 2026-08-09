import { mockAreaRegions, mockMapMarkers } from '@/data/mock/location/map-data';
import type { AreaFilter, AreaMapAdapter, AreaRegion } from './types';

function matchesFilter(region: AreaRegion, filter: AreaFilter) {
  return (!filter.district || region.district === filter.district) && (!filter.propertyType || region.propertyTypes.includes(filter.propertyType));
}

export const mockAreaMapAdapter: AreaMapAdapter = {
  getRegions(filter) { return mockAreaRegions.filter((region) => matchesFilter(region, filter)); },
  getMarkers(regions) { const regionIds = new Set(regions.map((region) => region.id)); return mockMapMarkers.filter((marker) => regionIds.has(marker.id.replace('marker-', ''))); },
};
