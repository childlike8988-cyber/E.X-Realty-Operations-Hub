# Stage 4-A / Stage 4 — Contract Alignment and Hybrid Evaluation

## Scope
Mock-only Training evaluation. No production AI, migrations, Customer writes, or UI redesign. Stage 2 engines and Stage 3 lifecycle, event persistence and replay remain unchanged. Approved images in `docs/design-reference/training/` are future Stage 5 references, never runtime assets.

## Contract alignment
- Canonical evaluation contracts live in `src/features/training/evaluation/contracts.ts`. Stable dimension IDs are separate from translated display labels.
- `SCORED` requires bounded score, confidence and evidence. `INSUFFICIENT_EVIDENCE` has no numeric score or fabricated confidence.
- Legacy Stage 1 result types remain for compatibility, not as the canonical Stage 4 result. Its existing repository additionally rejects duplicate result IDs.
- `TrainingSessionReader` delegates to the Stage 3 repository and replay. The result repository holds only results: it does not create another Session truth.
- Results are deep-frozen new revisions. Duplicate IDs/revisions, non-sequential revisions and changed policy contents under an existing policy version fail closed. Re-evaluation appends rather than overwrites.
- The advisory adapter explicitly selects structured action/event references, objective state, risk metadata, semantic NPC summary and allowed context metadata. It excludes raw messages, hidden answers, secret negotiation boundaries and repository objects.
- Provider evaluation/explanation returns advisory metadata only. Engine output sanitization ignores extra provider fields; no provider score or risk decision is authoritative.

## Evaluation and evidence
Evaluation consumes the exact published scenario version, terminal canonical Session, persisted ordered events, replayed objective/risk state and captured context. It does not re-run interactions or classify conversation text.

Versioned policies define dimension weights, component weights, evidence minimums, thresholds, action/event rules, objective mappings, knowledge freshness and risk caps. Rule / objective / event weights are 0.45 / 0.35 / 0.20; only available components contribute. Primary scenario dimensions carry greater weight. Duplicate occurrences of the same action or outcome do not farm points.

Evidence is positive, negative, risk or context and references exact events, objectives, rule hits or knowledge versions. Structured action occurrence demonstrates an action, not the factual correctness or quality of arbitrary prose. Evidence-derived confidence measures support coverage, not calibrated model certainty. Mock advisory is secondary and never enters scoring.

High-severity risk requires review and caps risk-awareness/professionalism scores. Risk remains visible regardless of averages. Missing, stale, ambiguous, mismatched or unverified knowledge produces `NEEDS_VERIFICATION`; AI cannot establish compliance truth. Knowledge freshness is an explicit policy choice, not a claim about legal validity.

All production Mock scenario knowledge remains unverified. Verified knowledge fixtures contain explicitly synthetic test sources and prove branch behavior only; they are not real legal or financial evidence.

## Projection and preview
Skill profiles are rebuildable projections of immutable results, scoped by organization/agent. The latest revision per session contributes once; previous revisions remain stored. Result/evidence references preserve traceability. They grant no authorization or product entitlement.

The existing `/training/` demo shares its Stage 3 repository with evaluation. After completion/failure/cancellation, a minimal feedback view shows evidence first, risk, dimension summaries and clearly labeled Mock advisory. It is not the Stage 5 UI or Manager Dashboard. Repository persistence remains in memory.

## Verification
Alignment: 13 tests. Stage 1: 12. Stage 2: 22. Stage 3: 31. Stage 4: 39. Combined focused: 117 passed. Full suite: 255 passed across 37 files. Typecheck and lint passed. Build outcome is reported separately with the final delivery.

Tests cover authority injection, replay corruption, immutable revisions, exact-version pinning, score bounds, insufficient evidence, invalid references, risk override, knowledge fail-closed cases, all five scenario policies and deterministic projection. No real provider or compliance acceptance is implied. Browser/visual review was not performed in this domain-core stage.

## Follow-up
Stage 5 may develop the five-scenario experience and approved Light/Dark design direction. No Stage 5 implementation is included here. Preserve unrelated dirty work when reviewing or reverting; do not reset the worktree.
