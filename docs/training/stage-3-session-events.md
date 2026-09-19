# Training Center — Stage 3 Session + Append-only Events

Stage 3 connects the deterministic Stage 2 Scenario/NPC transition to a process-local simulation session and an append-only, replayable event timeline. The implementation is a Mock foundation only; it does not add a database migration, provider call, or Evaluation Engine.

## Session lifecycle

`TrainingSessionApplicationService` owns the application flow. Sessions are created with an exact published `scenarioVersionId`, an immutable initial NPC state, a minimal context snapshot, an organization/agent scope, and Mock provider trace metadata. The canonical lifecycle is `CREATED → ACTIVE → COMPLETED | FAILED | CANCELLED`; terminal states cannot reactivate.

The in-memory session repository validates identity locks, lifecycle transitions, event ownership, sequence numbers, and terminal-event agreement before changing any stored map. It exposes `appendEventBatch` and `commitSessionUpdate`, but no event update or delete operation.

## Event timeline

An interaction is committed as one validated batch: `TRAINEE_ACTION`, `NPC_RESPONSE`, `STATE_CHANGED`, any typed Stage 2 candidate events, and (when applicable) a success/failure candidate plus terminal event. Sequence is the ordering source; timestamps come from an injectable `TrainingClock` and are not used for ordering.

The repository validates the complete batch first, so an invalid member appends none of the batch. A command ID is stored in the session receipt list; retrying the same command returns the accepted transition without applying it twice.

## Replay and safe views

`TrainingSessionReplay` consumes the exact scenario version, the `SESSION_STARTED` snapshot, and structured events only. It never invokes `MockConversationAdapter`, classifies text, or calls an AI provider. Missing, duplicate, or out-of-order sequences, wrong-session events, state-before mismatches, invalid bounded states, and events after terminal status fail with a typed `SessionReplayIntegrityError`.

`TraineeSessionView` is a projection, not the internal session record. It uses Stage 2's safe runtime view and a timeline that omits state snapshots, rule IDs, context snapshots, provider traces, hidden/system information, and negotiation boundaries. Internal event payloads retain only the minimum data needed for audit/replay.

## Privacy and future persistence

All Stage 3 data is synthetic and process-local. No Customer entity, Customer write, PII field, Prisma model, SQLite schema, migration, or production AI integration is introduced. Stage 4 may consume the event/evidence boundary for Hybrid Evaluation; a durable repository adapter can replace the in-memory store later.
