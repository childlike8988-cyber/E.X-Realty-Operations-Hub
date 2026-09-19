import { deepFreeze } from '../types';
import { DIMENSION_IDS, type DimensionId, type TrainingResult } from './contracts';

export type AgentSkillProfileProjection = {
  organizationId: string; agentRef: string; projectionOf: 'TRAINING_RESULTS';
  sourceResultIds: readonly string[]; completedScenarios: readonly string[]; riskFrequency: number;
  dimensions: readonly { dimensionId: DimensionId; score: number | null; trend: 'IMPROVING' | 'STABLE' | 'NEEDS_ATTENTION' | 'INSUFFICIENT_EVIDENCE'; verifiedResultCount: number; resultRefs: readonly { resultId: string; evidenceRefs: readonly string[] }[] }[];
  strengths: readonly DimensionId[]; weaknesses: readonly DimensionId[];
};
/** Rebuilt from latest revision per session; no source history or session mutation. */
export function deriveAgentSkillProfile(results: readonly TrainingResult[], organizationId: string, agentRef: string): AgentSkillProfileProjection {
  const latest = new Map<string, TrainingResult>();
  for (const result of results.filter(item => item.organizationId === organizationId && item.agentRef === agentRef)) {
    const previous = latest.get(result.sessionId);
    if (previous?.revision === result.revision && previous.resultId !== result.resultId) throw new Error('RESULT_REVISION_AMBIGUOUS');
    if (!previous || result.revision > previous.revision) latest.set(result.sessionId, result);
  }
  const selected = [...latest.values()].sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.resultId.localeCompare(b.resultId));
  const dimensions = DIMENSION_IDS.map(dimensionId => {
    const scored = selected.flatMap(result => {
      const dimension = result.dimensionResults.find(item => item.dimensionId === dimensionId);
      return dimension?.state === 'SCORED' ? [{ result, dimension }] : [];
    });
    const score = scored.length ? scored.reduce((sum, item) => sum + item.dimension.score, 0) / scored.length : null;
    const first = scored[0]?.dimension.score ?? 0;
    const last = scored.at(-1)?.dimension.score ?? 0;
    const trend = scored.length < 2 ? 'INSUFFICIENT_EVIDENCE' as const : last > first ? 'IMPROVING' as const : last < first ? 'NEEDS_ATTENTION' as const : 'STABLE' as const;
    return { dimensionId, score, trend, verifiedResultCount: scored.filter(item => item.dimension.verificationState === 'VERIFIED').length,
      resultRefs: scored.map(({ result, dimension }) => ({ resultId: result.resultId, evidenceRefs: [...dimension.evidenceRefs] })) };
  });
  return deepFreeze({
    organizationId, agentRef, projectionOf: 'TRAINING_RESULTS', sourceResultIds: selected.map(result => result.resultId),
    completedScenarios: [...new Set(selected.filter(result => result.objectiveResult === 'MET').map(result => result.scenarioId))].sort(),
    riskFrequency: selected.length ? selected.filter(result => result.riskSummary.ruleIds.length > 0).length / selected.length : 0,
    dimensions,
    strengths: dimensions.filter(item => item.score !== null && item.score >= 80).map(item => item.dimensionId),
    weaknesses: dimensions.filter(item => item.score !== null && item.score < 60).map(item => item.dimensionId),
  });
}
