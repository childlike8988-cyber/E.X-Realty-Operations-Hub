# AI Realty Training Center Showcase RC Release Manifest

## Release boundary

- Release: AI Realty Training Center Showcase RC
- Stages: 0–7.2H
- Worktree: D:\CODEX-\E.X Realty Operations Hub
- Branch: main
- Current HEAD: a766b7a06a98508afd27bafa53e9b5f18d020251
- Status: READY (local Showcase RC boundary; commit, tag, push and deploy not performed)
- Architecture: Scenario, NPC, Session/Event, Replay, Hybrid Evaluation, Evidence, Result, Skill Profile, Manager Read Model
- Experience: S01–S05, Light/Dark/System, trainee Training, Manager, approved Hero integration

## Production limitations

Mock AI; mock/synthetic data; no production persistence; no production RBAC; no production Customer data; no billing; no external AI; iPhone Safari not verified; screen reader not verified. This is a local Showcase RC, not a production-readiness claim.

## Fresh validation

| Check | Result |
| --- | --- |
| npm.cmd test -- tests/training | PASS — 166/166 (11 files) |
| npm.cmd test -- tests/training-manager.test.ts | PASS — 14/14 |
| npm.cmd test | PASS — 304/304 (43 files, 0 skipped) |
| npm.cmd run typecheck | PASS, exit 0 |
| npm.cmd run lint | PASS, exit 0 |
| npm.cmd run build | PASS, exit 0; 68 static pages |
| Static output | out/training/index.html and out/training/manager/index.html present |

## Training-required inventory

### Domain and application source — 30 files

~~~text
src/features/training/engine-types.ts
src/features/training/evaluation/advisory-adapter.ts
src/features/training/evaluation/components.ts
src/features/training/evaluation/contracts.ts
src/features/training/evaluation/engine.ts
src/features/training/evaluation/knowledge.ts
src/features/training/evaluation/policy.ts
src/features/training/evaluation/result-repository.ts
src/features/training/evaluation/session-reader.ts
src/features/training/evaluation/skill-profile.ts
src/features/training/index.ts
src/features/training/manager/contracts.ts
src/features/training/manager/mock-fixture.ts
src/features/training/manager/read-model.ts
src/features/training/mock-conversation-adapter.ts
src/features/training/npc-engine.ts
src/features/training/ports.ts
src/features/training/providers/mock-training-ai-provider.ts
src/features/training/providers/training-ai-provider.ts
src/features/training/repository.ts
src/features/training/scenario-behaviors.ts
src/features/training/scenario-engine.ts
src/features/training/scenarios.ts
src/features/training/session-events.ts
src/features/training/session-replay.ts
src/features/training/session-repository.ts
src/features/training/session-service.ts
src/features/training/session-types.ts
src/features/training/training-experience.ts
src/features/training/types.ts
~~~

### Presentation and routes — 10 files

~~~text
src/components/training/training-appearance-store.ts
src/components/training/training-appearance.tsx
src/components/training/training-manager-experience.tsx
src/components/training/training-presentation.ts
src/components/training/training-scenario-experience.tsx
src/components/training/training-stage2-preview.tsx
src/components/training/training-stage3-preview.tsx
src/components/training/training-visual.module.css
src/app/training/page.tsx
src/app/training/manager/page.tsx
~~~

### Training documentation — 12 files, including this manifest

~~~text
docs/training/design-contract.md
docs/training/stage-1-foundation.md
docs/training/stage-2-scenario-npc-engine.md
docs/training/stage-3-session-events.md
docs/training/stage-4-hybrid-evaluation.md
docs/training/stage-5a-scenario-experience.md
docs/training/stage-5b-visual-system.md
docs/training/stage-6-manager-view.md
docs/training/stage-7-2-material-convergence.md
docs/training/stage-7-2h-hero.md
docs/training/stage-7-showcase-release.md
docs/training/showcase-rc-release-manifest.md
~~~

### Tests and fixtures — 12 files

~~~text
tests/training-alignment.test.ts
tests/training-evaluation.test.ts
tests/training-experience.test.ts
tests/training-foundation.test.ts
tests/training-hero.test.ts
tests/training-manager.test.ts
tests/training-material.test.ts
tests/training-scenario-npc.test.ts
tests/training-session.test.ts
tests/training-showcase.test.ts
tests/training-visual.test.ts
tests/helpers/training-evaluation-fixture.ts
~~~

### Approved Hero delivery — 3 files

~~~text
scripts/prepare-training-hero.mjs
public/training/hero-consultation-1600.webp
public/training/hero-consultation-800.webp
~~~

The runtime derivatives are 1600×900 (106,410 bytes) and 800×450 (43,994 bytes). The source remains 1672×941 PNG and was not modified or copied to public.

### Reference-only design pack — 34 files

~~~text
docs/design-reference/training/README.md
docs/design-reference/training/reference-pack-contact-sheet.jpg
docs/design-reference/training/training-desktop-dark-reference.png
docs/design-reference/training/training-desktop-light-reference.png
docs/design-reference/training/training-mobile-light-dark-reference.png
docs/design-reference/training/foundations/glass-material/glass-button-dark.png
docs/design-reference/training/foundations/glass-material/glass-button-light.png
docs/design-reference/training/foundations/glass-material/glass-dark-panel.png
docs/design-reference/training/foundations/glass-material/glass-light-panel.png
docs/design-reference/training/foundations/glass-material/material-blur-layer.png
docs/design-reference/training/foundations/glass-material/material-border-highlight.png
docs/design-reference/training/foundations/glass-material/material-shadow-soft.png
docs/design-reference/training/foundations/hero-approved/hero-art-direction-reference.png
docs/design-reference/training/foundations/hero-approved/hero-production-source-v1.png
docs/design-reference/training/foundations/hero-real-estate/hero-real-estate-glass-office-dark.png
docs/design-reference/training/foundations/hero-real-estate/hero-real-estate-luxury-livingroom-light.png
docs/design-reference/training/foundations/hero-real-estate/hero-real-estate-modern-house-exterior-light.png
docs/design-reference/training/foundations/hero-real-estate/hero-real-estate-night-premium-dark.png
docs/design-reference/training/foundations/hero-real-estate/hero-real-estate-sales-meeting-light.png
docs/design-reference/training/foundations/hero-real-estate/hero-real-estate-training-scene-light.png
docs/design-reference/training/foundations/light-dark-backgrounds/bg-dark-graphite-glass.png
docs/design-reference/training/foundations/light-dark-backgrounds/bg-dark-navy-glow.png
docs/design-reference/training/foundations/light-dark-backgrounds/bg-light-soft-gray.png
docs/design-reference/training/foundations/light-dark-backgrounds/bg-light-warm-white.png
docs/design-reference/training/foundations/ui-parts/card-surface-dark.png
docs/design-reference/training/foundations/ui-parts/card-surface-light.png
docs/design-reference/training/foundations/ui-parts/result-score-ring-dark.png
docs/design-reference/training/foundations/ui-parts/result-score-ring-light.png
docs/design-reference/training/foundations/ui-parts/scenario-tile-dark.png
docs/design-reference/training/foundations/ui-parts/scenario-tile-light.png
docs/design-reference/training/foundations/ui-parts/sidebar-dark.png
docs/design-reference/training/foundations/ui-parts/sidebar-light.png
docs/design-reference/training/foundations/ui-parts/stats-widget-dark.png
docs/design-reference/training/foundations/ui-parts/stats-widget-light.png
~~~

This directory includes the approved Hero source/reference and Stage 5B foundation images. It is documentation/reference material only; no file in this directory is loaded by runtime code.

### Shared-shell changes — 3 files, all TRAINING_REQUIRED

~~~text
src/components/layout/app-shell.tsx
src/config/navigation.ts
src/app/[...slug]/page.tsx
~~~

Diff audit: app-shell.tsx adds the Training appearance provider/control only on /training and /training/manager; navigation.ts adds the Training Center item/subtitle; [...slug]/page.tsx adds /training to the concrete route set. No unrelated hunk is present in any of these three files.

### Training QA record — 1 file

~~~text
design-qa.md
~~~

This untracked document is the Training Stage 7 audit record and Hero convergence evidence. It does not contain Generation/Creative Studio implementation.

## Unrelated files explicitly excluded

The following existing dirty/untracked work is outside this RC and must remain untouched:

~~~text
ARCHITECTURE.md
CHANGELOG.md
PROGRESS.md
TASKS.md
src/components/creative-studio/creative-studio.tsx
scripts/comfyui-local-integration.ts
src/app/tools/creative-studio/video/**
src/components/creative-studio/mock-ai-video-studio.tsx
src/features/generation/**
tests/comfyui-adapter.test.ts
tests/generation-job.test.ts
tests/generation-provider.test.ts
tests/video-studio.test.ts
~~~

Other non-Training tests and helper files remain excluded for the same reason. No shared file has a mixed Training/unrelated diff after inspection.

## Hero asset audit

- Approved source: docs/design-reference/training/foundations/hero-approved/hero-production-source-v1.png (1672×941 PNG; SHA-256 316063DD792AEF5A690E116F7EE4D249053BD87914C87FA6CA6A21F95901DBB3); docs-only source.
- Reference-only image: docs/design-reference/training/foundations/hero-approved/hero-art-direction-reference.png; not a runtime asset.
- Runtime assets: public/training/hero-consultation-1600.webp and public/training/hero-consultation-800.webp; both untracked at the time of audit and included only in the explicit plan below.

## Explicit staging plan (not executed)

The following exact git add commands are the proposed plan after manual authorization. No staging was performed in Stage 7.3.

~~~powershell
git add "src/features/training/engine-types.ts"
git add "src/features/training/evaluation/advisory-adapter.ts"
git add "src/features/training/evaluation/components.ts"
git add "src/features/training/evaluation/contracts.ts"
git add "src/features/training/evaluation/engine.ts"
git add "src/features/training/evaluation/knowledge.ts"
git add "src/features/training/evaluation/policy.ts"
git add "src/features/training/evaluation/result-repository.ts"
git add "src/features/training/evaluation/session-reader.ts"
git add "src/features/training/evaluation/skill-profile.ts"
git add "src/features/training/index.ts"
git add "src/features/training/manager/contracts.ts"
git add "src/features/training/manager/mock-fixture.ts"
git add "src/features/training/manager/read-model.ts"
git add "src/features/training/mock-conversation-adapter.ts"
git add "src/features/training/npc-engine.ts"
git add "src/features/training/ports.ts"
git add "src/features/training/providers/mock-training-ai-provider.ts"
git add "src/features/training/providers/training-ai-provider.ts"
git add "src/features/training/repository.ts"
git add "src/features/training/scenario-behaviors.ts"
git add "src/features/training/scenario-engine.ts"
git add "src/features/training/scenarios.ts"
git add "src/features/training/session-events.ts"
git add "src/features/training/session-replay.ts"
git add "src/features/training/session-repository.ts"
git add "src/features/training/session-service.ts"
git add "src/features/training/session-types.ts"
git add "src/features/training/training-experience.ts"
git add "src/features/training/types.ts"
git add "src/components/training/training-appearance-store.ts"
git add "src/components/training/training-appearance.tsx"
git add "src/components/training/training-manager-experience.tsx"
git add "src/components/training/training-presentation.ts"
git add "src/components/training/training-scenario-experience.tsx"
git add "src/components/training/training-stage2-preview.tsx"
git add "src/components/training/training-stage3-preview.tsx"
git add "src/components/training/training-visual.module.css"
git add "src/app/training/page.tsx"
git add "src/app/training/manager/page.tsx"
git add "docs/training/design-contract.md"
git add "docs/training/stage-1-foundation.md"
git add "docs/training/stage-2-scenario-npc-engine.md"
git add "docs/training/stage-3-session-events.md"
git add "docs/training/stage-4-hybrid-evaluation.md"
git add "docs/training/stage-5a-scenario-experience.md"
git add "docs/training/stage-5b-visual-system.md"
git add "docs/training/stage-6-manager-view.md"
git add "docs/training/stage-7-2-material-convergence.md"
git add "docs/training/stage-7-2h-hero.md"
git add "docs/training/stage-7-showcase-release.md"
git add "docs/training/showcase-rc-release-manifest.md"
git add "tests/training-alignment.test.ts"
git add "tests/training-evaluation.test.ts"
git add "tests/training-experience.test.ts"
git add "tests/training-foundation.test.ts"
git add "tests/training-hero.test.ts"
git add "tests/training-manager.test.ts"
git add "tests/training-material.test.ts"
git add "tests/training-scenario-npc.test.ts"
git add "tests/training-session.test.ts"
git add "tests/training-showcase.test.ts"
git add "tests/training-visual.test.ts"
git add "tests/helpers/training-evaluation-fixture.ts"
git add "scripts/prepare-training-hero.mjs"
git add "public/training/hero-consultation-1600.webp"
git add "public/training/hero-consultation-800.webp"
git add "docs/design-reference/training/README.md"
git add "docs/design-reference/training/reference-pack-contact-sheet.jpg"
git add "docs/design-reference/training/training-desktop-dark-reference.png"
git add "docs/design-reference/training/training-desktop-light-reference.png"
git add "docs/design-reference/training/training-mobile-light-dark-reference.png"
git add "docs/design-reference/training/foundations/glass-material/glass-button-dark.png"
git add "docs/design-reference/training/foundations/glass-material/glass-button-light.png"
git add "docs/design-reference/training/foundations/glass-material/glass-dark-panel.png"
git add "docs/design-reference/training/foundations/glass-material/glass-light-panel.png"
git add "docs/design-reference/training/foundations/glass-material/material-blur-layer.png"
git add "docs/design-reference/training/foundations/glass-material/material-border-highlight.png"
git add "docs/design-reference/training/foundations/glass-material/material-shadow-soft.png"
git add "docs/design-reference/training/foundations/hero-approved/hero-art-direction-reference.png"
git add "docs/design-reference/training/foundations/hero-approved/hero-production-source-v1.png"
git add "docs/design-reference/training/foundations/hero-real-estate/hero-real-estate-glass-office-dark.png"
git add "docs/design-reference/training/foundations/hero-real-estate/hero-real-estate-luxury-livingroom-light.png"
git add "docs/design-reference/training/foundations/hero-real-estate/hero-real-estate-modern-house-exterior-light.png"
git add "docs/design-reference/training/foundations/hero-real-estate/hero-real-estate-night-premium-dark.png"
git add "docs/design-reference/training/foundations/hero-real-estate/hero-real-estate-sales-meeting-light.png"
git add "docs/design-reference/training/foundations/hero-real-estate/hero-real-estate-training-scene-light.png"
git add "docs/design-reference/training/foundations/light-dark-backgrounds/bg-dark-graphite-glass.png"
git add "docs/design-reference/training/foundations/light-dark-backgrounds/bg-dark-navy-glow.png"
git add "docs/design-reference/training/foundations/light-dark-backgrounds/bg-light-soft-gray.png"
git add "docs/design-reference/training/foundations/light-dark-backgrounds/bg-light-warm-white.png"
git add "docs/design-reference/training/foundations/ui-parts/card-surface-dark.png"
git add "docs/design-reference/training/foundations/ui-parts/card-surface-light.png"
git add "docs/design-reference/training/foundations/ui-parts/result-score-ring-dark.png"
git add "docs/design-reference/training/foundations/ui-parts/result-score-ring-light.png"
git add "docs/design-reference/training/foundations/ui-parts/scenario-tile-dark.png"
git add "docs/design-reference/training/foundations/ui-parts/scenario-tile-light.png"
git add "docs/design-reference/training/foundations/ui-parts/sidebar-dark.png"
git add "docs/design-reference/training/foundations/ui-parts/sidebar-light.png"
git add "docs/design-reference/training/foundations/ui-parts/stats-widget-dark.png"
git add "docs/design-reference/training/foundations/ui-parts/stats-widget-light.png"
git add "src/components/layout/app-shell.tsx"
git add "src/config/navigation.ts"
git add "src/app/[...slug]/page.tsx"
git add "design-qa.md"
~~~

## Proposed LKG (not created)

- Commit message: feat: add AI Realty Training Center showcase
- Suggested tag: training-showcase-rc-v1
- Commit: NOT PERFORMED
- Tag: NOT PERFORMED
- Push: NOT PERFORMED
- Deploy: NOT PERFORMED
