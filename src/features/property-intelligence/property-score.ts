import type {PropertyAnalysis, PropertyScore} from './types';

const clamp = (value:number) => Math.max(0,Math.min(100,value));

export function calculatePropertyScore(analysis:PropertyAnalysis, communityAverageUnitPrice:number):PropertyScore {
  const marketScore = clamp(Math.round(50 + communityAverageUnitPrice));
  const locationScore = analysis.lifestyleScore.overallScore;
  const valueScore = clamp(Math.round(80 + (communityAverageUnitPrice - analysis.property.unitPrice) * 2));
  const overallScore = Math.round((marketScore + locationScore + valueScore) / 3);
  return {label:'Demo Generated Score',marketScore,locationScore,valueScore,overallScore,source:'MOCK'};
}
