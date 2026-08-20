# Progress

## v1.3.3 - Circuit Layer Enhancement - 2026-08-20

- [x] Replaced the abstract App Surface circuit treatment with shared, sparse SVG routing clusters and terminal nodes.
- [x] Applied theme-owned Midnight Blue and Rose Ivory colour / strength tokens without changing Glass, hairline, navigation, or Client Report scope.
- [ ] Pending final human visual acceptance of the enhanced circuit layer.

## v1.3.3 - Final Visual Fine-tuning - 2026-08-20

- [x] Added a visible but secondary CSS-only circuit trace layer to the shared App Surface System.
- [x] Tuned Midnight Blue for cool blue-grey traces and Rose Ivory for restrained champagne-grey traces.
- [x] Preserved hairline intensity, Glass separation, Report isolation, and Print behaviour.
- [ ] Pending final human visual acceptance of circuit visibility across both themes.

## v1.3.3 - UI Language + Visual System Polish - 2026-08-20

- [x] Added token-based Midnight Blue and Rose Ivory App Themes with persistent Header Theme Switch.
- [x] Added shared glass / reflection / hairline Surface System and scrollable Sidebar navigation for desktop and mobile.
- [x] Reorganized homepage into Core Workflow, Marketing & Creative, Presentation & Showcase, and Admin & Utilities groups.
- [x] Standardized primary navigation and homepage cards with Traditional Chinese primary labels and English secondary labels.
- [x] Kept Property Report, Presentation, and Print theme isolated from App Theme overrides.
- [ ] Pending manual visual acceptance at requested desktop, tablet, and mobile sizes.

## v1.3.2-alpha - Final Polish / Final QA - 2026-08-16

- [x] Changed print pagination to Cover-first / later-section break-before rules, preventing a leading blank page and trailing forced page.
- [ ] Awaiting final human Chrome Print confirmation: 8 pages, Cover first, and Background graphics on/off.

## v1.3.2-alpha - Presentation / Print Hotfix - 2026-08-16

- [x] Confirmed Presentation pages 2–8 were still A4-sized and inherited an undefined report palette outside `property-report-shell`.
- [x] Applied a shared 16:9 Presentation stage, local report colour variables, and compact presentation-only spacing for all eight sections.
- [x] Removed print Contact / CTA vertical centering so A4 content starts at the top of the page flow.
- [ ] Pending human Chrome Print validation for all three cases, A4 portrait, Background graphics on and off.

## v1.3.1-alpha - Client Report Visual QA & Print Fix - 2026-08-14

- [x] Added report-owned semantic colours for presentation light pages and cover text.
- [x] Made A4 printing independent from background graphics and fixed-height clipping.
- [x] Retained resolver-backed image fallbacks and the existing Static Export path contract.
- [ ] Pending human Chrome Print validation for all three cases, A4 portrait, Background graphics on and off.

## v1.3.0-alpha - Property Market Report & Client Presentation Layer - 2026-08-14

- [x] 完成 `assets/v1.3-client-presentation` 逐檔 inventory，區分 AVAILABLE / OPTIONAL，並保留缺檔 fallback 策略。
- [x] 建立 `src/features/property-report` domain、adapter、8 頁固定模板與 report completeness check。
- [x] 新增 `/tools/property-report` Demo Case selector、暖白／深藍／香檳金客戶報告與 `/tools/property-report/present` 16:9 鍵盤展示模式。
- [x] 報告整合現有 Property Proposal Context、Real Price、Map Intelligence、Location Intelligence、Demo Generated Insight 與 Mock Branding，不新增第二套分析資料。
- [x] 建立 A4 portrait print / page-break CSS、瀏覽器列印／Save as PDF 操作與靜態輸出路由。
- [x] 建立 asset resolver / missing fallback、五項 v1.3 測試；typecheck、lint、test、production build 通過。

## v1.2.0-alpha - Real Price Map Intelligence - 2026-08-09

- [x] Added `/tools/real-price/map` with a Static Export-safe CSS Mock Map Canvas, three Kaohsiung area regions, clickable price markers, and filter-driven area summary.
- [x] Added a replaceable `AreaMapAdapter`, Mock Map Data, and deterministic `Demo Generated Insight` with audience and lifestyle reasoning.
- [x] Added a Real Price landing entry, expanded the public product flow to include map and lifestyle analysis, and mapped all Demo Cases to their Mock map region.
- [x] Preserved Mock Data, Prisma, Google Maps/government/third-party APIs, AI services, authentication, payments, and GitHub Pages Static Export boundaries.

## v1.1.0-alpha - Public Experience Upgrade - 2026-08-09

- [x] Added `/tour`, a six-step non-technical product guide with problem, solution, and route-backed demonstration entry for every step.
- [x] Added the traditional-workflow versus AI Realty Workflow comparison to `/showcase` and the Demo Completion section to `/demo`.
- [x] Added three Mock Case guided entry points to `/tools/real-price`; selecting a case loads its typed market query and links the remaining existing analysis flow.
- [x] Preserved Mock Data, Prisma, external and AI API, login, payment, and GitHub Pages Static Export boundaries.

## v1.0.1-alpha - Real Price Explorer Showcase - 2026-08-09

- [x] Reframed `/tools/real-price` as the Realty Data Tools public landing while preserving the existing Mock query, charts, transaction drawer, and browser-side report workflow.
- [x] Added the five-stage story, six route-backed capability cards, three recommended Demo Case entry cards, and the Data Intelligence / Market Analysis / Sales Proposal positioning section.
- [x] Preserved Prisma, authentication, payment, external-data, AI-service, and GitHub Pages Static Export boundaries.

## v1.0.0-alpha - Showcase Release - 2026-08-09

- [x] Added public `/showcase` product landing with a single CTA to the Mock Demo Center.
- [x] Added a visual eight-stage product story flow, commercially positioned Demo Case cards, and Mock Brand Showcase.
- [x] Added 5-minute and 10-minute presentation scripts in `docs/demo-script.md`.
- [x] Grouped primary sidebar access into Tools and Demo showcase sections without changing underlying routes or permissions.
- [x] Preserved Mock Data, Placeholder AI capabilities, Prisma/database boundaries, external APIs, authentication, payments, and GitHub Pages static export.
- [x] Ran browser-based responsive smoke checks for `/showcase` and Presentation Mode: primary CTA, seven-step navigation, and no detected horizontal overflow at the inspected desktop and mobile viewport.

## v0.9.5-alpha - Demo Polish - 2026-08-09

- [x] Added static-export-safe fullscreen `/demo/[caseId]/present` Presentation View with no AppShell sidebar or tool navigation.
- [x] Added presentation header, progress, keyboard controls, previous/next/exit controller, browser-only demo timer, and Presenter Notes.
- [x] Added a Mock-only seven-step Demo PDF report and expanded Future AI Vision with five explicitly disabled capabilities.
- [x] Upgraded `/demo` with product positioning, seven-step flow, Presentation View actions, and Future AI Vision.
- [x] Preserved Prisma/database boundaries, real data boundaries, external and AI APIs, authentication, payments, and GitHub Pages static export.

## v0.9.0-alpha - Demo Experience Upgrade - 2026-08-09

- [x] Added public `/demo` entry with three labelled Mock real-estate presentation cases.
- [x] Added a typed seven-step Demo Flow Engine and Static Export-safe `/demo/[caseId]` presentation pages.
- [x] Reused existing Real Price, Location Intelligence, Property Intelligence, Marketing, Creative, and Proposal contexts without duplicating data sources.
- [x] Added progress, sidebar, previous/next navigation, and explicit Future AI Capability placeholders marked Not Enabled.
- [x] Preserved Prisma/database boundaries, external and AI APIs, authentication, payments, real data, and GitHub Pages static export.

## v0.8.0-alpha - Creative Workspace Polish - 2026-08-09

- [x] Added Project Dashboard search by project, property, and template name with updated, created, and exported-time sorting.
- [x] Added static-export-safe project detail shells, local project detail panels, and a re-edit entry point.
- [x] Added searchable six-category Asset Manager with browser-local PNG/JPG/SVG upload, enlarged preview, and confirmed user-upload deletion.
- [x] Added versioned `1.0` Creative Project backups and a local Mock Brand Kit editor.
- [x] Preserved Prisma/database boundaries, external and AI APIs, authentication, real data sources, and GitHub Pages static export.

## v0.7.5-alpha - Creative Workspace Upgrade - 2026-08-09

- [x] Added Project Dashboard with Draft, Editing, Ready, and Exported filters sourced from local project storage.
- [x] Added browser-only Project Backup JSON export/import with project, template, assets, history, and export history.
- [x] Added local PNG/JPG/SVG asset-upload foundation, user-upload asset-library support, Template Gallery, and Mock Brand Kit.
- [x] Preserved Prisma/database boundaries, external APIs, AI services, authentication, real data sources, and GitHub Pages static export.

## v0.7.0-alpha - Creative Asset Management Foundation - 2026-08-09

- [x] Added localStorage Creative Project save, load, list, and delete operations with a non-browser test fallback.
- [x] Added DRAFT, EDITING, READY, and EXPORTED project states plus typed project and export history records.
- [x] Added six-category Mock Creative Asset Library, favorite templates, recent templates, and management UI.
- [x] Added recent-project and export-history panels to Creative Studio.
- [x] Preserved Mock Data, Prisma/database boundaries, AI/API boundaries, authentication, and GitHub Pages static export.

## v0.6.5-alpha - Template Production Studio - 2026-08-09

- [x] Added Template Schema with ordered text/image fields and layout positions for five fixed social templates.
- [x] Added editable title, subtitle, price, address, layout, feature, main-photo, floor-plan, logo, and QR-code fields.
- [x] Added labelled Mock Creative Asset Library and a responsive three-column production workspace.
- [x] Added browser-side PNG and PDF export with deterministic property/template file names.
- [x] Preserved Mock Data, Prisma schema, AI/API boundaries, authentication, and GitHub Pages static export.

## v0.6.0-alpha - Creative Workflow Foundation - 2026-08-09

- [x] Added a typed Creative Context adapter from Property Marketing Context, fixed social template definitions, and typed Creative Projects.
- [x] Added `/tools/creative-studio` with three Mock Property Cases, five fixed templates, responsive CSS preview, and local SVG Mock export.
- [x] Added a local-only image generation request contract, Mock response, and explicit future credit-cost reservation without any API call.
- [x] Added the Property Marketing Studio handoff button and central navigation entry.
- [x] Preserved Prisma schema, external APIs, authentication, publishing integrations, and GitHub Pages static export.

## v0.5.0-alpha - Property Marketing Studio - 2026-08-09

- [x] Added Property Marketing Context adapter from PropertyProposalContext.
- [x] Added deterministic 591, Facebook, Instagram, LINE, and TV Wall marketing content generation.
- [x] Added `/tools/property-marketing`, Creative Context reservation, and Realty Data Tools Showcase marketing flow.
- [x] Preserved Prisma schema, external APIs, media generation, login, publishing integrations, and GitHub Pages static export.

## v0.4.0-alpha - Property Intelligence → Proposal Studio Integration - 2026-08-09

- [x] Added Property Proposal Adapter and rule-based Sales Talking Points.
- [x] Added Property Intelligence import to Proposal Studio for all three Mock Property Cases.
- [x] Attached `PropertyProposalContext` to Market Proposal Packages and added the conditional tenth Property Intelligence report section.
- [x] Preserved Prisma schema, external APIs, login scope, and GitHub Pages static export.

## v0.3.5-alpha - Property Intelligence Layer - 2026-08-09

- [x] Added a Mock-only Property Intelligence module and `/tools/property-analysis` center.
- [x] Added three Property Profiles with Real Price and Location Intelligence references.
- [x] Added deterministic market/location analysis, Demo Generated Score, sales insight, and Proposal Ready context.
- [x] Preserved Prisma schema, external APIs, login scope, Proposal Studio implementation, and GitHub Pages static export.

## v0.3.0-alpha - Realty Location Intelligence Foundation - 2026-08-09

- [x] Added the standalone Mock-only Location Intelligence module and `/tools/location-intelligence` showcase page.
- [x] Added three living-area cases, nearby-place categories, deterministic lifestyle scoring, and sales-oriented insight cards.
- [x] Added the `PropertyAnalysisFlow` interface reservation for Real Price → Location Intelligence → AI Proposal.
- [x] Preserved Prisma schema, external map/government APIs, login scope, and GitHub Pages static export.

## v0.2.5 - Realty Data Tools Sprint 2.5 Final - 2026-08-09

- [x] Added the executive Showcase Landing Page at `/tools/real-price/showcase`.
- [x] Consolidated query, community, comparison, proposal, demo, and showcase routes under `Realty Data Tools` navigation.
- [x] Added Mock commercial descriptions and rule-based `Demo Generated Insight` output.
- [x] Expanded the Complete Market Proposal Package to nine pages, including AI Market Insight.
- [x] Preserved Mock Data, Prisma schema, external API boundaries, login scope, maps, and GitHub Pages static export.

## v0.2.4 - Realty Data Tools Sprint 2.95 - 2026-08-09

- [x] Added the five-step executive Demo Presentation flow at `/tools/real-price/demo/presentation`.
- [x] Enhanced the three Mock demo cases with visual preset, audience, and recommended scenario metadata.
- [x] Added an eight-section Complete Market Proposal Package and client-side PDF export.
- [x] Added the home Showcase CTA for `開始 AI 房產分析 Demo`.
- [x] Kept Prisma, external APIs, maps, login, and GitHub Pages static export unchanged.

## v0.1

- [x] Next.js、首頁、集中式導覽、角色預覽、Prisma Schema、Seed、路由骨架。

## v0.1.1 Foundation Stable

- [x] Tailwind v4 PostCSS、響應式驗收、手機抽屜、ESLint 警告清理。
- [x] typecheck、lint、test、production build 通過。

## v0.2 Admin Production Studio Phase 1 - 2026-08-01

- [x] 素材 audit 文件建立；incoming 目前為空，不修改來源素材。
- [x] 行政製作中心入口與榮譽圖／公告圖路由。
- [x] 固定模板、欄位編輯、即時預覽與本機紀錄。
- [x] PNG/PDF 匯出骨架。
- [ ] 正式素材接入、資料庫持久化與登入權限。

## v0.2 Real Price Explorer - 2026-08-08

- [x] 新增房產資料工具入口與「實價登錄查詢（展示版）」路由。
- [x] 建立 20 筆具型別 Mock 成交資料、查詢篩選與市場摘要計算。
- [x] 建立成交列表、價格趨勢／成交量／價格分布圖與本機 PDF 市場摘要。
- [x] 不串接外部資料，不新增 Prisma 模型或資料庫寫入。

## Realty Data Tools Sprint 1 - 2026-08-09

- [x] 建立共用交易／查詢型別與 Mock repository layer。
- [x] Mock Data 補齊路段、屋齡與 `MOCK` 資料來源欄位。
- [x] 擴充路段、地址關鍵字、屋齡查詢，以及查詢摘要與空結果狀態。
- [x] PDF 報告加入資料來源、查詢條件與產生時間。
- [x] 未修改 Prisma Schema、未串接外部資料服務。

## Realty Data Tools Sprint 2 - 2026-08-09

- [x] 新增社區成交摘要、趨勢圖與社區行情頁。
- [x] 成交列表支援案例詳情抽屜與社區平均比較。
- [x] 新增最近五筆 localStorage 查詢與可重用查詢入口。
- [x] PDF 報告加入價格趨勢、社區分析、成交案例與來源追溯資訊。
- [x] 維持 Mock Data、Prisma Schema 與 GitHub Pages Static Export 架構不變。

## Realty Data Tools Sprint 2.5 - 2026-08-09

- [x] 新增雙社區比較、價格／成交量比較圖與 ComparisonResult 計算。
- [x] 新增 16:9 成交案例提案卡與瀏覽器端 PNG／PDF 匯出。
- [x] 新增 Mock Branding 預留，未導入登入或真實品牌資料。
- [x] 維持 Mock Data、Prisma Schema 與 GitHub Pages Static Export 架構不變。

## Realty Data Tools Sprint 2.8 - 2026-08-09

- [x] 建立四種 Proposal Template 與可組合的 Market Proposal Package。
- [x] Mock Branding 擴充為 BrandConfig，包含分店、地址、顏色、Logo 與 QR Code 預留欄位。
- [x] 新增 Proposal Studio、品牌／模板預覽與 16:9 PNG/PDF 提案包匯出。
- [x] 維持 Mock Data、Prisma Schema 與 GitHub Pages Static Export 架構不變。

## Realty Data Tools Sprint 2.9 - 2026-08-09

- [x] 建立三個可快速載入的生活圈 Demo Case 與 Demo Center。
- [x] 強化四種 Proposal Template 的商務、精品、科技與極簡展示差異。
- [x] 擴充 BrandConfig 與 Brand Preview Card，新增流程指示器與首頁 Showcase。
- [x] 維持 Mock Data、Prisma Schema 與 GitHub Pages Static Export 架構不變。

## GitHub Pages Demo Deployment - 2026-08-09

- [x] 啟用 Next.js Static Export，輸出 `out/` 靜態 artifact。
- [x] 新增 repository-aware `basePath`／`assetPrefix` 與 GitHub Pages workflow。
- [x] 建立公開展示限制與人工啟用說明；未進行 push 或實際部署。
