import type {RealPriceQuery} from './types';

export type RecentSearch = {id:string;query:RealPriceQuery;createdAt:string};
const storageKey = 'ex-realty-real-price-recent-searches';
const maxEntries = 5;

export function loadRecentSearches():RecentSearch[] {
  if (typeof window === 'undefined') return [];
  try { const stored = window.localStorage.getItem(storageKey); return stored ? JSON.parse(stored) as RecentSearch[] : []; } catch { return []; }
}

export function saveRecentSearch(query:RealPriceQuery):RecentSearch[] {
  const existing = loadRecentSearches();
  const signature = JSON.stringify({city:query.city,district:query.district,road:query.road,community:query.community,ageRange:query.ageRange});
  const next = [{id:crypto.randomUUID(),query:{...query},createdAt:new Date().toISOString()},...existing.filter((item)=>JSON.stringify({city:item.query.city,district:item.query.district,road:item.query.road,community:item.query.community,ageRange:item.query.ageRange}) !== signature)].slice(0,maxEntries);
  try { window.localStorage.setItem(storageKey,JSON.stringify(next)); } catch { /* local-only convenience; unavailable storage remains non-blocking */ }
  return next;
}
