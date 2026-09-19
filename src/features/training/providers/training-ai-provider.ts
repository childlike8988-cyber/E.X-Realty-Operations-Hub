import type { SimulationSession, TrainingNpc, TrainingScenarioVersion, VerificationState } from '../types';
import type { DeepReadonly } from '../evaluation/contracts';

export type TrainingProviderTrace = {
  providerId: string;
  isMock: boolean;
  traceRef: string;
  verificationState: VerificationState;
};

export type TrainingNpcResponseRequest = {
  session: SimulationSession;
  npc: TrainingNpc;
  traineeMessage: string;
};

export type TrainingNpcResponse = TrainingProviderTrace & {
  message: string;
  statePatch: Partial<Pick<TrainingNpc, 'emotion' | 'trust' | 'interest' | 'pressure' | 'intent'>>;
};

export type TrainingAdvisoryInput = DeepReadonly<{
  scenarioVersionRef: string; sessionId: string; agentRef: string;
  structuredEvents: { eventId: string; sequence: number; eventType: string; actor: string; action?: string }[];
  objectiveState: { objectiveId: string; status: string }[];
  riskHits: { ruleId: string; severity: string; verificationState: VerificationState }[];
  npcRuntimeSummary: { emotion: string; intent: string };
  allowedContextSnapshot: { kind: string; refId: string; capturedAt: string; version?: string; verificationState: VerificationState }[];
  verifiedKnowledgeRefs: { refId: string; source: string; version: string; effectiveDate: string; verifiedAt: string; ruleId: string; verificationState: VerificationState }[];
}>;
export type TrainingConversationEvaluationRequest = TrainingAdvisoryInput;

export type TrainingProviderEvaluation = TrainingProviderTrace & {
  advisory: string;
  confidence: number;
  rationale: string;
};

export type TrainingScenarioDraftRequest = {
  scenarioId: string;
  prompt: string;
};

export type TrainingScenarioDraft = TrainingProviderTrace & {
  scenarioId: string;
  summary: string;
  suggestedVersion: Pick<TrainingScenarioVersion, 'version' | 'status'>;
};

export type TrainingEvaluationExplanationRequest = TrainingAdvisoryInput;

export type TrainingProviderExplanation = TrainingProviderEvaluation;

export interface TrainingAIProvider {
  readonly providerId: string;
  readonly isMock: boolean;
  generateNpcResponse(request: TrainingNpcResponseRequest): Promise<TrainingNpcResponse>;
  evaluateConversation(request: TrainingConversationEvaluationRequest): Promise<TrainingProviderEvaluation>;
  generateScenarioDraft(request: TrainingScenarioDraftRequest): Promise<TrainingScenarioDraft>;
  explainEvaluation(request: TrainingEvaluationExplanationRequest): Promise<TrainingProviderExplanation>;
}
