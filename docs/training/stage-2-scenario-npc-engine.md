# Training Center — Stage 2 Scenario + NPC Engine

Stage 2 adds deterministic, UI-independent Scenario and NPC engines on top of the Stage 1 contracts. The engines resolve an exact published scenario version, create an internal runtime, expose a safe briefing projection, and return immutable transition results. Stage 3 remains responsible for persisted Sessions and append-only Training Events.

## Scenario boundary

`ScenarioEngine` owns version resolution, briefing visibility, discoverable information, objective progress, risk candidates, and success/failure candidates. The trainee view contains only public, briefing, or already discovered information. Hidden and `SYSTEM_ONLY` content remains inside the engine configuration and is never included in `ScenarioRuntimeView`.

## NPC boundary

`NpcEngine` receives an immutable `TrainingNpc` definition and a separate bounded `NpcRuntimeState`. Trust, interest, and pressure are clamped to 0–100. Emotion, intent, and negotiation position are typed semantic states. A transition returns the previous state, action, response, applied state delta, and next state without mutating the definition.

## Action and conversation boundary

Structured `TraineeActionKind` values are the Stage 2 contract. `MockConversationAdapter` accepts text plus an optional structured action; text classification uses deterministic local rules and is explicitly marked Mock. No NLP or vendor AI SDK is used.

## Compliance and lifecycle

Risk candidates carry their rule and verification state. Unverified context produces `NEEDS_VERIFICATION`; no authoritative legal or market answer is generated. Runtime event candidates are transient outputs for Stage 3 and are not persisted by these engines. No Customer writes, database migration, or external AI call is introduced.
