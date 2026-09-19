import type { TrainingScenarioVersion } from '../types';
import type { ReplayedSessionState } from '../session-replay';
import type { TrainingSessionEvent } from '../session-events';
import type { DeepReadonly, DimensionId, EvaluationEvidence, EvaluationPolicy } from './contracts';

export type ComponentFinding = { dimensionId: DimensionId; score: number; weight: number; evidence: EvaluationEvidence };
export type RuleEvaluation = readonly ComponentFinding[];
export type ObjectiveEvaluation = readonly ComponentFinding[];
export type EventOutcomeEvaluation = readonly ComponentFinding[];
type Events = readonly DeepReadonly<TrainingSessionEvent>[];
function eventReference(event: Events[number]) { return { kind: 'EVENT' as const, eventId: event.eventId, sequence: event.sequence }; }

/** Rules inspect accepted structured actions, never classify message prose. */
export function evaluateRules(events: Events, policy: EvaluationPolicy): RuleEvaluation {
  const findings: ComponentFinding[] = [];
  const seen = new Set<string>();
  for (const event of events) {
    if (event.eventType !== 'TRAINEE_ACTION') continue;
    for (const rule of policy.actionRules.filter(rule => rule.action === event.payload.action.kind)) {
      for (const dimensionId of rule.dimensions) {
        const key = dimensionId + ':' + rule.action;
        if (seen.has(key)) continue; // repetition cannot farm score/confidence
        seen.add(key);
        findings.push({ dimensionId, score: rule.score, weight: 1, evidence: {
          evidenceId: 'rule:' + key, dimensionId, kind: rule.positive ? 'POSITIVE' : 'NEGATIVE',
          finding: '已記錄行動：' + rule.action + '。僅驗證行動類型，未認定對話內容正確。',
          references: [eventReference(event)], verificationState: 'UNKNOWN',
        } });
      }
    }
  }
  return findings;
}
export function evaluateObjectives(events: Events, replay: DeepReadonly<ReplayedSessionState>, version: TrainingScenarioVersion, policy: EvaluationPolicy): ObjectiveEvaluation {
  // A cancelled session with no interaction is insufficient, not a zero-scored attempt.
  if (!events.some(event => event.eventType === 'TRAINEE_ACTION')) return [];
  const terminal = events.at(-1);
  if (!terminal) return [];
  return version.objectives.flatMap(objective => {
    const progress = replay.objectiveProgress.find(item => item.objectiveId === objective.objectiveId);
    if (!progress) throw new Error('PERSISTED_OBJECTIVE_MISSING');
    const met = progress.status === 'MET';
    const event = events.find(item => item.eventType === 'STATE_CHANGED' && item.stateAfter.objectiveProgress.some(item => item.objectiveId === objective.objectiveId && item.status === 'MET')) ?? terminal;
    return (policy.objectives[objective.objectiveId] ?? []).map(dimensionId => ({
      dimensionId, score: met ? 100 : 0, weight: objective.weight,
      evidence: { evidenceId: 'objective:' + objective.objectiveId + ':' + dimensionId, dimensionId,
        kind: met ? 'POSITIVE' as const : 'NEGATIVE' as const,
        finding: objective.label + (met ? '：持久化進度已達成。' : '：結束時尚未達成。'),
        references: [eventReference(event), { kind: 'OBJECTIVE' as const, objectiveId: objective.objectiveId, scenarioVersionId: version.scenarioVersionId }],
        verificationState: 'UNKNOWN' as const,
      },
    }));
  });
}
export function evaluateEventOutcomes(events: Events, policy: EvaluationPolicy): EventOutcomeEvaluation {
  const seen = new Set<string>();
  return events.flatMap(event => policy.eventRules.filter(rule => rule.eventType === event.eventType).flatMap(rule => rule.dimensions.flatMap(dimensionId => {
    const key = dimensionId + ':' + event.eventType;
    if (seen.has(key)) return [];
    seen.add(key);
    return [{ dimensionId, score: rule.score, weight: 1, evidence: {
      evidenceId: 'outcome:' + key, dimensionId, kind: rule.score >= 50 ? 'POSITIVE' as const : 'NEGATIVE' as const,
      finding: '已記錄情境結果：' + event.eventType, references: [eventReference(event)], verificationState: 'UNKNOWN' as const,
    } }];
  })));
}
export function componentScore(findings: readonly ComponentFinding[], dimensionId: DimensionId): number | null {
  const selected = findings.filter(item => item.dimensionId === dimensionId);
  const weight = selected.reduce((sum, item) => sum + item.weight, 0);
  return weight > 0 ? selected.reduce((sum, item) => sum + item.score * item.weight, 0) / weight : null;
}
