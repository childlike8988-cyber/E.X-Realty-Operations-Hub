import {LIFESTYLE_SCORE_RULES} from './constants';
import type {LifestyleScore, LocationInsight, NearbyPlace, PropertyLocation} from './types';

const hasType = (places:readonly NearbyPlace[], type:NearbyPlace['type']) => places.some((place) => place.type === type);

export function calculateLifestyleScore(places:readonly NearbyPlace[]):LifestyleScore {
  const schoolScore = hasType(places,'school') || hasType(places,'university') ? LIFESTYLE_SCORE_RULES.school : 0;
  const transportScore = hasType(places,'mrt') ? LIFESTYLE_SCORE_RULES.mrt : 0;
  const shoppingScore = (hasType(places,'market') ? LIFESTYLE_SCORE_RULES.market : 0) + (hasType(places,'shopping') ? LIFESTYLE_SCORE_RULES.shopping : 0) + (hasType(places,'hospital') ? LIFESTYLE_SCORE_RULES.hospital : 0);
  const leisureScore = hasType(places,'park') ? LIFESTYLE_SCORE_RULES.park : 0;
  return {schoolScore,transportScore,shoppingScore,leisureScore,overallScore:Math.min(LIFESTYLE_SCORE_RULES.maximum,schoolScore + transportScore + shoppingScore + leisureScore)};
}

export function createLocationInsight(location:PropertyLocation, places:readonly NearbyPlace[], score:LifestyleScore):LocationInsight {
  const familyReady = score.schoolScore > 0 && score.leisureScore > 0;
  const nearMrt = hasType(places,'mrt');
  const summary = familyReady ? '本區適合家庭型買方，周邊學區完整，生活機能成熟。' : '本區生活機能具備發展基礎，可依買方需求說明周邊資源。';
  const transport = nearMrt ? '距離捷運站近，適合重視交通便利族群。' : '可聚焦於區域生活機能與日常採買便利性。';
  return {title:`${location.district}生活圈洞察`,summary:`${summary}${transport}`,audience:familyReady ? '建議客群：家庭型、自住型買方。' : '建議客群：重視生活便利與區域價格帶的買方。',source:'MOCK'};
}
