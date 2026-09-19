import type { TrainingSessionRepository } from '../session-repository';
import type { TrainingSessionReplay } from '../session-replay';
import type { TrainingSessionReader } from './contracts';

/** Delegates to the canonical Stage 3 store. Owns no session or event storage. */
export function createTrainingSessionReader(repository: TrainingSessionRepository, replay: TrainingSessionReplay): TrainingSessionReader {
  return Object.freeze({
    getSession(sessionId: string) {
      const session = repository.getSession(sessionId);
      if (!session) throw new Error('SESSION_NOT_FOUND');
      return session;
    },
    getEvents: (sessionId: string) => repository.listEvents(sessionId),
    getReplayState: (sessionId: string) => replay.replay(sessionId).state,
  });
}
