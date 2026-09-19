# Stage 7 — Showcase Polish + Final Demo QA

Date: 2026-09-19. Worktree: `D:\CODEX-\E.X Realty Operations Hub`.
Baseline verified: `main`, `a766b7a06a98508afd27bafa53e9b5f18d020251`.

## Scope and status

Local desktop/Chromium showcase flows and engineering validation PASS. Overall acceptance is PARTIAL pending subjective product approval and platform accessibility checks listed below; no production readiness or real-device certification is claimed.

Stage 1–6 contracts are unchanged. SHA-256 comparison of every file under `src/features/training/` before/after this stage matches. No session, replay, score, risk, recommendation or Manager read-model logic was changed. Existing Generation/Creative Studio and other dirty/untracked files were preserved. Git index remains empty.

## Audit and changes

See root `design-qa.md` for the six P1 findings and preserved historical QA. P0: none observed. All six scoped P1 items addressed:

- Separate Home primary/Manager actions; retain discreet local simulation disclosure.
- Translate internal action/system-event vocabulary only at display time. Raw records remain in developer trace details; actual trainee/NPC speech is not rewritten.
- Coalesce identical result evidence rows without dropping evidence IDs, dimensions, cautions or event references; add expandable relevant conversation evidence.
- Keep recommendation above secondary scores; add a clearly labelled Result-to-Manager handoff.
- Compact Manager header, put agent selection before details on narrow screens, improve filter targets and metadata.
- Explicit agent/skill/risk selection moves focus to the relevant heading. Evidence return restores the originating control. Risk uses a solid high-contrast surface. Reduced-motion CSS also removes Manager press scaling.

P2 deferred: property photography, richer context datasets/NPC prose, decorative flourish. No reference-pack images are runtime assets. Product Design Audit guided information hierarchy, progressive disclosure and task continuity; React best-practices review found no new network reads, permanent loops or domain calculations in presentation. Local `apple-design` skill was unavailable and was not used/downloaded.

## Final build and preview

- Command: `npm.cmd run build`, exit 0; 68 static pages.
- Output: project `out/`; Training/Manager pages written around 2026-09-19 21:52:30 +08:00.
- Existing local static preview serves this output on port 4207.
- Trainee: `http://127.0.0.1:4207/training/`
- Manager: `http://127.0.0.1:4207/training/manager/`
- Final browser reload verified the last system-event translation from this build. No source changes followed; only QA documentation/artifacts.

## Canonical demonstration

1. Home → S01 → briefing → start.
2. Send `想先了解家庭需求與通勤安排。`; inspect revealed family/school priority.
3. Send `想了解月付與貸款負擔。`; session completes from canonical rules.
4. Open result: real event evidence, insufficient dimensions and NEEDS_VERIFICATION remain visible.
5. Open Manager; explain that this is a separate synthetic organization, not the current trainee conversation synchronized to a server.
6. Select 林若安 → 議價 → incomplete negotiation-boundary evidence → relevant event and scenario context.
7. Follow recommendation → S04 briefing.

This complete path was performed on the final build with real clicks/Enter, not injected outcomes.

Risk path: S03 → send `我保證現在買一定會漲。` → session ends → result clearly requires review → Manager → 趙維庭 / S03 risk → source evidence. Manager risk is the existing synthetic fixture, not a newly persisted live trainee result. High other scores do not hide the risk.

## Browser / interaction evidence

Environment: Codex in-app Chromium, viewport emulation, not physical mobile hardware.

- Home, briefing, simulation, result, Manager and risk/evidence responsive checks: 1440 / 1024 / 768 / 430 / 390 / 375 / 320; no document horizontal overflow observed. Desktop/tablet height 1000, mobile height 844.
- All five scenario cards activated using Enter; briefing heading receives focus.
- Native context dialog contains Shift+Tab; Escape closes and focus returns to 查看資料. Initial inspection accidentally queried only `[role=dialog]`; corrected to native `dialog`, confirming no product defect.
- Light/Dark switches preserve current conversation and draft. System preference survives reload. Manager selected evidence survives live theme change.
- Explicit agent/skill/risk selection and evidence-back focus verified. No forced clicks or direct click dispatch.
- S01 complete, S03 risk, S04 recommendation, canonical evidence and insufficient-evidence presentation verified.
- Final browser console: no captured warnings/errors.

## Screenshots

Artifact directory (outside runtime/repository):
`C:\Users\Administrator\.codex\visualizations\2026\07\28\019fa810-9bda-7473-87bd-2838b876f41c\stage7`

Final 16 screenshots: `{1440,390}-{light,dark}-{home,simulation,result,manager}.png`.
Four labelled overview sheets: `{1440,390}-{light,dark}-overview.jpg`.
Additional risk and briefing images; `browser-layout-checks.json` contains viewport measurements. Audit images use the `audit-` prefix. Overview sheets only arrange actual screenshots; no synthesized UI. A rejected stitched full-page capture was replaced by a viewport capture.

Compared with approved contact sheet: consistent warm tonal solids, navy text, graphite dark surfaces, restrained glass on controls, typography-led hierarchy and solid risk emphasis. Deliberately no unapproved property photography; no pixel-for-pixel imitation.

## Automated validation (final source)

| Command | Result |
| --- | --- |
| `npm.cmd test -- tests/training` | 159 PASS / 9 files; includes Manager 14 and new Stage 7 5 |
| `npm.cmd test` | 297 PASS / 41 files; 0 failed, 0 skipped |
| `npm.cmd run typecheck` | PASS, exit 0 |
| `npm.cmd run lint` | PASS, exit 0 |
| `npm.cmd run build` | PASS, exit 0; 68 static pages |
| `git diff --check` | exit 0; existing LF/CRLF notices only |

New tests prove evidence grouping is lossless, differing evidence is not merged, display translation preserves cautions/raw utterances, S03 risk remains fail-closed and Manager S04 recommendation traces to canonical evidence. Existing visual button assertions now match the new Chinese labels without reducing five-card coverage.

## Remaining manual acceptance

- Physical iPhone Safari, actual touch/virtual keyboard, screen reader, full contrast/WCAG audit: NOT VERIFIED.
- Reduced-motion/transparency CSS foundation reviewed and tests PASS; live OS reduced-motion/transparency preference switching: NOT VERIFIED (browser capability unavailable). No new continuous motion was introduced.
- System mode selection/persistence verified; live operating-system color-scheme change and frame-level first-paint flash audit: NOT VERIFIED.
- Product-owner judgment of final craft remains required. This is a local synthetic Demo release candidate, not production AI/RBAC/data readiness.
- Requested Astra Medium configuration could not be independently verified; no model change claimed.

## This stage's files

Created: `src/components/training/training-presentation.ts`, `tests/training-showcase.test.ts`, this document.

Modified: `src/components/training/training-scenario-experience.tsx`, `src/components/training/training-manager-experience.tsx`, `src/components/training/training-visual.module.css`, `tests/training-visual.test.ts`, root `design-qa.md`.

Migration NONE. External AI NONE. Runtime reference assets NONE. Stage/commit/push/deploy NOT PERFORMED.
Recommended next: Production Readiness Planning, only after explicit authorization. Stop at Stage 7.
