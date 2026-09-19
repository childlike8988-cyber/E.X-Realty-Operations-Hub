# Training Center — Stage 1 Foundation

## Scope

Stage 1 adds the Training domain contract, a process-local Mock Repository, a deterministic Mock AI Provider boundary, five catalog scenarios, and the minimal `/training/` route. Simulation, evaluation orchestration, manager projections, persistence, and production AI remain later stages.

## Boundaries

- Training owns scenarios, scenario versions, NPC simulation entities, sessions, append-only events, results, evidence, skill projections, and recommendations.
- Property, Market, and Region are accessed only through narrow read-only snapshot ports.
- No Customer entity is imported and no Customer write boundary exists. A future customer snapshot adapter requires separate authorization.
- `TrainingNpc` is not a Customer. `AgentSkillProfile` is rebuildable projection data over immutable results and evidence.
- Knowledge references carry source, version, effective date, verification time, rule ID, and verification state. Unverified references remain fail-closed.
- The Stage 1 provider is local and deterministic. No vendor SDK or external AI call is made.

## Version and event contracts

Published scenario versions are deeply frozen in the in-memory repository. Sessions reference the exact `scenarioVersionId`, and events append with a strictly increasing sequence. The repository intentionally exposes no event update or delete methods.

## Storage and migration

The repository is process-local Mock storage. No Prisma model, SQLite schema, migration, or production write is introduced. Migration status: **NONE**.

## Gate

Stage 1 passes when the focused boundary tests, existing project tests, typecheck, lint, and static build pass; all five scenarios are present; and no external AI call or existing Market/Property mutation is introduced. Recommended next stage: **Stage 2 — Scenario + NPC Engine**.
