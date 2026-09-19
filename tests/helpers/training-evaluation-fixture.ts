import { InMemoryTrainingRepository } from '@/features/training/repository';
import { mvpTrainingScenarios } from '@/features/training/scenarios';
import { TrainingSessionApplicationService } from '@/features/training/session-service';
import { TrainingSessionReplay } from '@/features/training/session-replay';
import { createTrainingSessionReader } from '@/features/training/evaluation/session-reader';
import { InMemoryTrainingResultRepository } from '@/features/training/evaluation/result-repository';
import { HybridEvaluationEngine } from '@/features/training/evaluation/engine';
import type { TrainingAIProvider } from '@/features/training/providers/training-ai-provider';
import type { VerifiedKnowledgeReader } from '@/features/training/ports';
import type { TraineeActionKind } from '@/features/training/engine-types';

export const NOW = '2026-09-19T00:00:00.000Z';
export const SUCCESS_ACTIONS: Record<string, TraineeActionKind[]> = {
  S01: ['ASK_NEEDS', 'ASK_FINANCING'],
  S02: ['EXPLAIN_PROPERTY', 'HANDLE_OBJECTION'],
  S03: ['EXPLAIN_MARKET', 'HANDLE_OBJECTION'],
  S04: ['ASK_FINANCING', 'NEGOTIATE'],
  S05: ['ASK_NEEDS', 'EXPLAIN_MARKET'],
};
/** Synthetic verification fixture only; not evidence of real law or real source approval. */
export function evaluationFixture(scenarioId = 'S01', verified = false) {
  const scenarios = structuredClone(mvpTrainingScenarios);
  if (verified) for (const scenario of scenarios) {
    for (const version of scenario.versions) for (const reference of version.knowledgeRefs) {
      reference.verificationState = 'VERIFIED'; reference.source = 'SYNTHETIC TEST SOURCE';
      reference.effectiveDate = '2026-01-01'; reference.verifiedAt = '2026-09-18T00:00:00.000Z';
    }
  }
  const catalog = new InMemoryTrainingRepository(scenarios);
  const service = new TrainingSessionApplicationService({ scenarioRepository: catalog, clock: { now: () => NOW } });
  const session = service.startSession({ scenarioId, sessionId: 'test-' + scenarioId });
  const reader = createTrainingSessionReader(service.sessionRepository, new TrainingSessionReplay(service.scenarioEngine, service.sessionRepository));
  const versions = (id: string, version: string) => catalog.getScenarioVersion(id, version);
  const results = new InMemoryTrainingResultRepository(reader, versions);
  const knowledge: VerifiedKnowledgeReader = { getKnowledgeReference: async refId => {
    const ref = catalog.getScenarioVersion(scenarioId, scenarioId + '-v1')?.knowledgeRefs.find(item => item.refId === refId);
    return ref ? { ...ref, content: 'SYNTHETIC TEST RULE; not legal guidance.', verificationState: ref.verificationState === 'VERIFIED' ? 'VERIFIED' : 'NEEDS_VERIFICATION' } : null;
  } };
  let command = 0;
  const submit = (kind: TraineeActionKind, text = 'synthetic interaction') => service.submitTraineeMessage(session.sessionId, { commandId: 'c-' + ++command, text, action: { kind } });
  const finish = (actions = SUCCESS_ACTIONS[scenarioId]) => {
    for (const action of actions) submit(action);
    if (service.getSession(session.sessionId).status === 'ACTIVE') service.cancelSession(session.sessionId);
  };
  const engine = (provider?: TrainingAIProvider, knowledgeOverride = knowledge) => new HybridEvaluationEngine({ sessions: reader, versions, results, knowledge: knowledgeOverride, provider, clock: { now: () => NOW } });
  return { catalog, service, session, reader, versions, results, knowledge, submit, finish, engine };
}
