import {describe,expect,it} from 'vitest';
import {calculateLifestyleScore,createLocationInsight} from '@/features/location-intelligence/analysis';
import {locationDemoCases} from '@/features/location-intelligence/mock-data';

describe('Location Intelligence analysis', () => {
  it('loads three labelled Mock location cases', () => {
    expect(locationDemoCases).toHaveLength(3);
    expect(locationDemoCases.every((item) => item.property.source === 'MOCK' && item.nearbyPlaces.every((place) => place.source === 'MOCK'))).toBe(true);
  });

  it('calculates the defined lifestyle score without exceeding 100', () => {
    const gushan = calculateLifestyleScore(locationDemoCases[0].nearbyPlaces);
    const zuoying = calculateLifestyleScore(locationDemoCases[1].nearbyPlaces);
    expect(gushan).toMatchObject({schoolScore:20,transportScore:20,shoppingScore:30,leisureScore:15,overallScore:85});
    expect(zuoying.overallScore).toBe(100);
  });

  it('creates a rule-based location insight for sales use', () => {
    const demoCase = locationDemoCases[0];
    const score = calculateLifestyleScore(demoCase.nearbyPlaces);
    const insight = createLocationInsight(demoCase.property,demoCase.nearbyPlaces,score);
    expect(insight).toMatchObject({source:'MOCK'});
    expect(insight.summary).toContain('家庭型買方');
    expect(insight.summary).toContain('捷運站');
  });
});
