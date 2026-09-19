import { HybridEvaluationEngine } from '../evaluation/engine';
import { InMemoryTrainingResultRepository } from '../evaluation/result-repository';
import { createTrainingSessionReader } from '../evaluation/session-reader';
import type { VerifiedKnowledgeReader } from '../ports';
import { InMemoryTrainingRepository } from '../repository';
import { mvpTrainingScenarios } from '../scenarios';
import { TrainingSessionReplay } from '../session-replay';
import { TrainingSessionApplicationService, type TrainingClock } from '../session-service';
import type { TraineeActionKind } from '../engine-types';
import type { ScenarioKnowledgeReference, TrainingScenario } from '../types';
import { deepFreeze } from '../types';
import type { ManagerTrainingDataSource, SyntheticTrainingAgent } from './contracts';

const ORGANIZATION_ID = 'synthetic-training-showcase';
const SYNTHETIC_SOURCE = 'Synthetic Training Knowledge Pack';
const SYNTHETIC_VERSION = '2026.09-manager-demo';

const agents: readonly SyntheticTrainingAgent[] = deepFreeze([
  { agentRef: 'agent-lin-ruo-an', displayName: '林若安', trainingStage: '新進訓練', isSynthetic: true },
  { agentRef: 'agent-chen-yu-xuan', displayName: '陳昱璇', trainingStage: '新進訓練', isSynthetic: true },
  { agentRef: 'agent-wu-ting-yu', displayName: '吳庭瑜', trainingStage: '情境練習', isSynthetic: true },
  { agentRef: 'agent-huang-yi-ren', displayName: '黃奕仁', trainingStage: '進階演練', isSynthetic: true },
  { agentRef: 'agent-zhao-wei-ting', displayName: '趙維庭', trainingStage: '新進訓練', isSynthetic: true },
]);

type FixturePlan = {
  agentRef: string;
  scenarioId: string;
  actions: readonly TraineeActionKind[];
};

const plans: readonly FixturePlan[] = [
  { agentRef: 'agent-lin-ruo-an', scenarioId: 'S01', actions: ['ASK_NEEDS', 'ASK_FINANCING'] },
  { agentRef: 'agent-lin-ruo-an', scenarioId: 'S04', actions: ['ASK_FINANCING', 'PRESSURE_CLOSE'] },
  { agentRef: 'agent-chen-yu-xuan', scenarioId: 'S01', actions: ['ASK_NEEDS', 'ASK_FINANCING'] },
  { agentRef: 'agent-chen-yu-xuan', scenarioId: 'S03', actions: ['EXPLAIN_MARKET', 'HANDLE_OBJECTION'] },
  { agentRef: 'agent-wu-ting-yu', scenarioId: 'S04', actions: ['ASK_FINANCING', 'NEGOTIATE'] },
  { agentRef: 'agent-wu-ting-yu', scenarioId: 'S05', actions: ['ASK_NEEDS', 'PRESSURE_CLOSE'] },
  { agentRef: 'agent-huang-yi-ren', scenarioId: 'S02', actions: ['EXPLAIN_PROPERTY', 'HANDLE_OBJECTION'] },
  { agentRef: 'agent-huang-yi-ren', scenarioId: 'S05', actions: ['ASK_NEEDS', 'EXPLAIN_MARKET'] },
  { agentRef: 'agent-zhao-wei-ting', scenarioId: 'S03', actions: ['PRESSURE_CLOSE'] },
  { agentRef: 'agent-zhao-wei-ting', scenarioId: 'S04', actions: ['ASK_FINANCING', 'NEGOTIATE'] },
];

function syntheticScenarios(): readonly TrainingScenario[] {
  return mvpTrainingScenarios.map((scenario) => {
    const knowledgeRefs = scenario.knowledgeRefs.map((reference) => ({
      ...reference,
      source: SYNTHETIC_SOURCE,
      version: SYNTHETIC_VERSION,
      effectiveDate: '2026-08-01',
      verifiedAt: '2026-08-31',
      verificationState: 'VERIFIED' as const,
    }));
    const versions = scenario.versions.map((version) => ({ ...version, knowledgeRefs }));
    return { ...scenario, knowledgeRefs, versions };
  });
}

function fixedClock(): TrainingClock {
  let tick = 0;
  return {
    now() {
      const value = new Date(Date.UTC(2026, 8, 1, 8 + tick, 0, 0));
      tick += 1;
      return value.toISOString();
    },
  };
}

function fixtureKnowledgeReader(references: readonly ScenarioKnowledgeReference[]): VerifiedKnowledgeReader {
  const byId = new Map(references.map((reference) => [reference.refId, reference]));
  return {
    async getKnowledgeReference(refId) {
      // S03 deliberately demonstrates the product's fail-closed verification state.
      if (refId.startsWith('S03-')) return null;
      const reference = byId.get(refId);
      if (!reference) return null;
      return {
        refId: reference.refId,
        source: reference.source,
        version: reference.version,
        effectiveDate: reference.effectiveDate,
        verifiedAt: reference.verifiedAt,
        ruleId: reference.ruleId,
        verificationState: 'VERIFIED',
        content: 'Synthetic, verified-shaped training reference. It is not production legal or market advice.',
      };
    },
  };
}

function actionText(action: TraineeActionKind): string {
  const copy: Record<TraineeActionKind, string> = {
    ASK_NEEDS: '想先了解目前最在意的生活需求與安排。',
    ASK_BUDGET: '想確認預算與總價考量。',
    ASK_FINANCING: '想先釐清每月負擔與貸款安排。',
    EXPLAIN_PROPERTY: '依照生活動線說明物件條件。',
    EXPLAIN_MARKET: '先一起確認成交條件與可驗證的市場資料。',
    HANDLE_OBJECTION: '理解這個疑慮，先把比較條件整理清楚。',
    NEGOTIATE: '把價格和條件一起整理成可回報的方案。',
    BUILD_TRUST: '不用急著決定，先把顧慮講清楚。',
    PRESSURE_CLOSE: '現在就決定，這個機會不會再有。',
    DISCLOSE_RISK: '有需要再確認的資料，會先清楚標示。',
    UNKNOWN: '想繼續了解。',
  };
  return copy[action];
}

/**
 * Builds only synthetic showcase data by exercising the real Stage 3 and 4 paths.
 * No database, Customer record, provider network call, or fabricated Result is involved.
 */
export async function createSyntheticManagerTrainingFixture(): Promise<ManagerTrainingDataSource> {
  const scenarios = syntheticScenarios();
  const catalog = new InMemoryTrainingRepository(scenarios);
  const clock = fixedClock();
  const sessions = new TrainingSessionApplicationService({ scenarioRepository: catalog, clock });
  const replay = new TrainingSessionReplay(sessions.scenarioEngine, sessions.sessionRepository);
  const reader = createTrainingSessionReader(sessions.sessionRepository, replay);
  const versions = (scenarioId: string, versionId: string) => catalog.getScenarioVersion(scenarioId, versionId);
  const results = new InMemoryTrainingResultRepository(reader, versions);
  const knowledge = fixtureKnowledgeReader(scenarios.flatMap((scenario) => scenario.knowledgeRefs));
  const evaluation = new HybridEvaluationEngine({ sessions: reader, versions, results, knowledge, clock });
  const allEvents = [] as Array<ReturnType<typeof sessions.sessionRepository.listEvents>[number]>;
  const allResults = [] as Awaited<ReturnType<typeof evaluation.evaluate>>[];

  for (const [index, plan] of plans.entries()) {
    const sessionId = `synthetic-manager-${plan.agentRef}-${plan.scenarioId}-${index + 1}`;
    sessions.startSession({ scenarioId: plan.scenarioId, organizationId: ORGANIZATION_ID, agentRef: plan.agentRef, sessionId });
    for (const [actionIndex, action] of plan.actions.entries()) {
      if (sessions.getSession(sessionId).status !== 'ACTIVE') break;
      sessions.submitTraineeMessage(sessionId, {
        commandId: `${sessionId}:command:${actionIndex + 1}`,
        text: actionText(action),
        action: { kind: action, text: actionText(action) },
      });
    }
    if (sessions.getSession(sessionId).status === 'ACTIVE') sessions.cancelSession(sessionId, 'Synthetic manager fixture ended the incomplete practice.');
    allResults.push(await evaluation.evaluate(sessionId));
    allEvents.push(...sessions.sessionRepository.listEvents(sessionId));
  }

  return deepFreeze({
    organizationId: ORGANIZATION_ID,
    isSynthetic: true,
    agents,
    scenarios: scenarios.map((scenario) => ({
      scenarioId: scenario.scenarioId,
      scenarioVersionId: scenario.currentVersionId,
      name: scenario.name,
      persona: scenario.npc.persona,
      difficulty: scenario.difficulty,
      skillFocus: scenario.trainingTags,
    })),
    results: allResults,
    events: allEvents,
  });
}

export { ORGANIZATION_ID as SYNTHETIC_TRAINING_ORGANIZATION_ID };
