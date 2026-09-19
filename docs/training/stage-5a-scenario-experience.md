# Stage 5A — Five MVP Scenario Experience

## Scope

Stage 5A turns the existing five Mock scenarios into one shared playable flow:

1. Scenario catalog
2. Trainee-safe briefing
3. Canonical Session start
4. Free-text Mock conversation
5. Allowed context access
6. Canonical terminal Session
7. Hybrid Evaluation and evidence-first result
8. Suggested next scenario

No production AI, database persistence, migration, Customer write, Manager View, or Stage 5B visual polish is included.

## Application boundary

TrainingExperienceService is an application adapter over the existing Stage 3 TrainingSessionApplicationService and Stage 4 HybridEvaluationEngine.

It may:

- build catalog and briefing projections;
- start a Session;
- submit a free-text message through the existing Mock Conversation Adapter;
- return a narrow trainee-safe workspace view;
- cancel a Session;
- request canonical evaluation only after a terminal state; and
- derive a next-practice suggestion from a real immutable TrainingResult.

It may not mutate NPC state, append events, choose a Session outcome, calculate a score, replace evidence, or write a second Session store. Those responsibilities remain in the previous canonical services.

## Information and context boundary

Briefing and workspace views only use Stage 2 safe projections. HIDDEN, DISCOVERABLE-unrevealed, SYSTEM_ONLY, negotiation-boundary, risk answer-key and evaluation-rule data are excluded.

Allowed Property, Market, Region and Knowledge entries are read from the Stage 3 captured context snapshot and filtered by allowedContextSnapshot. The Stage 5A Mock data exposes only references and safe summary text. Knowledge marked unverified remains visibly NEEDS_VERIFICATION; it is not a legal, finance, market, contract or disclosure conclusion.

## Demo behavior

Each S01–S05 follows the same UI/service path. Free text is classified by the existing deterministic MockConversationAdapter, never production NLP. Prompt chips are optional text starters, not hidden action buttons.

Completion and failure arise from Stage 2 / Stage 3 behavior. Cancellation stays CANCELLED; evaluation may describe events that occurred before cancellation, but the UI never presents it as a completed scenario. Completion state shown in the catalog exists only for the current in-memory demo session.

The result view renders the actual Stage 4 result: positive/negative/risk evidence, dimension states, verification/review state and an evidence-backed next practice suggestion. Numeric score remains secondary.

## Responsive foundation

The shared component uses a single-column mobile structure, a mobile context sheet, touch-sized controls, a normal textarea, and a desktop context sidebar. No scroll interception, desktop-only action, animation system, or visual reference runtime asset was added.

## Design

The approved pack in docs/design-reference/training remains documentation-only. Stage 5A only uses its information hierarchy direction. Light/dark refinement, material hierarchy, motion craft and final visual polish are deferred to Stage 5B.

## Validation

tests/training-experience.test.ts covers catalog metadata, five safe briefings, canonical start/events, free-text Mock transitions, S01–S05 positive paths, actual result persistence, allowed context projection, risk outcome, cancellation behavior, no Customer/migration/network use and UI-to-service boundary. Stage 1–4 tests remain separate regression gates.

No browser, real AI, real Customer, migration or production persistence validation is implied by this document.
