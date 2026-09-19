# Stage 5B — Training Experience Visual System

Date: 2026-09-19
Workspace: D:\CODEX-\E.X Realty Operations Hub
Branch: main
HEAD: a766b7a06a98508afd27bafa53e9b5f18d020251

## Scope and boundary
Presentation/interaction only. All 27 files under src/features/training match their pre-task SHA-256 hashes. No changes to Scenario/NPC engines, session lifecycle, append-only events, replay, evaluation, result repositories, skill profiles or experience orchestration. No package, migration, provider, production data, or runtime reference asset changes.

Existing Generation / Creative Studio and prior Training changes remain unstaged. This stage does not claim those pre-existing edits as new work.

## Design implementation
- Training-scoped semantic tokens: warm-white/light and graphite/smoked-dark; SYSTEM default via prefers-color-scheme.
- One component system; Training appearance uses its own versioned localStorage key. Invalid/blocked storage falls back safely. Bootstrap applies a saved choice before content paint; no theme-transition animation.
- Existing Hub shell retained. Conditional Training appearance control; other routes retain their original theme controls.
- Editorial Hero + featured S01 + five-scenario collection; no carousel, stock imagery or fabricated statistics.
- Case-file briefing, NPC presence and semantic relationship cues, canonical conversation events.
- Mobile native dialog for allowed context: modal focus containment, Escape close and focus restoration.
- Evidence-first coaching result; numeric dimensions secondary. Risk/verification and insufficient evidence remain explicit.
- Display translations do not alter canonical findings; original evidence keys/findings are inside developer disclosures.
- 140–160ms input-driven feedback; reduced-motion removes travel/scale. Reduced-transparency and no-backdrop-filter solid fallback prepared.
- Product Design skill guided hierarchy/material review; React review checked stable service ownership, storage cleanup and focus handling.

## Reference QA
Used docs/design-reference/training/ desktop light/dark and mobile references as layout/material guidance, not pixel templates.
Runtime reference assets: NONE.
No approved reference imagery was copied into public. Hero is deliberately typography-led rather than using the mockup's property photography. Photography/likeness and subjective product craft remain human acceptance items.
Compared reference and implementation images together. Fixed fragmented Hero copy wrapping and exposed developer context strings. No fake avatars, numerical training claims or evaluation scores added.

## Automated validation (final source)
Every command exit code: 0.
- Training focused: 140 passed / 7 files (includes 11 Stage 5B tests).
- Full suite: 278 passed / 39 files.
- Typecheck: PASS.
- Lint: PASS.
- Build: PASS, 67 static pages. /training: 31.9 kB; first-load JS 135 kB.
- No skipped/newly weakened tests.

## Browser validation
Environment: Codex in-app Chromium browser, production static out served from this workspace.
URL: http://127.0.0.1:4206/training/
Server: Python http.server bound to 127.0.0.1:4206, document root out.
Final source rebuilt before final screenshot/interaction pass.

Checked widths: 1440, 1024, 768, 430, 390, 375, 320.
Home/Briefing/Simulation/Result: no horizontal document overflow.
Five scenario cards open briefing via keyboard Enter and focus the heading.
Light/Dark switches work; switching during conversation preserves messages and event sequence.
SYSTEM follows the current OS dark setting; preference survives reload. OS-light logic is covered by unit tests, not an OS preference change.
S01 positive path: needs + financing messages -> canonical completion -> actual evaluation and NEEDS_VERIFICATION.
S03 risk path: pressure/guarantee message -> canonical failure -> REQUIRES_REVIEW, risk evidence retained.
Cancel path: explicitly cancelled, not presented as completed; real feedback and insufficient dimensions remain visible.
Mobile context dialog: Shift+Tab remains inside; Escape closes and restores opener.
Browser console: no captured errors/warnings during checked flows.

Not claimed: real iPhone/Safari, screen-reader audit, mobile virtual-keyboard behavior, OS reduced-transparency rendering, exhaustive contrast/zoom audit, live AI, persistence across page reload of mock sessions.
Stage 1–5A tests cover all five canonical paths; browser sampled S01 completion, S03 risk, cancellation, and all five briefing entries.

## Artifacts
External QA-only screenshot folder:
C:\Users\Administrator\.codex\visualizations\2026\07\28\019fa810-9bda-7473-87bd-2838b876f41c\stage5b

16 PNG screenshots: {1440,390}-{light,dark}-{home,briefing,simulation,result}.png
Four JPG contact sheets: {1440,390}-{light,dark}-overview.jpg
Contact sheets only arrange actual browser captures; not generated UI images.

## Handoff
Engineering validation PASS. Visual/device acceptance remains human review.
Recommended next: Stage 6 — Manager View + Skill Profile, after acceptance only.
No stage/commit/push/deploy. No migration. No external AI.
