import type {CommunitySummary, RealEstateTransaction, TransactionComparison} from './types';

const average = (values:readonly number[]) => values.length ? values.reduce((total,value)=>total+value,0) / values.length : 0;
const round = (value:number) => Math.round(value * 10) / 10;

export function calculateCommunitySummary(transactions:readonly RealEstateTransaction[], communityName?:string):CommunitySummary {
  const unitPrices = transactions.map((item)=>item.unitPrice);
  return {
    community: communityName || transactions[0]?.community || '未指定社區',
    transactionCount: transactions.length,
    averageUnitPrice: round(average(unitPrices)),
    highestUnitPrice: transactions.length ? Math.max(...unitPrices) : 0,
    lowestUnitPrice: transactions.length ? Math.min(...unitPrices) : 0,
    averageTotalPrice: round(average(transactions.map((item)=>item.totalPrice))),
    averageAreaPing: round(average(transactions.map((item)=>item.areaPing))),
    averageBuildingAge: round(average(transactions.map((item)=>item.buildingAge))),
    source: 'MOCK',
  };
}

export function compareTransactionToCommunity(transaction:RealEstateTransaction, summary:CommunitySummary):TransactionComparison {
  const unitPriceDifference = round(transaction.unitPrice - summary.averageUnitPrice);
  const unitPriceDifferencePercent = summary.averageUnitPrice ? round((unitPriceDifference / summary.averageUnitPrice) * 100) : 0;
  return {unitPriceDifference,unitPriceDifferencePercent,direction:unitPriceDifference > 0 ? 'above' : unitPriceDifference < 0 ? 'below' : 'equal'};
}
