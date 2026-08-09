import type {CommunitySummary, ComparisonResult, RealEstateTransaction} from './types';

const round = (value:number) => Math.round(value * 10) / 10;

export function compareCommunities(communities:readonly [CommunitySummary,CommunitySummary]):ComparisonResult {
  const [communityA,communityB] = communities;
  const averageUnitPriceDifference = round(communityA.averageUnitPrice - communityB.averageUnitPrice);
  const averageUnitPriceDifferencePercent = communityB.averageUnitPrice ? round((averageUnitPriceDifference / communityB.averageUnitPrice) * 100) : 0;
  return {communityA,communityB,averageUnitPriceDifference,averageUnitPriceDifferencePercent,transactionCountDifference:communityA.transactionCount-communityB.transactionCount,higherAverageUnitPriceCommunity:averageUnitPriceDifference === 0 ? null : averageUnitPriceDifference > 0 ? communityA.community : communityB.community};
}

export function buildPriceComparisonTrend(transactions:readonly RealEstateTransaction[], communityA:string, communityB:string) {
  const points = new Map<string,{date:string;communityA?:number;communityB?:number}>();
  transactions.filter((item)=>item.community===communityA||item.community===communityB).forEach((item)=>{const point=points.get(item.transactionDate) ?? {date:item.transactionDate}; if(item.community===communityA)point.communityA=item.unitPrice; if(item.community===communityB)point.communityB=item.unitPrice; points.set(item.transactionDate,point);});
  return [...points.values()].sort((a,b)=>a.date.localeCompare(b.date)).map((item)=>({...item,date:item.date.slice(5)}));
}

export function buildVolumeComparison(transactions:readonly RealEstateTransaction[], communityA:string, communityB:string) {
  const points = new Map<string,{month:string;communityA:number;communityB:number}>();
  transactions.filter((item)=>item.community===communityA||item.community===communityB).forEach((item)=>{const month=item.transactionDate.slice(0,7);const point=points.get(month) ?? {month,communityA:0,communityB:0}; if(item.community===communityA)point.communityA+=1; if(item.community===communityB)point.communityB+=1; points.set(month,point);});
  return [...points.values()].sort((a,b)=>a.month.localeCompare(b.month));
}
