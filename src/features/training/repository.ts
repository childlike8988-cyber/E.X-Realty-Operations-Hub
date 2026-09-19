import { deepFreeze, type AgentSkillProfile, type TrainingEvent, type TrainingRecommendation, type TrainingResult, type SimulationSession, type TrainingScenario, type TrainingScenarioVersion } from './types';
import { mvpTrainingScenarios } from './scenarios';

export interface TrainingRepository {
  listScenarios(): readonly TrainingScenario[];
  getScenario(scenarioId: string): TrainingScenario | undefined;
  getScenarioVersion(scenarioId: string, scenarioVersionId: string): TrainingScenarioVersion | undefined;
  saveSession(session: SimulationSession): SimulationSession;
  getSession(sessionId: string): SimulationSession | undefined;
  appendEvent(event: TrainingEvent): TrainingEvent;
  listEvents(sessionId: string): readonly TrainingEvent[];
  saveResult(result: TrainingResult): TrainingResult;
  getResult(resultId: string): TrainingResult | undefined;
  saveSkillProfile(profile: AgentSkillProfile): AgentSkillProfile;
  getSkillProfile(organizationId: string, agentRef: string): AgentSkillProfile | undefined;
  saveRecommendation(recommendation: TrainingRecommendation): TrainingRecommendation;
  listRecommendations(organizationId: string, agentRef: string): readonly TrainingRecommendation[];
}

export class TrainingRepositoryContractError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TrainingRepositoryContractError';
  }
}

/** Stage 1 storage seam: deterministic, process-local, and intentionally replaceable. */
export class InMemoryTrainingRepository implements TrainingRepository {
  private readonly scenarios = new Map<string, TrainingScenario>();
  private readonly sessions = new Map<string, SimulationSession>();
  private readonly events = new Map<string, TrainingEvent[]>();
  private readonly results = new Map<string, TrainingResult>();
  private readonly skillProfiles = new Map<string, AgentSkillProfile>();
  private readonly recommendations = new Map<string, TrainingRecommendation[]>();

  constructor(scenarioCatalog: readonly TrainingScenario[] = mvpTrainingScenarios) {
    for (const scenario of scenarioCatalog) {
      if (this.scenarios.has(scenario.scenarioId)) throw new TrainingRepositoryContractError(`Duplicate scenario: ${scenario.scenarioId}`);
      this.scenarios.set(scenario.scenarioId, deepFreeze(scenario));
    }
  }

  listScenarios(): readonly TrainingScenario[] {
    return Object.freeze([...this.scenarios.values()]);
  }

  getScenario(scenarioId: string): TrainingScenario | undefined {
    return this.scenarios.get(scenarioId);
  }

  getScenarioVersion(scenarioId: string, scenarioVersionId: string): TrainingScenarioVersion | undefined {
    return this.scenarios.get(scenarioId)?.versions.find((version) => version.scenarioVersionId === scenarioVersionId);
  }

  saveSession(session: SimulationSession): SimulationSession {
    const version = this.getScenarioVersion(session.scenarioId, session.scenarioVersionId);
    if (!version || version.status !== 'PUBLISHED') throw new TrainingRepositoryContractError('Session must reference an existing published scenario version.');
    const stored = deepFreeze({ ...session, eventSequence: Math.max(0, session.eventSequence) });
    this.sessions.set(session.sessionId, stored);
    return stored;
  }

  getSession(sessionId: string): SimulationSession | undefined {
    return this.sessions.get(sessionId);
  }

  appendEvent(event: TrainingEvent): TrainingEvent {
    const session = this.sessions.get(event.sessionId);
    if (!session) throw new TrainingRepositoryContractError('Event must belong to a persisted session.');
    const existing = this.events.get(event.sessionId) ?? [];
    const expectedSequence = existing.length === 0 ? 1 : existing[existing.length - 1].sequence + 1;
    if (event.sequence !== expectedSequence) throw new TrainingRepositoryContractError(`Event sequence must append at ${expectedSequence}.`);
    const stored = deepFreeze(event);
    existing.push(stored);
    this.events.set(event.sessionId, existing);
    this.sessions.set(event.sessionId, deepFreeze({ ...session, eventSequence: event.sequence }));
    return stored;
  }

  listEvents(sessionId: string): readonly TrainingEvent[] {
    return Object.freeze([...(this.events.get(sessionId) ?? [])]);
  }

  saveResult(result: TrainingResult): TrainingResult {
    if (this.results.has(result.resultId)) throw new TrainingRepositoryContractError('Finalized result cannot be overwritten.');
    const session = this.sessions.get(result.sessionId);
    if (!session || session.scenarioId !== result.scenarioId || session.scenarioVersionId !== result.scenarioVersionId || session.agentRef !== result.agentRef) {
      throw new TrainingRepositoryContractError('Result must reference the exact session, scenario version, and agent.');
    }
    if (result.evidence.length === 0) throw new TrainingRepositoryContractError('Professional evaluation results require evidence.');
    const evidenceIds = new Set(result.evidence.map((evidence) => evidence.evidenceId));
    for (const dimension of result.dimensionResults) {
      if (dimension.evidenceRefs.length === 0 || dimension.evidenceRefs.some((evidenceRef) => !evidenceIds.has(evidenceRef))) {
        throw new TrainingRepositoryContractError(`Dimension ${dimension.dimension} must reference stored evaluation evidence.`);
      }
    }
    const stored = deepFreeze(result);
    this.results.set(result.resultId, stored);
    return stored;
  }

  getResult(resultId: string): TrainingResult | undefined {
    return this.results.get(resultId);
  }

  saveSkillProfile(profile: AgentSkillProfile): AgentSkillProfile {
    if (profile.projectionOf !== 'TRAINING_RESULTS') throw new TrainingRepositoryContractError('Skill Profile must remain a TrainingResult projection.');
    const key = `${profile.organizationId}:${profile.agentRef}`;
    const stored = deepFreeze(profile);
    this.skillProfiles.set(key, stored);
    return stored;
  }

  getSkillProfile(organizationId: string, agentRef: string): AgentSkillProfile | undefined {
    return this.skillProfiles.get(`${organizationId}:${agentRef}`);
  }

  saveRecommendation(recommendation: TrainingRecommendation): TrainingRecommendation {
    const key = `${recommendation.organizationId}:${recommendation.agentRef}`;
    const stored = deepFreeze(recommendation);
    const existing = this.recommendations.get(key) ?? [];
    existing.push(stored);
    this.recommendations.set(key, existing);
    return stored;
  }

  listRecommendations(organizationId: string, agentRef: string): readonly TrainingRecommendation[] {
    return Object.freeze([...(this.recommendations.get(`${organizationId}:${agentRef}`) ?? [])]);
  }
}

export const mockTrainingRepository = new InMemoryTrainingRepository();
