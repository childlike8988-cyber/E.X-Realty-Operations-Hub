import type { TrainingAIProvider, TrainingConversationEvaluationRequest, TrainingEvaluationExplanationRequest, TrainingNpcResponse, TrainingProviderEvaluation, TrainingProviderExplanation, TrainingScenarioDraft, TrainingScenarioDraftRequest, TrainingNpcResponseRequest } from './training-ai-provider';

const PROVIDER_ID = 'mock-training-provider';
const VERIFICATION_STATE = 'NEEDS_VERIFICATION' as const;

function trace(operation: string, key: string) {
  return { providerId: PROVIDER_ID, isMock: true, traceRef: `mock-training:${operation}:${key}`, verificationState: VERIFICATION_STATE };
}

/** Deterministic local provider; no network or vendor SDK is used in Stage 1. */
export class MockTrainingAIProvider implements TrainingAIProvider {
  readonly providerId = PROVIDER_ID;
  readonly isMock = true;

  async generateNpcResponse(request: TrainingNpcResponseRequest): Promise<TrainingNpcResponse> {
    return {
      ...trace('npc-response', request.session.sessionId),
      message: `Mock NPC 回應：已收到「${request.traineeMessage}」，請繼續探索需求與情境證據。`,
      statePatch: { emotion: 'CURIOUS', trust: Math.min(100, request.npc.trust + 4), interest: Math.min(100, request.npc.interest + 3), intent: 'CONTINUE', },
    };
  }

  async evaluateConversation(request: TrainingConversationEvaluationRequest): Promise<TrainingProviderEvaluation> {
    return {
      ...trace('evaluation', request.sessionId),
      advisory: 'Mock 教練建議：回顧已記錄的提問、回應與可驗證依據。',
      confidence: 0.4,
      rationale: `Mock advisory based on ${request.structuredEvents.length} structured events; no scoring authority.`,
    };
  }

  async generateScenarioDraft(request: TrainingScenarioDraftRequest): Promise<TrainingScenarioDraft> {
    return {
      ...trace('scenario-draft', request.scenarioId),
      scenarioId: request.scenarioId,
      summary: `Mock Scenario Draft：${request.prompt}`,
      suggestedVersion: { version: 1, status: 'DRAFT' },
    };
  }

  async explainEvaluation(request: TrainingEvaluationExplanationRequest): Promise<TrainingProviderExplanation> {
    return {
      ...trace('explanation', request.sessionId),
      advisory: 'Mock 說明：請以評估結果的事件證據與待確認事項作為練習依據。',
      confidence: 0.4,
      rationale: 'Coaching wording only; verified rules remain authoritative.',
    };
  }
}

export const mockTrainingAIProvider = new MockTrainingAIProvider();
