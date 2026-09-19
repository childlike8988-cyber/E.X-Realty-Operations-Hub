import { deepFreeze, type TrainingDifficulty } from './types';
import type { TrainingRepository } from './repository';
import type { TraineeActionKind, ScenarioRuntimeInformation, ScenarioTransitionResult } from './engine-types';
import type { TrainingSessionStatus } from './session-types';
import { isTerminalSessionStatus } from './session-types';
import type { TraineeSessionView, TrainingSessionApplicationService } from './session-service';
import type { HybridEvaluationEngine } from './evaluation/engine';
import { DIMENSION_LABELS, type DimensionId, type TrainingResult } from './evaluation/contracts';
import type { TrainingResultRepository } from './evaluation/result-repository';

export type ScenarioCompletionState = 'NOT_STARTED' | 'COMPLETED';

export type TrainingScenarioCatalogItem = {
  scenarioId: string;
  name: string;
  persona: string;
  difficulty: TrainingDifficulty;
  skillFocus: readonly string[];
  estimatedDurationMinutes: number;
  completionState: ScenarioCompletionState;
};

export type TrainingBriefingView = {
  scenarioId: string;
  scenarioVersionId: string;
  name: string;
  persona: string;
  difficulty: TrainingDifficulty;
  skillFocus: readonly string[];
  estimatedDurationMinutes: number;
  mission: string;
  knownInformation: readonly ScenarioRuntimeInformation[];
  objectives: readonly { objectiveId: string; label: string }[];
};

export type TrainingContextTool = {
  contextId: string;
  kind: 'PROPERTY' | 'MARKET' | 'REGION' | 'KNOWLEDGE';
  label: string;
  reference: string;
  summary: string;
  verificationState: 'VERIFIED' | 'NEEDS_VERIFICATION' | 'UNKNOWN';
};

export type TrainingWorkspaceView = {
  session: TraineeSessionView;
  contextTools: readonly TrainingContextTool[];
};

export type TrainingReactionView = {
  response: string;
  action: TraineeActionKind;
  stateDelta: Pick<ScenarioTransitionResult['stateDelta'], 'trust' | 'interest' | 'pressure' | 'emotion' | 'intent'>;
  revealedInformation: readonly ScenarioRuntimeInformation[];
  eventTypes: readonly string[];
};

export type TrainingInteractionView = {
  workspace: TrainingWorkspaceView;
  reaction: TrainingReactionView;
  duplicate: boolean;
};

export type TrainingRecommendationView = {
  scenarioId: string;
  reason: string;
};

export type TrainingExperienceDependencies = {
  catalog: TrainingRepository;
  sessions: TrainingSessionApplicationService;
  evaluation: HybridEvaluationEngine;
  results: TrainingResultRepository;
};

const DURATION_BY_SCENARIO: Readonly<Record<string, number>> = {
  S01: 8,
  S02: 9,
  S03: 10,
  S04: 10,
  S05: 10,
};

const PRACTICE_SCENARIO_BY_DIMENSION: Readonly<Record<DimensionId, string>> = {
  NEEDS_DISCOVERY: 'S01',
  COMMUNICATION: 'S01',
  PROPERTY_KNOWLEDGE: 'S02',
  MARKET_INTERPRETATION: 'S03',
  OBJECTION_HANDLING: 'S03',
  NEGOTIATION: 'S04',
  RISK_AWARENESS: 'S03',
  PROFESSIONALISM: 'S05',
};

function durationFor(scenarioId: string): number {
  return DURATION_BY_SCENARIO[scenarioId] ?? 10;
}

function contextLabel(kind: TrainingContextTool['kind']): string {
  if (kind === 'PROPERTY') return '物件資料';
  if (kind === 'MARKET') return '行情資料';
  if (kind === 'REGION') return '區域資料';
  return '查證資料';
}

/**
 * Stage 5A application adapter. It orchestrates already-canonical Stage 3/4
 * services and returns only trainee-safe projections; it never changes NPC,
 * event, outcome or evaluation state itself.
 */
export class TrainingExperienceService {
  constructor(private readonly dependencies: TrainingExperienceDependencies) {}

  listScenarios(completedScenarioIds: ReadonlySet<string> = new Set()): readonly TrainingScenarioCatalogItem[] {
    return deepFreeze(this.dependencies.catalog.listScenarios().map((scenario) => ({
      scenarioId: scenario.scenarioId,
      name: scenario.name,
      persona: scenario.npc.persona,
      difficulty: scenario.difficulty,
      skillFocus: [...scenario.trainingTags],
      estimatedDurationMinutes: durationFor(scenario.scenarioId),
      completionState: completedScenarioIds.has(scenario.scenarioId) ? 'COMPLETED' as const : 'NOT_STARTED' as const,
    })));
  }

  getBriefing(scenarioId: string): TrainingBriefingView {
    const scenario = this.dependencies.catalog.getScenario(scenarioId);
    if (!scenario) throw new Error('UNKNOWN_SCENARIO:' + scenarioId);
    const runtime = this.dependencies.sessions.scenarioEngine.createRuntime({ scenarioId });
    const view = this.dependencies.sessions.scenarioEngine.getRuntimeView(runtime);
    return deepFreeze({
      scenarioId: view.scenarioId,
      scenarioVersionId: view.scenarioVersionId,
      name: view.scenarioName,
      persona: scenario.npc.persona,
      difficulty: view.difficulty,
      skillFocus: [...view.trainingTags],
      estimatedDurationMinutes: durationFor(view.scenarioId),
      mission: view.briefing,
      // RuntimeView is the Stage 2 safe projection: no HIDDEN or SYSTEM_ONLY
      // content is present in this list.
      knownInformation: view.visibleInformation.filter((item) => item.visibility === 'PUBLIC' || item.visibility === 'BRIEFING'),
      objectives: view.objectiveProgress.map((objective) => ({ objectiveId: objective.objectiveId, label: objective.label })),
    });
  }

  startSession(scenarioId: string, sessionId?: string): TrainingWorkspaceView {
    const session = this.dependencies.sessions.startSession({ scenarioId, sessionId });
    return this.getWorkspace(session.sessionId);
  }

  submitMessage(sessionId: string, commandId: string, text: string): TrainingInteractionView {
    if (!text.trim()) throw new Error('MESSAGE_REQUIRED');
    const result = this.dependencies.sessions.submitTraineeMessage(sessionId, { commandId, text });
    return deepFreeze({
      workspace: this.getWorkspace(sessionId),
      duplicate: result.duplicate,
      reaction: {
        response: result.transition.response,
        action: result.transition.action.kind,
        stateDelta: {
          trust: result.transition.stateDelta.trust,
          interest: result.transition.stateDelta.interest,
          pressure: result.transition.stateDelta.pressure,
          emotion: result.transition.stateDelta.emotion,
          intent: result.transition.stateDelta.intent,
        },
        revealedInformation: result.transition.revealedInformation.map((item) => ({ ...item })),
        eventTypes: result.transition.triggeredEvents.map((event) => event.eventType),
      },
    });
  }

  cancelSession(sessionId: string): TrainingWorkspaceView {
    this.dependencies.sessions.cancelSession(sessionId);
    return this.getWorkspace(sessionId);
  }

  async evaluateSession(sessionId: string): Promise<TrainingResult> {
    const session = this.dependencies.sessions.getSession(sessionId);
    if (!isTerminalSessionStatus(session.status)) throw new Error('EVALUATION_REQUIRES_TERMINAL_SESSION');
    return this.dependencies.evaluation.evaluate(sessionId);
  }

  getLatestResult(sessionId: string): TrainingResult | undefined {
    return this.dependencies.results.getLatestResult(sessionId);
  }

  getWorkspace(sessionId: string): TrainingWorkspaceView {
    const session = this.dependencies.sessions.getSession(sessionId);
    const traineeView = this.dependencies.sessions.getSessionView(sessionId);
    const allowed = new Set(session.allowedContextSnapshot);
    const contextTools = session.contextSnapshot
      .filter((item) => allowed.has(item.refId))
      .map((item): TrainingContextTool => ({
        contextId: item.kind + ':' + item.refId,
        kind: item.kind,
        label: contextLabel(item.kind),
        reference: item.refId,
        summary: item.kind === 'KNOWLEDGE'
          ? '此資料僅供辨識需要回到已驗證來源查核的事項。'
          : item.summary ?? ('Mock ' + item.kind.toLowerCase() + ' snapshot: ' + item.refId),
        verificationState: item.verificationState,
      }));
    return deepFreeze({ session: traineeView, contextTools });
  }

  suggestNextScenario(result: TrainingResult): TrainingRecommendationView {
    const current = this.dependencies.catalog.getScenario(result.scenarioId);
    if (!current) throw new Error('UNKNOWN_SCENARIO:' + result.scenarioId);
    if (result.riskSummary.requiresReview) {
      return deepFreeze({ scenarioId: current.scenarioId, reason: '先重練此情境，聚焦風險事件與可查證說明。' });
    }
    if (result.overallState === 'INSUFFICIENT_EVIDENCE') {
      return deepFreeze({ scenarioId: current.scenarioId, reason: '目前證據不足；建議重練並完成更多有效對話。' });
    }
    const weakest = result.dimensionResults
      .filter((item): item is Extract<typeof item, { state: 'SCORED' }> => item.state === 'SCORED')
      .sort((left, right) => left.score - right.score || left.dimensionId.localeCompare(right.dimensionId))[0];
    if (weakest) {
      const scenarioId = PRACTICE_SCENARIO_BY_DIMENSION[weakest.dimensionId];
      return deepFreeze({ scenarioId, reason: '可透過「' + DIMENSION_LABELS[weakest.dimensionId] + '」主題進一步練習。' });
    }
    return deepFreeze({ scenarioId: current.scenarioId, reason: '建議重練目前情境，補足可追溯的互動證據。' });
  }

  isTerminal(sessionId: string): boolean {
    const status: TrainingSessionStatus = this.dependencies.sessions.getSession(sessionId).status;
    return isTerminalSessionStatus(status);
  }
}
