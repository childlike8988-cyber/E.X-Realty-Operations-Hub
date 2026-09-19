import type { VerifiedKnowledgeReader } from '../ports';
import type { ScenarioKnowledgeReference, VerificationState } from '../types';
import type { DeepReadonly, EvaluationPolicy } from './contracts';
import type { TrainingContextSnapshot } from '../session-types';

export async function verifyEvaluationKnowledge(
  references: readonly ScenarioKnowledgeReference[], snapshots: readonly DeepReadonly<TrainingContextSnapshot>[],
  reader: VerifiedKnowledgeReader, now: string, policy: EvaluationPolicy,
): Promise<readonly { refId: string; state: VerificationState; reason: string }[]> {
  if (!references.length) return [{ refId: 'MISSING', state: 'NEEDS_VERIFICATION', reason: 'NO_KNOWLEDGE_REFERENCE' }];
  const time = Date.parse(now);
  if (!Number.isFinite(time)) throw new Error('EVALUATION_TIME_INVALID');
  return Promise.all(references.map(async reference => {
    let reason = 'VERIFIED_SOURCE_MATCH';
    const validDate = (value: string) => Number.isFinite(Date.parse(value)) && Date.parse(value) <= time;
    const snapshotMatches = snapshots.filter(item => item.kind === 'KNOWLEDGE' && item.refId === reference.refId);
    if (reference.verificationState !== 'VERIFIED' || !reference.source.trim() || !reference.version || !reference.ruleId || !validDate(reference.effectiveDate) || !validDate(reference.verifiedAt)) reason = 'REFERENCE_UNVERIFIED';
    else if (time - Date.parse(reference.verifiedAt) > policy.knowledgeMaxAgeDays * 86400000) reason = 'VERIFICATION_EXPIRED';
    else if (snapshotMatches.length !== 1 || snapshotMatches[0].version !== reference.version || snapshotMatches[0].effectiveDate !== reference.effectiveDate || snapshotMatches[0].verifiedAt !== reference.verifiedAt || snapshotMatches[0].verificationState !== 'VERIFIED') reason = 'SNAPSHOT_AMBIGUOUS_OR_UNVERIFIED';
    else {
      try {
        const source = await reader.getKnowledgeReference(reference.refId);
        if (!source || !source.content.trim() || source.verificationState !== 'VERIFIED' || source.refId !== reference.refId || source.source !== reference.source || source.version !== reference.version || source.ruleId !== reference.ruleId || source.effectiveDate !== reference.effectiveDate || source.verifiedAt !== reference.verifiedAt) reason = 'SOURCE_MISSING_OR_MISMATCH';
      } catch { reason = 'SOURCE_UNAVAILABLE'; }
    }
    return { refId: reference.refId, state: reason === 'VERIFIED_SOURCE_MATCH' ? 'VERIFIED' as const : 'NEEDS_VERIFICATION' as const, reason };
  }));
}
