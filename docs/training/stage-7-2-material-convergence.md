# Stage 7.2 — Visual Reference Convergence

Date: 2026-09-19. Baseline: main / a766b7a06a98508afd27bafa53e9b5f18d020251, existing dirty work preserved.
Scope: presentation CSS only; no changes to Training contracts, orchestration, data, routes or IA.

## Before implementation: all 27 foundation references

Each image individually inspected. Current Home captured at 1440 × 900 in this run. Reference images are conceptual material sheets (including labeled/blurred UI compositions), not approved runtime photography.

| Reference | Classification | Current implementation | Gap | Proposed change |
|---|---|---|---|---|
| light-dark-backgrounds/bg-light-soft-gray.png | PARTIAL | 平暖灰背景 | 缺冷灰空氣感 | CSS soft-gray ambient |
| light-dark-backgrounds/bg-light-warm-white.png | PARTIAL | 暖白卡面 | 頁面與卡面分離不足 | 暖白到銀灰底色 |
| light-dark-backgrounds/bg-dark-navy-glow.png | PARTIAL | 平深色底 | 缺深藍環境光 | 低對比靜態 navy ambient |
| light-dark-backgrounds/bg-dark-graphite-glass.png | PARTIAL | graphite surface | 缺微暖反射 | 局部 champagne tint |
| glass-material/glass-light-panel.png | PARTIAL | 既有平面／通用半透明 token | 材質層級、反射與接觸陰影不足 | 五級 token；局部邊線、柔影；blur 僅 header/sheet |
| glass-material/glass-dark-panel.png | PARTIAL | 既有平面／通用半透明 token | 材質層級、反射與接觸陰影不足 | 五級 token；局部邊線、柔影；blur 僅 header/sheet |
| glass-material/material-border-highlight.png | PARTIAL | 既有平面／通用半透明 token | 材質層級、反射與接觸陰影不足 | 五級 token；局部邊線、柔影；blur 僅 header/sheet |
| glass-material/material-shadow-soft.png | PARTIAL | 既有平面／通用半透明 token | 材質層級、反射與接觸陰影不足 | 五級 token；局部邊線、柔影；blur 僅 header/sheet |
| glass-material/material-blur-layer.png | PARTIAL | 既有平面／通用半透明 token | 材質層級、反射與接觸陰影不足 | 五級 token；局部邊線、柔影；blur 僅 header/sheet |
| glass-material/glass-button-light.png | PARTIAL | 既有平面／通用半透明 token | 材質層級、反射與接觸陰影不足 | 五級 token；局部邊線、柔影；blur 僅 header/sheet |
| glass-material/glass-button-dark.png | PARTIAL | 既有平面／通用半透明 token | 材質層級、反射與接觸陰影不足 | 五級 token；局部邊線、柔影；blur 僅 header/sheet |
| hero-real-estate/hero-real-estate-glass-office-dark.png | MISSING | 文字 Hero | 缺房產攝影氛圍 | 僅採環境色；圖本身 NOT_APPROPRIATE_FOR_RUNTIME；建議核准 Hero 素材 |
| hero-real-estate/hero-real-estate-luxury-livingroom-light.png | MISSING | 文字 Hero | 缺房產攝影氛圍 | 僅採環境色；圖本身 NOT_APPROPRIATE_FOR_RUNTIME；建議核准 Hero 素材 |
| hero-real-estate/hero-real-estate-modern-house-exterior-light.png | MISSING | 文字 Hero | 缺房產攝影氛圍 | 僅採環境色；圖本身 NOT_APPROPRIATE_FOR_RUNTIME；建議核准 Hero 素材 |
| hero-real-estate/hero-real-estate-night-premium-dark.png | MISSING | 文字 Hero | 缺房產攝影氛圍 | 僅採環境色；圖本身 NOT_APPROPRIATE_FOR_RUNTIME；建議核准 Hero 素材 |
| hero-real-estate/hero-real-estate-sales-meeting-light.png | MISSING | 文字 Hero | 缺房產攝影氛圍 | 僅採環境色；圖本身 NOT_APPROPRIATE_FOR_RUNTIME；建議核准 Hero 素材 |
| hero-real-estate/hero-real-estate-training-scene-light.png | MISSING | 文字 Hero | 缺房產攝影氛圍 | 僅採環境色；圖本身 NOT_APPROPRIATE_FOR_RUNTIME；建議核准 Hero 素材 |
| ui-parts/card-surface-dark.png | PARTIAL | 實體情境卡 | 缺細緻上緣、面材與深度 | 輕漸層實體面＋靜態高光；不新增假圖片 |
| ui-parts/card-surface-light.png | PARTIAL | 實體情境卡 | 缺細緻上緣、面材與深度 | 輕漸層實體面＋靜態高光；不新增假圖片 |
| ui-parts/scenario-tile-dark.png | PARTIAL | 實體情境卡 | 缺細緻上緣、面材與深度 | 輕漸層實體面＋靜態高光；不新增假圖片 |
| ui-parts/scenario-tile-light.png | PARTIAL | 實體情境卡 | 缺細緻上緣、面材與深度 | 輕漸層實體面＋靜態高光；不新增假圖片 |
| ui-parts/sidebar-dark.png | MATCH | 既有實體導覽 | 無需改 IA | 沿用 token，不重做 sidebar |
| ui-parts/sidebar-light.png | MATCH | 既有實體導覽 | 無需改 IA | 沿用 token，不重做 sidebar |
| ui-parts/stats-widget-dark.png | PARTIAL | Manager 實體 stats | 面材略平 | 實體 raised surface；不照抄數值 |
| ui-parts/stats-widget-light.png | PARTIAL | Manager 實體 stats | 面材略平 | 實體 raised surface；不照抄數值 |
| ui-parts/result-score-ring-dark.png | NOT_APPROPRIATE_FOR_RUNTIME | 證據優先 coaching | 大分數圓環違反既有結果層級 | 不採用；維持分數次要 |
| ui-parts/result-score-ring-light.png | NOT_APPROPRIATE_FOR_RUNTIME | 證據優先 coaching | 大分數圓環違反既有結果層級 | 不採用；維持分數次要 |

## Asset decision

Public inventory contains report-assets/v1.3-client-presentation; prepare-property-report-assets.mjs copies 45 mock report assets from assets/v1.3-client-presentation. No explicit Training Hero approval/provenance identified. Do not repurpose agent likenesses or report mock property images as Training production photography. PRODUCTION_HERO_ASSET_RECOMMENDED. CSS-only Hero for this stage; no docs images in runtime.

## Material contract

- surface-base: solid readable content; surface-elevated: case file / data detail.
- glass-light: floating utilities and featured surface (no nested filters).
- glass-medium: context inspector only.
- surface-critical: opaque risk/verification, independent of average score.
- One component system; theme only changes semantic tokens. Reflection is static and pointer-transparent. Motion stays existing 140–160ms and reduced-motion override.
- Preserve touch targets, focus, native sheet behavior and responsive structure. No photography/layout additions.

## Validation

All commands exit 0. Training focused (including Manager): 163/163 across 10 files. Manager subset: 14 tests. New material boundary tests: 4. Full suite: 301/301 across 42 files. Typecheck, Lint and Build PASS. No new skip or weakened assertions.

Fresh static build: 2026-09-19 22:31:57 +08, 68 pages. Preview: http://127.0.0.1:4207/training/ and /training/manager/, existing server document root in this worktree's out. Reloaded after build; observed CSS /_next/static/css/709867c3f9e3f59a.css and dark surface-base #202e39 confirms new material build.

## Browser evidence (Codex in-app Chromium)

1. Home: 5 scenario collection retained; actual 1440/390 light/dark screenshots saved and inspected. Enter opens S01 briefing.
2. Briefing: safe mission/known facts retained; Space starts session. No IA changes.
3. Simulation: needs message produces canonical NPC response/reveal; Light/Dark/System preserves conversation. Context sheet keeps focus, Escape closes and returns focus to opener.
4. Result: financing message completes S01; actual evaluation shows NEEDS_VERIFICATION and insufficient dimensions, evidence remains primary.
5. Manager: selection of synthetic agent survives theme changes; Space opens negotiation evidence, Enter reveals event #16; return control and recommended S04 briefing work.
6. Risk: S03 guarantee/pressure message ends session; result displays REQUIRES_REVIEW. Manager risk queue opens persisted synthetic evidence, not a fabricated link to this new session.

Home/Briefing/Simulation/Result/Manager measured at 1440,1024,768,430,390,375,320: no horizontal document overflow. Browser console: no captured warnings/errors. Dark preference survives reload; System resolves current OS dark. Live OS theme change, physical iPhone Safari, virtual keyboard, screen reader and full accessibility audit NOT VERIFIED. Reduced-motion/transparency fallbacks covered by CSS contracts, not claimed as OS-device verification.

## Final reference comparison

Reference and actual screenshots compared together. Ratings are bounded material-review judgments, not pixel matching or user acceptance. Result/Manager intentionally retain opaque reading surfaces instead of applying glass everywhere. Realty atmosphere remains PARTIAL without approved Training photography. Existing E.X identity/Traditional Chinese hierarchy preserved. Hero asset recommended, not inserted.

| Actual screenshot | Background | Glass hierarchy | Depth | Buttons | Typography | Realty atmosphere | E.X identity |
|---|---|---|---|---|---|---|---|
| [1440 light home](<C:/Users/Administrator/.codex/visualizations/2026/07/28/019fa810-9bda-7473-87bd-2838b876f41c/stage7-2/1440-light-home.png>) | STRONG | STRONG | STRONG | STRONG | STRONG | PARTIAL | STRONG |
| [1440 light simulation](<C:/Users/Administrator/.codex/visualizations/2026/07/28/019fa810-9bda-7473-87bd-2838b876f41c/stage7-2/1440-light-simulation.png>) | STRONG | STRONG (intentionally restrained) | STRONG | STRONG | STRONG | PARTIAL | STRONG |
| [1440 light result](<C:/Users/Administrator/.codex/visualizations/2026/07/28/019fa810-9bda-7473-87bd-2838b876f41c/stage7-2/1440-light-result.png>) | STRONG | STRONG (intentionally restrained) | STRONG | STRONG | STRONG | PARTIAL | STRONG |
| [1440 light manager](<C:/Users/Administrator/.codex/visualizations/2026/07/28/019fa810-9bda-7473-87bd-2838b876f41c/stage7-2/1440-light-manager.png>) | STRONG | STRONG (intentionally restrained) | STRONG | STRONG | STRONG | PARTIAL | STRONG |
| [1440 dark home](<C:/Users/Administrator/.codex/visualizations/2026/07/28/019fa810-9bda-7473-87bd-2838b876f41c/stage7-2/1440-dark-home.png>) | STRONG | STRONG | STRONG | STRONG | STRONG | PARTIAL | STRONG |
| [1440 dark simulation](<C:/Users/Administrator/.codex/visualizations/2026/07/28/019fa810-9bda-7473-87bd-2838b876f41c/stage7-2/1440-dark-simulation.png>) | STRONG | STRONG (intentionally restrained) | STRONG | STRONG | STRONG | PARTIAL | STRONG |
| [1440 dark result](<C:/Users/Administrator/.codex/visualizations/2026/07/28/019fa810-9bda-7473-87bd-2838b876f41c/stage7-2/1440-dark-result.png>) | STRONG | STRONG (intentionally restrained) | STRONG | STRONG | STRONG | PARTIAL | STRONG |
| [1440 dark manager](<C:/Users/Administrator/.codex/visualizations/2026/07/28/019fa810-9bda-7473-87bd-2838b876f41c/stage7-2/1440-dark-manager.png>) | STRONG | STRONG (intentionally restrained) | STRONG | STRONG | STRONG | PARTIAL | STRONG |
| [390 light home](<C:/Users/Administrator/.codex/visualizations/2026/07/28/019fa810-9bda-7473-87bd-2838b876f41c/stage7-2/390-light-home.png>) | STRONG | STRONG | STRONG | STRONG | STRONG | PARTIAL | STRONG |
| [390 light simulation](<C:/Users/Administrator/.codex/visualizations/2026/07/28/019fa810-9bda-7473-87bd-2838b876f41c/stage7-2/390-light-simulation.png>) | STRONG | STRONG (intentionally restrained) | STRONG | STRONG | STRONG | PARTIAL | STRONG |
| [390 light result](<C:/Users/Administrator/.codex/visualizations/2026/07/28/019fa810-9bda-7473-87bd-2838b876f41c/stage7-2/390-light-result.png>) | STRONG | STRONG (intentionally restrained) | STRONG | STRONG | STRONG | PARTIAL | STRONG |
| [390 light manager](<C:/Users/Administrator/.codex/visualizations/2026/07/28/019fa810-9bda-7473-87bd-2838b876f41c/stage7-2/390-light-manager.png>) | STRONG | STRONG (intentionally restrained) | STRONG | STRONG | STRONG | PARTIAL | STRONG |
| [390 dark home](<C:/Users/Administrator/.codex/visualizations/2026/07/28/019fa810-9bda-7473-87bd-2838b876f41c/stage7-2/390-dark-home.png>) | STRONG | STRONG | STRONG | STRONG | STRONG | PARTIAL | STRONG |
| [390 dark simulation](<C:/Users/Administrator/.codex/visualizations/2026/07/28/019fa810-9bda-7473-87bd-2838b876f41c/stage7-2/390-dark-simulation.png>) | STRONG | STRONG (intentionally restrained) | STRONG | STRONG | STRONG | PARTIAL | STRONG |
| [390 dark result](<C:/Users/Administrator/.codex/visualizations/2026/07/28/019fa810-9bda-7473-87bd-2838b876f41c/stage7-2/390-dark-result.png>) | STRONG | STRONG (intentionally restrained) | STRONG | STRONG | STRONG | PARTIAL | STRONG |
| [390 dark manager](<C:/Users/Administrator/.codex/visualizations/2026/07/28/019fa810-9bda-7473-87bd-2838b876f41c/stage7-2/390-dark-manager.png>) | STRONG | STRONG (intentionally restrained) | STRONG | STRONG | STRONG | PARTIAL | STRONG |

Screenshots are viewport captures, not whole-page proof. Additional before-home-light/dark, mobile evidence and S03 risk captures share the same QA folder.

## Change integrity / handoff

Before/after SHA-256 inventory across src and tests: only training-visual.module.css modified; training-material.test.ts added. All existing other src/tests, including Generation/Creative Studio and all Training domain/service modules, unchanged. This document is the only added project documentation in this stage. Staged list remains empty; HEAD unchanged.

No packages, runtime images, migrations, external AI, commit, push or deploy. Production Hero Asset: RECOMMENDED. Showcase Visual Status: PARTIAL pending subjective acceptance/photography direction, engineering validation PASS.
