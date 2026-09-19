import { deepFreeze } from '../types';
import { DIMENSION_IDS, assertScore, type DimensionId, type EvaluationPolicy } from './contracts';

const emphasis: Record<string, readonly DimensionId[]> = {
  S01: ['NEEDS_DISCOVERY', 'COMMUNICATION', 'PROFESSIONALISM'],
  S02: ['NEEDS_DISCOVERY', 'PROPERTY_KNOWLEDGE', 'COMMUNICATION'],
  S03: ['MARKET_INTERPRETATION', 'OBJECTION_HANDLING', 'RISK_AWARENESS'],
  S04: ['NEGOTIATION', 'OBJECTION_HANDLING', 'PROFESSIONALISM'],
  S05: ['NEGOTIATION', 'MARKET_INTERPRETATION', 'COMMUNICATION'],
};
const objectiveDimensions: Record<string, readonly (readonly DimensionId[])[]> = {
  S01: [['NEEDS_DISCOVERY'], ['COMMUNICATION', 'PROFESSIONALISM']],
  S02: [['PROPERTY_KNOWLEDGE'], ['NEEDS_DISCOVERY', 'COMMUNICATION']],
  S03: [['MARKET_INTERPRETATION'], ['OBJECTION_HANDLING']],
  S04: [['NEEDS_DISCOVERY', 'OBJECTION_HANDLING'], ['NEGOTIATION', 'PROFESSIONALISM']],
  S05: [['NEEDS_DISCOVERY', 'COMMUNICATION'], ['MARKET_INTERPRETATION', 'NEGOTIATION']],
};
const actionRules: EvaluationPolicy['actionRules'] = [
  { action: 'ASK_NEEDS', dimensions: ['NEEDS_DISCOVERY', 'COMMUNICATION'], score: 85, positive: true },
  { action: 'ASK_BUDGET', dimensions: ['NEEDS_DISCOVERY'], score: 80, positive: true },
  { action: 'ASK_FINANCING', dimensions: ['NEEDS_DISCOVERY', 'PROFESSIONALISM'], score: 85, positive: true },
  { action: 'EXPLAIN_PROPERTY', dimensions: ['PROPERTY_KNOWLEDGE', 'COMMUNICATION'], score: 80, positive: true },
  { action: 'EXPLAIN_MARKET', dimensions: ['MARKET_INTERPRETATION'], score: 85, positive: true },
  { action: 'HANDLE_OBJECTION', dimensions: ['OBJECTION_HANDLING', 'COMMUNICATION'], score: 85, positive: true },
  { action: 'NEGOTIATE', dimensions: ['NEGOTIATION'], score: 80, positive: true },
  { action: 'BUILD_TRUST', dimensions: ['COMMUNICATION', 'PROFESSIONALISM'], score: 80, positive: true },
  { action: 'PRESSURE_CLOSE', dimensions: ['COMMUNICATION', 'RISK_AWARENESS', 'PROFESSIONALISM'], score: 10, positive: false },
  { action: 'DISCLOSE_RISK', dimensions: ['RISK_AWARENESS', 'PROFESSIONALISM'], score: 85, positive: true },
];
const eventRules: EvaluationPolicy['eventRules'] = [
  { eventType: 'TRUST_GAINED', dimensions: ['COMMUNICATION', 'PROFESSIONALISM'], score: 80 },
  { eventType: 'TRUST_DROPPED', dimensions: ['COMMUNICATION', 'PROFESSIONALISM'], score: 20 },
  { eventType: 'HIDDEN_NEED_REVEALED', dimensions: ['NEEDS_DISCOVERY'], score: 90 },
  { eventType: 'NEGOTIATION_OPENED', dimensions: ['NEGOTIATION'], score: 85 },
  { eventType: 'SECOND_VIEW_INTEREST', dimensions: ['OBJECTION_HANDLING'], score: 85 },
  { eventType: 'CUSTOMER_DISENGAGING', dimensions: ['COMMUNICATION'], score: 10 },
  { eventType: 'RISK_WARNING', dimensions: ['RISK_AWARENESS', 'PROFESSIONALISM'], score: 0 },
];
export function evaluationPolicyFor(scenarioId: string, scenarioVersionId: string): EvaluationPolicy {
  // Explicit mapping: new scenario versions require a reviewed evaluation policy.
  if (!emphasis[scenarioId] || scenarioVersionId !== scenarioId + '-v1') throw new Error('EVALUATION_POLICY_NOT_FOUND');
  return deepFreeze({
    policyId: 'training-mvp-' + scenarioId, version: 1,
    dimensionWeights: Object.fromEntries(DIMENSION_IDS.map(id => [id, emphasis[scenarioId].includes(id) ? 3 : 1])) as Record<DimensionId, number>,
    componentWeights: { rule: 0.45, objective: 0.35, event: 0.2 },
    minimumEvidence: 1, confidenceEvidenceTarget: 4, advisoryMinimumConfidence: 0.6,
    knowledgeMaxAgeDays: 90, thresholds: { strong: 80, developing: 60 },
    riskOverrides: { reviewSeverities: ['HIGH'], dimensionCap: 35, dimensions: ['RISK_AWARENESS', 'PROFESSIONALISM'] },
    actionRules, eventRules,
    objectives: Object.fromEntries(objectiveDimensions[scenarioId].map((dimensions, index) => [scenarioId + '-O' + (index + 1), dimensions])),
  });
}
export function assertPolicy(policy: EvaluationPolicy): void {
  if (!policy.policyId || !Number.isInteger(policy.version) || policy.version < 1) throw new Error('POLICY_VERSION_INVALID');
  const weights = [...Object.values(policy.dimensionWeights), ...Object.values(policy.componentWeights)];
  if (weights.some(value => !Number.isFinite(value) || value < 0) || !Object.values(policy.dimensionWeights).some(value => value > 0) || !Object.values(policy.componentWeights).some(value => value > 0) || DIMENSION_IDS.some(id => !(id in policy.dimensionWeights))) throw new Error('POLICY_WEIGHTS_INVALID');
  if (!Number.isInteger(policy.minimumEvidence) || policy.minimumEvidence < 1 || !Number.isInteger(policy.confidenceEvidenceTarget) || policy.confidenceEvidenceTarget < policy.minimumEvidence || !Number.isFinite(policy.knowledgeMaxAgeDays) || policy.knowledgeMaxAgeDays <= 0) throw new Error('POLICY_EVIDENCE_INVALID');
  if (!Number.isFinite(policy.advisoryMinimumConfidence) || policy.advisoryMinimumConfidence < 0 || policy.advisoryMinimumConfidence > 1) throw new Error('POLICY_ADVISORY_INVALID');
  assertScore(policy.riskOverrides.dimensionCap);
  assertScore(policy.thresholds.strong); assertScore(policy.thresholds.developing);
  if (policy.thresholds.strong < policy.thresholds.developing) throw new Error('POLICY_THRESHOLDS_INVALID');
  for (const rule of [...policy.actionRules, ...policy.eventRules]) {
    assertScore(rule.score);
    if (!rule.dimensions.length || rule.dimensions.some(id => !DIMENSION_IDS.includes(id))) throw new Error('POLICY_DIMENSION_INVALID');
  }
}
