import type {RealEstateTransaction, RealPriceQuery} from './types';

export type {RealPriceQuery} from './types';

const periodCutoff: Record<string, string> = { '3m':'2026-05-01', '6m':'2026-02-01', '1y':'2025-08-01', all:'1900-01-01' };
const includes = (value:string, query?:string) => !query || value.includes(query.trim());

export function filterTransactions(items:readonly RealEstateTransaction[], query:RealPriceQuery) {
  return items.filter((item) => {
    const ageMatch = query.ageRange === '0-5' ? item.buildingAge <= 5 : query.ageRange === '5-15' ? item.buildingAge > 5 && item.buildingAge < 15 : query.ageRange === '15+' ? item.buildingAge >= 15 : true;
    return (!query.city || item.city === query.city)
      && (!query.district || item.district === query.district)
      && includes(item.road, query.road)
      && includes(item.community, query.community)
      && (includes(item.address, query.addressKeyword) || includes(item.road, query.addressKeyword))
      && (!query.buildingType || item.buildingType === query.buildingType)
      && ageMatch
      && item.transactionDate >= (periodCutoff[query.period] ?? periodCutoff.all);
  }).sort((a,b) => b.transactionDate.localeCompare(a.transactionDate));
}

export function summarizeTransactions(items:readonly RealEstateTransaction[]) {
  const prices = items.map((item) => item.unitPrice);
  return {count:items.length, average:items.length ? prices.reduce((total,price) => total + price,0) / items.length : 0, highest:items.length ? Math.max(...prices) : 0, lowest:items.length ? Math.min(...prices) : 0};
}
export function trendData(items:readonly RealEstateTransaction[]) { return [...items].sort((a,b) => a.transactionDate.localeCompare(b.transactionDate)).map((item) => ({date:item.transactionDate.slice(5),price:item.unitPrice})); }
export function volumeData(items:readonly RealEstateTransaction[]) { const map=new Map<string,number>(); items.forEach((item)=>{const month=item.transactionDate.slice(0,7);map.set(month,(map.get(month) ?? 0)+1);}); return [...map].sort(([a],[b])=>a.localeCompare(b)).map(([month,volume])=>({month,volume})); }
export function distributionData(items:readonly RealEstateTransaction[]) { const buckets:Array<[string,number,number]>=[['15-20',15,20],['20-25',20,25],['25-30',25,30],['30-35',30,35],['35+',35,Infinity]]; return buckets.map(([range,min,max])=>({range,count:items.filter((item)=>item.unitPrice>=min&&item.unitPrice<max).length})); }
