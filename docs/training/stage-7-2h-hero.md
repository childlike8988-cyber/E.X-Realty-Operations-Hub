# Stage 7.2H — Approved Hero integration

## Source and delivery

- Actual approved source: docs/design-reference/training/foundations/hero-approved/hero-production-source-v1.png (1672 × 941).
- User explicitly approved this source for processing. Source SHA-256: 316063DD792AEF5A690E116F7EE4D249053BD87914C87FA6CA6A21F95901DBB3.
- hero-art-direction-reference.png remains reference-only; generated typography/UI never enters runtime.
- Runtime: public/training/hero-consultation-1600.webp (1600 × 900, 106410 bytes), hero-consultation-800.webp (800 × 450, 43994 bytes).
- Reproduce: node scripts/prepare-training-hero.mjs. Uses existing installed sharp, quality 85, no upscaling, original ratio with integer rounding; no dependency changes. No AVIF pipeline added.
- Native picture selects 800px at <=1199px, next/image uses the pre-optimized static fallback. No optimization server or extra runtime request. Same derivatives in Light/Dark/System.

## Scope

Only Hero markup/CSS and offline derivative preparation. Existing headline/CTA/featured content remain HTML. Consultation image is integrated into existing right-side featured surface; mobile copy comes first and image uses a right-biased crop. This deliberately retains Hub shell and prior content instead of replicating the reference's full-page marketing layout.

One surface, static lower-edge dissolve, deep-navy dark overlay and restrained vignette. No added glass layer, animation, external AI, migration, business logic or Manager changes.

## QA

Final production-build browser comparison: Hero STRONG; Showcase Visual READY for human review, not production release certification.

- 1440/1024/768/430/390/375/320: no horizontal overflow; image loaded; correct 1600/800 derivative selected.
- Captured 1440 Light/Dark and 390 Light/Dark in local Codex visualizations stage7-2h folder. Typography and CTA remain separate HTML, mobile copy precedes right-biased consultation crop.
- Realty atmosphere, readability, single-surface hierarchy and Light/Dark consistency: STRONG. Preserves the existing featured case layout, not a pixel-copy of generated reference UI.
- Hero CTA enters S01 briefing; theme change preserves briefing; back returns to collection. No captured browser warnings/errors.
- Training/Manager focused: 166/166 PASS. Typecheck, lint, build: PASS (exit 0); 68 static pages. Full suite not rerun for this Hero-only change.
- Preview: http://127.0.0.1:4207/training/ (fresh static out build).
- Physical iPhone Safari, virtual keyboard and full accessibility audit: NOT VERIFIED.
- No commit, push, deploy, migration, external AI or domain changes.
