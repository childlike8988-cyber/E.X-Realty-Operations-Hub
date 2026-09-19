import { deepFreeze, type ScenarioKnowledgeReference } from '../types';
import type { TrainingAdvisoryInput } from '../providers/training-ai-provider';
import type { TrainingSessionReader } from './contracts';

/** An explicit allowlist, never a spread of internal Session or Event payloads. */
export function createTrainingAdvisoryInput(reader: TrainingSessionReader, sessionId: string, verifiedKnowledgeRefs: readonly ScenarioKnowledgeReference[]): TrainingAdvisoryInput {
  const session = reader.getSession(sessionId);
  const replay = reader.getReplayState(sessionId);
  return deepFreeze({
    scenarioVersionRef: session.scenarioVersionId, sessionId, agentRef: session.agentRef,
    structuredEvents: reader.getEvents(sessionId).map(event => ({
      eventId: event.eventId, sequence: event.sequence, eventType: event.eventType, actor: event.actor,
      action: event.eventType === 'TRAINEE_ACTION' ? event.payload.action.kind : undefined,
    })),
    objectiveState: replay.objectiveProgress.map(({ objectiveId, status }) => ({ objectiveId, status })),
    riskHits: replay.riskHits.map(({ ruleId, severity, verificationState }) => ({ ruleId, severity, verificationState })),
    npcRuntimeSummary: { emotion: replay.npcState.emotion, intent: replay.npcState.intent },
    allowedContextSnapshot: session.contextSnapshot.map(({ kind, refId, capturedAt, version, verificationState }) => ({ kind, refId, capturedAt, version, verificationState })),
    verifiedKnowledgeRefs: verifiedKnowledgeRefs.filter(ref => ref.verificationState === 'VERIFIED').map(ref => ({ refId: ref.refId, source: ref.source, version: ref.version, effectiveDate: ref.effectiveDate, verifiedAt: ref.verifiedAt, ruleId: ref.ruleId, verificationState: ref.verificationState })),
  });
}
