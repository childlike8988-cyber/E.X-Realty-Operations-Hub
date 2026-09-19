# Stage 6 — Manager View + Skill Profile

Date: 2026-09-19
Workspace: `D:\CODEX-\E.X Realty Operations Hub`
Branch: `main`
Baseline HEAD: `a766b7a06a98508afd27bafa53e9b5f18d020251`

## Scope

Stage 6 adds a showcase-only Manager read model and `/training/manager/` surface. It reads canonical Stage 3 Session events and Stage 4 immutable Results/Evidence through a narrow projection. It does not change Scenario, NPC, Session, replay, evaluation, result, or skill-profile contracts.

## Data ownership and traceability

- `TrainingManagerReadModel` owns no persistence and exposes no mutation methods.
- `AgentSkillProfileProjection` continues to be rebuilt with `deriveAgentSkillProfile()` from immutable results; it is not a second source of truth.
- Manager evidence drill-down follows: Skill dimension → Result → Evidence → ordered Training Event → Scenario metadata/version context.
- The manager projection intentionally excludes event snapshots, event payloads, hidden answers, system-only fields, and negotiation boundaries from the normal UI DTO.
- Risk and verification status remain independent of average score. Unknown source verification is presented fail-closed as **需要查證**.

## Showcase fixture

- Five clearly synthetic agents and ten canonical mock sessions exercise S01–S05.
- The fixture starts canonical sessions, persists append-only events, evaluates through `HybridEvaluationEngine`, and then gives the read model the resulting immutable data.
- No real employee, Customer, CRM, phone, email, database, external provider, or network call is used.
- S03 intentionally has unavailable synthetic knowledge source material to demonstrate `NEEDS_VERIFICATION`; high-risk actions demonstrate `REQUIRES_REVIEW`.

## Recommendation and role boundary

- Recommendation is deterministic: risk first, otherwise an evidence-backed weak/insufficient dimension maps to an existing MVP scenario.
- The recommendation opens the existing trainee briefing through `/training/?scenario=S01`–`S05`; it does not create or prefill a Session.
- `/training/manager/` is explicitly labelled as a synthetic showcase preview. Production Manager RBAC remains deferred; no authorization claim is made.
- `/training/` remains the trainee surface and imports no Manager read model or cross-agent projection.

## Presentation

- Reuses the Stage 5B Light/Dark/System tokens and the existing Training-scoped appearance control.
- The AppShell recognizes only `/training/` and `/training/manager/` as Training routes, so other Hub routes retain their existing theme behavior.
- The Manager screen favors solid information surfaces, readable matrices, evidence-first coaching, and small direct-manipulation feedback. Glass is limited to light utility elements.
- Desktop is the primary layout. At narrower widths, the agent list and detail stack; the skill matrix and risk queue become one column.

## Deferred

- Production RBAC and organization membership.
- Production database/migration, real employee synchronization, Customer/CRM writes, notifications, reports, leaderboard, billing, and production AI.
- Final showcase craft audit and human device/accessibility review are Stage 7 concerns.

## Safety

No commit, push, deploy, migration, external AI call, or change to unrelated Generation / Creative Studio work is part of this stage.
