import type {CreditAction} from './types';

export const CREDIT_COSTS:Record<CreditAction,number> = {FREE_TEMPLATE:0,AI_IMAGE_GENERATION:10,IMAGE_EDIT:5,ADVANCED_EDIT:15};

export function getCreditCost(action:CreditAction) { return CREDIT_COSTS[action]; }
