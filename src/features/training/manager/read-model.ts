import { deepFreeze } from '../types';
import { DIMENSION_LABELS, type DimensionId, type EvaluationEvidence, type TrainingResult } from '../evaluation/contracts';
import { deriveAgentSkillProfile, type AgentSkillProfileProjection } from '../evaluation/skill-profile';
import type {
  ManagerAgentDetail,
  ManagerAgentFilter,
  ManagerAgentSummary,
  ManagerEvidenceDrilldown,
  ManagerEvidenceEvent,
  ManagerRiskEvent,
  ManagerRiskStatus,
  ManagerResultSummary,
  ManagerScenarioMetadata,
  ManagerSkillMatrixRow,
  ManagerSkillState,
  ManagerTrainingDataSource,
  ManagerTrainingOverview,
  ManagerTrainingRecommendation,
  SyntheticTrainingAgent,
} from './contracts';

const RECOMMENDED_SCENARIO_BY_DIMENSION: Record<DimensionId, string> = {
  NEEDS_DISCOVERY: 'S01',
  COMMUNICATION: 'S01',
  PROPERTY_KNOWLEDGE: 'S02',
  MARKET_INTERPRETATION: 'S03',
  OBJECTION_HANDLING: 'S03',
  NEGOTIATION: 'S04',
  RISK_AWARENESS: 'S03',
  PROFESSIONALISM: 'S05',
};

function latestResults(results: readonly TrainingResult[], organizationId: string, agentRef?: string): readonly TrainingResult[] {
  const bySession = new Map<string, TrainingResult>();
  for (const result of results) {
    if (result.organizationId !== organizationId || (agentRef && result.agentRef !== agentRef)) continue;
    const existing = bySession.get(result.sessionId);
    if (existing?.revision === result.revision && existing.resultId !== result.resultId) throw new Error('MANAGER_RESULT_REVISION_AMBIGUOUS');
    if (!existing || result.revision > existing.revision) bySession.set(result.sessionId, result);
  }
  return [...bySession.values()].sort((left, right) => left.createdAt.localeCompare(right.createdAt) || left.resultId.localeCompare(right.resultId));
}

function riskStatusFor(result: TrainingResult): ManagerRiskStatus {
  if (result.riskSummary.requiresReview || result.overallState === 'REQUIRES_REVIEW') return 'REQUIRES_REVIEW';
  if (result.riskSummary.evidenceRefs.length || result.overallState === 'NEEDS_VERIFICATION') return 'NEEDS_VERIFICATION';
  return 'NONE';
}

function skillState(score: number | null): ManagerSkillState {
  if (score === null) return 'INSUFFICIENT_EVIDENCE';
  if (score >= 80) return 'STRONG';
  if (score >= 60) return 'DEVELOPING';
  return 'NEEDS_PRACTICE';
}

function sourceLabel(reference: EvaluationEvidence['references'][number], sequenceByEventId: ReadonlyMap<string, number>): string {
  if (reference.kind === 'EVENT') return `互動事件 #${reference.sequence}`;
  if (reference.kind === 'OBJECTIVE') return '情境訓練目標';
  if (reference.kind === 'RULE_HIT') return `風險或專業規則 · 事件 #${sequenceByEventId.get(reference.eventId) ?? '?'}`;
  return '已引用知識來源';
}

function lowestWeakness(profile: AgentSkillProfileProjection): DimensionId | null {
  const scored = profile.dimensions.filter((item) => item.score !== null && item.score < 60);
  return scored.sort((left, right) => (left.score ?? 101) - (right.score ?? 101))[0]?.dimensionId ?? null;
}

function strongestDimension(profile: AgentSkillProfileProjection): DimensionId | null {
  return profile.dimensions
    .filter((item) => item.score !== null)
    .sort((left, right) => (right.score ?? -1) - (left.score ?? -1))[0]?.dimensionId ?? null;
}

/**
 * A read-only manager query boundary. It derives from canonical Stage 4 Results,
 * evidence, and Stage 3 events; it owns no session, event, result, or profile storage.
 */
export class TrainingManagerReadModel {
  private readonly source: ManagerTrainingDataSource;
  private readonly agentsByRef: ReadonlyMap<string, SyntheticTrainingAgent>;
  private readonly scenariosById: ReadonlyMap<string, ManagerScenarioMetadata>;
  private readonly eventsById: ReadonlyMap<string, ManagerTrainingDataSource['events'][number]>;

  constructor(source: ManagerTrainingDataSource) {
    this.source = deepFreeze(structuredClone(source));
    if (!this.source.isSynthetic || !this.source.organizationId) throw new Error('MANAGER_DEMO_SCOPE_REQUIRED');
    this.agentsByRef = new Map(this.source.agents.map((agent) => [agent.agentRef, agent]));
    this.scenariosById = new Map(this.source.scenarios.map((scenario) => [scenario.scenarioId, scenario]));
    this.eventsById = new Map(this.source.events.map((event) => [event.eventId, event]));
    for (const result of this.source.results) {
      if (result.organizationId !== this.source.organizationId || !this.agentsByRef.has(result.agentRef)) throw new Error('MANAGER_RESULT_SCOPE_INVALID');
      if (!this.scenariosById.has(result.scenarioId)) throw new Error('MANAGER_SCENARIO_METADATA_MISSING');
    }
  }

  getManagerTrainingOverview(): ManagerTrainingOverview {
    const summaries = this.listAgentSummaries('ALL');
    const allResults = latestResults(this.source.results, this.source.organizationId);
    const newest = allResults.at(-1)?.createdAt;
    const recentCutoff = newest ? Date.parse(newest) - 14 * 24 * 60 * 60 * 1000 : Number.POSITIVE_INFINITY;
    const recommendedAgent = summaries.find((summary) => summary.riskStatus === 'REQUIRES_REVIEW')
      ?? summaries.find((summary) => summary.primaryWeakness !== null)
      ?? null;
    return deepFreeze({
      organizationId: this.source.organizationId,
      isSynthetic: true,
      agentCount: summaries.length,
      completedScenarioCount: summaries.reduce((total, summary) => total + summary.completedScenarioCount, 0),
      recentCompletionCount: allResults.filter((result) => Number.isFinite(Date.parse(result.createdAt)) && Date.parse(result.createdAt) >= recentCutoff).length,
      needsCoachingCount: summaries.filter((summary) => summary.primaryWeakness !== null || summary.riskStatus !== 'NONE').length,
      riskReviewCount: this.listRiskEvents().length,
      recommendedAgent,
    });
  }

  listAgentSummaries(filter: ManagerAgentFilter = 'ALL'): readonly ManagerAgentSummary[] {
    const summaries = this.source.agents.map((agent) => this.getAgentTrainingSummary(agent.agentRef));
    const newest = summaries.map((summary) => summary.recentTrainingAt).filter((value): value is string => value !== null).sort().at(-1);
    const recentCutoff = newest ? Date.parse(newest) - 14 * 24 * 60 * 60 * 1000 : Number.POSITIVE_INFINITY;
    const filtered = summaries.filter((summary) => {
      if (filter === 'NEEDS_COACHING') return summary.primaryWeakness !== null || summary.riskStatus !== 'NONE';
      if (filter === 'RISK_REVIEW') return summary.riskStatus !== 'NONE';
      if (filter === 'RECENTLY_ACTIVE') return summary.recentTrainingAt !== null && Date.parse(summary.recentTrainingAt) >= recentCutoff;
      return true;
    });
    return deepFreeze(filtered.sort((left, right) => {
      const riskOrder = Number(right.riskStatus === 'REQUIRES_REVIEW') - Number(left.riskStatus === 'REQUIRES_REVIEW');
      if (riskOrder) return riskOrder;
      return (right.recentTrainingAt ?? '').localeCompare(left.recentTrainingAt ?? '') || left.agent.displayName.localeCompare(right.agent.displayName, 'zh-Hant');
    }));
  }

  getAgentTrainingSummary(agentRef: string): ManagerAgentSummary {
    const agent = this.agent(agentRef);
    const profile = this.profile(agentRef);
    const results = latestResults(this.source.results, this.source.organizationId, agentRef);
    const latest = results.at(-1);
    const risks = this.listRiskEvents(agentRef);
    const riskStatus = risks.some((risk) => risk.severity === 'REQUIRES_REVIEW')
      ? 'REQUIRES_REVIEW'
      : risks.length ? 'NEEDS_VERIFICATION' : 'NONE';
    return deepFreeze({
      agent,
      completedScenarioCount: profile.completedScenarios.length,
      recentTrainingAt: latest?.createdAt ?? null,
      keyStrength: strongestDimension(profile),
      primaryWeakness: lowestWeakness(profile),
      riskStatus,
      latestResult: latest ? this.resultSummary(latest) : null,
    });
  }

  getAgentTrainingDetail(agentRef: string): ManagerAgentDetail {
    const profile = this.profile(agentRef);
    const results = latestResults(this.source.results, this.source.organizationId, agentRef);
    return deepFreeze({
      summary: this.getAgentTrainingSummary(agentRef),
      profile,
      skillMatrix: this.getSkillMatrix(agentRef),
      results: results.slice().reverse().map((result) => this.resultSummary(result)),
      risks: this.listRiskEvents(agentRef),
      recommendation: this.getRecommendedScenario(agentRef),
    });
  }

  getSkillMatrix(agentRef: string): readonly ManagerSkillMatrixRow[] {
    const profile = this.profile(agentRef);
    return deepFreeze(profile.dimensions.map((dimension) => ({
      dimensionId: dimension.dimensionId,
      label: DIMENSION_LABELS[dimension.dimensionId],
      score: dimension.score,
      state: skillState(dimension.score),
      trend: dimension.trend,
      resultRefs: dimension.resultRefs,
    })));
  }

  getEvidenceDrilldown(resultId: string, evidenceId: string): ManagerEvidenceDrilldown {
    const result = this.source.results.find((item) => item.resultId === resultId);
    const evidence = result?.evidence.find((item) => item.evidenceId === evidenceId);
    if (!result || !evidence) throw new Error('MANAGER_EVIDENCE_NOT_FOUND');
    const eventIds = [...new Set(evidence.references.flatMap((reference) => {
      if (reference.kind === 'EVENT' || reference.kind === 'RULE_HIT') return [reference.eventId];
      return [];
    }))];
    const events = eventIds.map((eventId) => {
      const event = this.eventsById.get(eventId);
      if (!event || event.sessionId !== result.sessionId) throw new Error('MANAGER_EVIDENCE_EVENT_TRACE_INVALID');
      const safeEvent: ManagerEvidenceEvent = {
        sequence: event.sequence,
        timestamp: event.timestamp,
        actor: event.actor,
        eventType: event.eventType,
        message: event.message,
      };
      return safeEvent;
    }).sort((left, right) => left.sequence - right.sequence);
    const sequenceByEventId = new Map(eventIds.map((eventId) => [eventId, this.eventsById.get(eventId)?.sequence ?? 0]));
    return deepFreeze({
      evidenceId: evidence.evidenceId,
      finding: evidence.finding,
      kind: evidence.kind,
      dimensionId: evidence.dimensionId,
      dimensionLabel: DIMENSION_LABELS[evidence.dimensionId],
      verificationState: evidence.verificationState,
      result: this.resultSummary(result),
      events,
      sourceLabels: evidence.references.map((reference) => sourceLabel(reference, sequenceByEventId)),
    });
  }

  getDimensionEvidence(agentRef: string, dimensionId: DimensionId): readonly ManagerEvidenceDrilldown[] {
    const row = this.getSkillMatrix(agentRef).find((item) => item.dimensionId === dimensionId);
    if (!row) throw new Error('MANAGER_DIMENSION_NOT_FOUND');
    const unique = new Map<string, ManagerEvidenceDrilldown>();
    for (const resultRef of row.resultRefs) {
      for (const evidenceId of resultRef.evidenceRefs) unique.set(`${resultRef.resultId}:${evidenceId}`, this.getEvidenceDrilldown(resultRef.resultId, evidenceId));
    }
    return deepFreeze([...unique.values()]);
  }

  listRiskEvents(agentRef?: string): readonly ManagerRiskEvent[] {
    const output: ManagerRiskEvent[] = [];
    const seenRiskEvents = new Set<string>();
    for (const result of latestResults(this.source.results, this.source.organizationId, agentRef)) {
      const agent = this.agent(result.agentRef);
      const scenario = this.scenario(result.scenarioId);
      const severity = riskStatusFor(result);
      const riskEvidence = result.evidence.filter((item) => item.kind === 'RISK');
      const verificationEvidence = severity === 'NONE' ? [] : riskEvidence.length
        ? riskEvidence : result.evidence.filter((item) => item.verificationState !== 'VERIFIED').slice(0, 1);
      for (const evidence of verificationEvidence) {
        const sourceEventId = evidence.references.find((reference) => reference.kind === 'RULE_HIT' || reference.kind === 'EVENT')?.eventId;
        const riskId = `${result.resultId}:${sourceEventId ?? evidence.evidenceId}`;
        // One interaction/risk rule can contribute to multiple dimensions; surface it once in the review queue.
        if (seenRiskEvents.has(riskId)) continue;
        seenRiskEvents.add(riskId);
        output.push({
          riskId,
          agent,
          scenarioId: scenario.scenarioId,
          scenarioName: scenario.name,
          createdAt: result.createdAt,
          severity: severity === 'REQUIRES_REVIEW' ? 'REQUIRES_REVIEW' : 'NEEDS_VERIFICATION',
          summary: evidence.finding,
          // Unknown source state is deliberately surfaced fail-closed to a manager as needing verification.
          verificationState: evidence.verificationState === 'VERIFIED' ? 'VERIFIED' : 'NEEDS_VERIFICATION',
          resultId: result.resultId,
          evidenceId: evidence.evidenceId,
        });
      }
    }
    return deepFreeze(output.sort((left, right) => Number(right.severity === 'REQUIRES_REVIEW') - Number(left.severity === 'REQUIRES_REVIEW') || right.createdAt.localeCompare(left.createdAt)));
  }

  getRecommendedScenario(agentRef: string): ManagerTrainingRecommendation | null {
    const risks = this.listRiskEvents(agentRef);
    const matrix = this.getSkillMatrix(agentRef);
    const priorityRisk = risks.find((risk) => risk.severity === 'REQUIRES_REVIEW');
    const candidate = priorityRisk
      ? matrix.find((row) => row.dimensionId === 'RISK_AWARENESS') ?? matrix[0]
      : matrix.filter((row) => row.state === 'NEEDS_PRACTICE').sort((left, right) => (left.score ?? 101) - (right.score ?? 101))[0]
        ?? matrix.find((row) => row.state === 'INSUFFICIENT_EVIDENCE')
        ?? matrix[0];
    if (!candidate) return null;
    const scenarioId = priorityRisk?.scenarioId ?? RECOMMENDED_SCENARIO_BY_DIMENSION[candidate.dimensionId];
    const scenario = this.scenario(scenarioId);
    const references = candidate.resultRefs;
    const evidenceRefs = references.flatMap((reference) => reference.evidenceRefs);
    const reason = priorityRisk
      ? `先回到 ${scenario.name}，複盤需要複核的風險事件與可驗證依據。`
      : candidate.score === null
        ? `${candidate.label}目前證據不足；建議透過 ${scenario.name} 累積可追溯的互動證據。`
        : `${candidate.label}是近期需要加強的面向；建議以 ${scenario.name} 練習下一個可觀察的對話步驟。`;
    return deepFreeze({
      scenarioId,
      scenarioName: scenario.name,
      dimensionId: candidate.dimensionId,
      reason,
      supportingResultIds: references.map((reference) => reference.resultId),
      supportingEvidenceRefs: evidenceRefs,
    });
  }

  private profile(agentRef: string): AgentSkillProfileProjection {
    this.agent(agentRef);
    return deriveAgentSkillProfile(this.source.results, this.source.organizationId, agentRef);
  }

  private resultSummary(result: TrainingResult): ManagerResultSummary {
    const scenario = this.scenario(result.scenarioId);
    return deepFreeze({
      resultId: result.resultId,
      sessionId: result.sessionId,
      scenarioId: result.scenarioId,
      scenarioName: scenario.name,
      createdAt: result.createdAt,
      overallState: result.overallState,
      overallScore: result.overallScore,
      objectiveResult: result.objectiveResult,
      verificationState: result.verificationState,
      riskStatus: riskStatusFor(result),
      evidenceCount: result.evidence.length,
    });
  }

  private agent(agentRef: string): SyntheticTrainingAgent {
    const agent = this.agentsByRef.get(agentRef);
    if (!agent) throw new Error('MANAGER_AGENT_NOT_FOUND');
    return agent;
  }

  private scenario(scenarioId: string): ManagerScenarioMetadata {
    const scenario = this.scenariosById.get(scenarioId);
    if (!scenario) throw new Error('MANAGER_SCENARIO_NOT_FOUND');
    return scenario;
  }
}
