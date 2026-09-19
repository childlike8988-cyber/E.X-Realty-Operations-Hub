import { deepFreeze, type ScenarioRiskRule, type TrainingScenarioVersion } from './types';
import type { TrainingRepository } from './repository';
import { createNpcRuntimeState, defaultNpcEngine, type NpcEngine } from './npc-engine';
import { getScenarioBehavior } from './scenario-behaviors';
import type { AppliedNpcStateDelta, ObjectiveProgress, ScenarioActionRule, ScenarioBehaviorDefinition, ScenarioInformation, ScenarioRuntimeInformation, ScenarioRuntimeState, ScenarioRuntimeView, ScenarioTransitionResult, RiskHit, TrainingEventCandidate, TrainingEventCandidateType, TraineeAction } from './engine-types';

export type CreateScenarioRuntimeOptions = {
  scenarioId: string;
  scenarioVersionId?: string;
  organizationId?: string;
  agentRef?: string;
};

function initialObjectiveProgress(version: TrainingScenarioVersion): readonly ObjectiveProgress[] {
  return version.objectives.map((objective) => ({ objectiveId: objective.objectiveId, label: objective.label, status: 'NOT_STARTED' as const, evidence: [] }));
}

function copyRuntime(runtime: ScenarioRuntimeState): ScenarioRuntimeState {
  return {
    ...runtime,
    trainingTags: [...runtime.trainingTags],
    allowedContextSnapshot: [...runtime.allowedContextSnapshot],
    npcState: { ...runtime.npcState },
    objectiveProgress: runtime.objectiveProgress.map((objective) => ({ ...objective, evidence: [...objective.evidence] })),
    revealedInformationIds: [...runtime.revealedInformationIds],
    riskHits: runtime.riskHits.map((risk) => ({ ...risk })),
    eventCandidates: runtime.eventCandidates.map((event) => ({ ...event, ruleIds: [...event.ruleIds] })),
  };
}

function asRuntimeInformation(item: ScenarioInformation, visibility: ScenarioRuntimeInformation['visibility']): ScenarioRuntimeInformation {
  return { informationId: item.informationId, label: item.label, content: item.content, visibility };
}

function conditionAllows(condition: ScenarioInformation['revealWhen'], action: TraineeAction, runtime: ScenarioRuntimeState): boolean {
  if (!condition) return true;
  if (condition.actionKinds && !condition.actionKinds.includes(action.kind)) return false;
  if (condition.minimumTrust !== undefined && runtime.npcState.trust < condition.minimumTrust) return false;
  if (condition.requiredInformationIds && condition.requiredInformationIds.some((id) => !runtime.revealedInformationIds.includes(id))) return false;
  return true;
}

export class ScenarioEngine {
  constructor(private readonly repository: TrainingRepository, private readonly npcEngine: NpcEngine = defaultNpcEngine) {}

  resolveScenario(scenarioId: string, scenarioVersionId?: string): { scenarioId: string; version: TrainingScenarioVersion; behavior: ScenarioBehaviorDefinition } {
    const scenario = this.repository.getScenario(scenarioId);
    if (!scenario) throw new Error(`Unknown training scenario: ${scenarioId}`);
    const exactVersionId = scenarioVersionId ?? scenario.currentVersionId;
    const version = this.repository.getScenarioVersion(scenarioId, exactVersionId);
    if (!version || version.status !== 'PUBLISHED') throw new Error(`Published scenario version not found: ${scenarioId}/${exactVersionId}`);
    return { scenarioId, version, behavior: getScenarioBehavior(scenarioId, exactVersionId) };
  }

  createRuntime(options: CreateScenarioRuntimeOptions): ScenarioRuntimeState {
    const resolved = this.resolveScenario(options.scenarioId, options.scenarioVersionId);
    const scenario = this.repository.getScenario(options.scenarioId);
    if (!scenario) throw new Error(`Unknown training scenario: ${options.scenarioId}`);
    return deepFreeze({
      organizationId: options.organizationId ?? 'mock-org',
      agentRef: options.agentRef ?? 'mock-agent-01',
      scenarioId: scenario.scenarioId,
      scenarioVersionId: resolved.version.scenarioVersionId,
      scenarioName: scenario.name,
      difficulty: scenario.difficulty,
      trainingTags: [...scenario.trainingTags],
      allowedContextSnapshot: [resolved.version.propertyRef, resolved.version.regionRef, resolved.version.marketSnapshotRef],
      npcDefinitionRef: scenario.npc.npcId,
      npcState: createNpcRuntimeState(scenario.npc),
      objectiveProgress: initialObjectiveProgress(resolved.version),
      revealedInformationIds: [],
      riskHits: [],
      eventCandidates: [],
      status: 'IN_PROGRESS',
      turnCount: 0,
    });
  }

  startScenario(options: CreateScenarioRuntimeOptions): ScenarioRuntimeState {
    return this.createRuntime(options);
  }

  getRuntimeView(runtime: ScenarioRuntimeState): ScenarioRuntimeView {
    const resolved = this.resolveScenario(runtime.scenarioId, runtime.scenarioVersionId);
    const revealed = new Set(runtime.revealedInformationIds);
    const visibleInformation = resolved.behavior.information.flatMap((item) => {
      if (item.visibility === 'SYSTEM_ONLY') return [];
      if (item.visibility === 'PUBLIC') return [asRuntimeInformation(item, 'PUBLIC')];
      if (item.visibility === 'BRIEFING') return [asRuntimeInformation(item, 'BRIEFING')];
      return revealed.has(item.informationId) ? [asRuntimeInformation(item, 'DISCOVERED')] : [];
    });
    return deepFreeze({
      scenarioId: runtime.scenarioId,
      scenarioVersionId: runtime.scenarioVersionId,
      scenarioName: runtime.scenarioName,
      difficulty: runtime.difficulty,
      trainingTags: [...runtime.trainingTags],
      briefing: resolved.behavior.briefing,
      visibleInformation,
      hiddenInformationCount: resolved.behavior.information.filter((item) => (item.visibility === 'HIDDEN' || item.visibility === 'DISCOVERABLE') && !revealed.has(item.informationId)).length,
      systemInformationCount: resolved.behavior.information.filter((item) => item.visibility === 'SYSTEM_ONLY').length,
      npc: { ...runtime.npcState },
      objectiveProgress: runtime.objectiveProgress.map((objective) => ({ ...objective, evidence: [...objective.evidence] })),
      riskHits: runtime.riskHits.map((risk) => ({ ruleId: risk.ruleId, severity: risk.severity, verificationState: risk.verificationState })),
      status: runtime.status,
      turnCount: runtime.turnCount,
    });
  }

  getScenarioRuntimeView(runtime: ScenarioRuntimeState): ScenarioRuntimeView {
    return this.getRuntimeView(runtime);
  }

  applyAction(runtime: ScenarioRuntimeState, action: TraineeAction): ScenarioTransitionResult {
    const resolved = this.resolveScenario(runtime.scenarioId, runtime.scenarioVersionId);
    const scenario = this.repository.getScenario(runtime.scenarioId);
    if (!scenario || runtime.npcDefinitionRef !== scenario.npc.npcId) throw new Error('Runtime NPC definition does not match its scenario.');
    const previousState = deepFreeze(copyRuntime(runtime));
    const configuredRule = resolved.behavior.actionRules[action.kind];
    const rule = this.eligibleRule(configuredRule, runtime);
    const npcTransition = this.npcEngine.respond({ definition: scenario.npc, state: runtime.npcState, action, rule, revealedInformationIds: runtime.revealedInformationIds, previousEvents: runtime.eventCandidates });
    const newlyRevealed = this.resolveReveals(resolved.behavior.information, rule, runtime, action);
    const nextRevealedIds = [...runtime.revealedInformationIds, ...newlyRevealed.map((item) => item.informationId)];
    const nextObjectives = this.advanceObjectives(runtime.objectiveProgress, resolved.version, rule, action);
    const newlyRisked = this.resolveRisks(runtime.riskHits, resolved.version.riskRules, rule);
    const nextRisks = [...runtime.riskHits, ...newlyRisked];
    const triggeredEvents = this.buildEvents(runtime, action, rule, npcTransition.stateDelta, newlyRevealed, newlyRisked, nextObjectives);
    const nextStatus = this.determineOutcome(resolved.behavior, nextObjectives, nextRisks, npcTransition.nextState.trust, action);
    const nextState = deepFreeze({
      ...copyRuntime(runtime),
      npcState: npcTransition.nextState,
      objectiveProgress: nextObjectives,
      revealedInformationIds: nextRevealedIds,
      riskHits: nextRisks,
      eventCandidates: [...runtime.eventCandidates, ...triggeredEvents],
      status: nextStatus,
      turnCount: runtime.turnCount + 1,
    });
    return deepFreeze({ previousState, action: { ...action }, response: npcTransition.response, stateDelta: npcTransition.stateDelta, nextState, revealedInformation: newlyRevealed.map((item) => asRuntimeInformation(item, 'DISCOVERED')), triggeredEvents, objectiveProgress: nextObjectives, riskHits: newlyRisked, outcome: nextStatus });
  }

  advance(runtime: ScenarioRuntimeState, action: TraineeAction): ScenarioTransitionResult {
    return this.applyAction(runtime, action);
  }

  private eligibleRule(rule: ScenarioActionRule | undefined, runtime: ScenarioRuntimeState): ScenarioActionRule | undefined {
    if (!rule) return undefined;
    const eligible = (rule.requiresTrustAtLeast === undefined || runtime.npcState.trust >= rule.requiresTrustAtLeast) && (!rule.requiresInformationIds || rule.requiresInformationIds.every((id) => runtime.revealedInformationIds.includes(id)));
    if (eligible) return rule;
    return { ...rule, revealInformationIds: [], objectiveIds: [], eventTypes: [], riskRuleIds: [] };
  }

  private resolveReveals(information: readonly ScenarioInformation[], rule: ScenarioActionRule | undefined, runtime: ScenarioRuntimeState, action: TraineeAction): ScenarioInformation[] {
    if (!rule?.revealInformationIds) return [];
    const resolved: ScenarioInformation[] = [];
    for (const informationId of rule.revealInformationIds) {
      const item = information.find((candidate) => candidate.informationId === informationId);
      if (item && (item.visibility === 'HIDDEN' || item.visibility === 'DISCOVERABLE') && !runtime.revealedInformationIds.includes(item.informationId) && conditionAllows(item.revealWhen, action, runtime)) resolved.push(item);
    }
    return resolved;
  }

  private advanceObjectives(current: readonly ObjectiveProgress[], version: TrainingScenarioVersion, rule: ScenarioActionRule | undefined, action: TraineeAction): readonly ObjectiveProgress[] {
    const objectives = new Map(version.objectives.map((objective) => [objective.objectiveId, objective]));
    const completed = new Set(rule?.objectiveIds ?? []);
    return current.map((progress) => {
      if (!completed.has(progress.objectiveId) || progress.status === 'MET') return { ...progress, evidence: [...progress.evidence] };
      const objective = objectives.get(progress.objectiveId);
      return { ...progress, status: 'MET' as const, evidence: [...progress.evidence, `ACTION:${action.kind}`, ...(objective?.successEvidence.slice(0, 1) ?? [])] };
    });
  }

  private resolveRisks(existing: readonly RiskHit[], rules: readonly ScenarioRiskRule[], rule: ScenarioActionRule | undefined): readonly RiskHit[] {
    const hits: RiskHit[] = [];
    for (const ruleId of rule?.riskRuleIds ?? []) {
      if (existing.some((hit) => hit.ruleId === ruleId)) continue;
      const risk = rules.find((candidate) => candidate.ruleId === ruleId);
      if (risk) hits.push({ ruleId: risk.ruleId, severity: risk.severity, message: risk.trigger, verificationState: risk.verificationState });
    }
    return hits;
  }

  private buildEvents(runtime: ScenarioRuntimeState, action: TraineeAction, rule: ScenarioActionRule | undefined, stateDelta: AppliedNpcStateDelta, revealed: readonly ScenarioInformation[], risks: readonly RiskHit[], objectives: readonly ObjectiveProgress[]): readonly TrainingEventCandidate[] {
    const eventTypes: TrainingEventCandidateType[] = [];
    for (const eventType of rule?.eventTypes ?? []) {
      if (eventType === 'TRUST_GAINED' && stateDelta.trust <= 0) continue;
      if (eventType === 'TRUST_DROPPED' && stateDelta.trust >= 0) continue;
      if (!eventTypes.includes(eventType)) eventTypes.push(eventType);
    }
    if (stateDelta.trust > 0 && !eventTypes.includes('TRUST_GAINED')) eventTypes.push('TRUST_GAINED');
    if (stateDelta.trust < 0 && !eventTypes.includes('TRUST_DROPPED')) eventTypes.push('TRUST_DROPPED');
    if (revealed.length > 0) eventTypes.push('HIDDEN_NEED_REVEALED');
    if (risks.length > 0) {
      eventTypes.push('RISK_WARNING');
      if (risks.some((risk) => risk.verificationState !== 'VERIFIED')) eventTypes.push('NEEDS_VERIFICATION');
    }
    if ((rule?.objectiveIds ?? []).some((objectiveId) => objectives.some((objective) => objective.objectiveId === objectiveId && objective.status === 'MET'))) eventTypes.push('OBJECTIVE_PROGRESS');
    const uniqueTypes = [...new Set(eventTypes)];
    return uniqueTypes.map((eventType, index) => deepFreeze({
      candidateId: `${runtime.scenarioId}:turn-${runtime.turnCount + 1}:${index + 1}`,
      sequence: runtime.eventCandidates.length + index + 1,
      actor: 'SYSTEM' as const,
      eventType,
      message: this.eventMessage(eventType, action, revealed, risks),
      ruleIds: risks.map((risk) => risk.ruleId),
      verificationState: risks.some((risk) => risk.verificationState !== 'VERIFIED') || eventType === 'NEEDS_VERIFICATION' ? 'NEEDS_VERIFICATION' as const : 'UNKNOWN' as const,
    }));
  }

  private eventMessage(eventType: TrainingEventCandidateType, action: TraineeAction, revealed: readonly ScenarioInformation[], risks: readonly RiskHit[]): string {
    if (eventType === 'HIDDEN_NEED_REVEALED') return `透過 ${action.kind} 探索到 ${revealed.map((item) => item.label).join('、')}。`;
    if (eventType === 'RISK_WARNING') return risks.map((risk) => `風險提示：${risk.message}`).join('；');
    if (eventType === 'NEEDS_VERIFICATION') return '此判定需要回到已驗證知識來源確認。';
    if (eventType === 'OBJECTIVE_PROGRESS') return `目標進度更新：${action.kind}。`;
    return `Mock 事件：${eventType}。`;
  }

  private determineOutcome(behavior: ScenarioBehaviorDefinition, objectives: readonly ObjectiveProgress[], risks: readonly RiskHit[], trust: number, action: TraineeAction): ScenarioRuntimeState['status'] {
    const failed = behavior.failure.some((rule) => rule.type === 'TRUST_AT_OR_BELOW' && trust <= (rule.threshold ?? 0) || rule.type === 'RISK_RULE_HIT' && risks.some((risk) => risk.ruleId === rule.riskRuleId) || rule.type === 'ACTION_USED' && action.kind === rule.actionKind);
    if (failed) return 'FAILURE_CANDIDATE';
    const success = behavior.success.objectiveIds.every((objectiveId) => objectives.some((objective) => objective.objectiveId === objectiveId && objective.status === 'MET')) && trust >= behavior.success.minimumTrust && !risks.some((risk) => behavior.success.disallowedRiskRuleIds.includes(risk.ruleId));
    return success ? 'SUCCESS_CANDIDATE' : 'IN_PROGRESS';
  }
}
