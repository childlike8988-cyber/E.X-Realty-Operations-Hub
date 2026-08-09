import {describe,it,expect} from 'vitest';
function payment(principal:number,annual:number,years:number){const r=annual/100/12,n=years*12;return Math.round(principal*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1))}
describe('mortgage',()=>it('calculates a positive monthly payment',()=>expect(payment(9000000,2.2,30)).toBeGreaterThan(0)));
