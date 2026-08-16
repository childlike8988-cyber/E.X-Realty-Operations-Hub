# Changelog

## 1.3.2-alpha - 2026-08-16 - Final Polish / Final QA

- Changed print pagination to Cover-first / later-section break-before rules to prevent a leading blank page and trailing forced break.
- Kept current report content, resolver, domain adapters, Static Export, and data boundaries unchanged.

## 1.3.2-alpha - 2026-08-16 - Presentation / Print Hotfix

- Fixed Presentation pages 2–8 retaining A4 sizing instead of joining the 16:9 stage.
- Scoped report colour variables to Presentation Mode, eliminating white inherited text on warm-white report pages.
- Removed Contact / CTA print vertical centering that pushed report content into the lower half of the A4 page.

## 1.3.1-alpha - 2026-08-14 - Client Report Visual QA & Print Fix

- Corrected Client Report light-page text inheriting the presentation dark theme.
- Made A4 print output independent from background graphics with deep-navy text, warm-white surfaces, image-safe flow, and page-break safeguards.
- Preserved the mock-only data boundary, Static Export, Prisma schema, basePath-aware resolver, and report domain adapters.

## 1.3.0-alpha - 2026-08-14 - Property Market Report & Client Presentation Layer

- 新增 `/tools/property-report` 八頁 Property Market Report 與 `/tools/property-report/present` 16:9 客戶展示模式。
- 建立 `PropertyMarketReportAdapter`，沿用既有 Property Intelligence、Real Price、Map Intelligence、Location Intelligence、Demo Case 與 Mock Branding，不建立第二套分析邏輯。
- 建立 v1.3 client-presentation asset inventory、靜態 image resolver 與 MissingPropertyImage / MissingFloorplan / MissingMap / MissingAgent / MissingLogo fallback。
- 報告頁涵蓋 Cover、Property Overview、Market Analysis、Area Map、Lifestyle Intelligence、Market Comparison、Sales Positioning、Contact / CTA，並提供 A4 portrait browser print / Save as PDF 基礎。
- 所有資料保持 Mock-only，行情標示 `MOCK DATA`，規則式洞察標示 `Demo Generated Insight`；未修改 Prisma、登入、付款、外部 API 或 GitHub Pages Static Export。

## 1.2.0-alpha - 2026-08-09 - Real Price Map Intelligence

- Added `/tools/real-price/map` with a CSS-only Kaohsiung Mock Map Canvas, three regional price markers, filters, area metrics, and regional market insight.
- Added typed Mock map data and a replaceable `AreaMapAdapter` boundary for a future authorized provider.
- Expanded the Real Price product flow and mapped the three existing Demo Cases to their Mock map regions.
- Kept Prisma, Google Maps, government/third-party/AI APIs, login, payments, and GitHub Pages Static Export unchanged.

## 1.1.0-alpha - 2026-08-09 - Public Experience Upgrade

- Added the `/tour` non-technical six-step product guide and visible Demo navigation entry.
- Added a traditional workflow versus AI Realty Workflow comparison to `/showcase`.
- Added three Mock Case guided launch points to Real Price Explorer and the Demo Completion section with Future AI Automation Layer placeholder.
- Kept Prisma, external/government/AI APIs, login, payments, and GitHub Pages Static Export unchanged.

## 1.0.1-alpha - 2026-08-09 - Real Price Explorer Showcase

- Reframed `/tools/real-price` as the public Realty Data Tools core entry with a Realty Data Intelligence Hero, product story, capability map, Demo Case shortcuts, and product-positioning section.
- Preserved existing Mock transaction search, community/compare/proposal routes, charts, transaction details, and browser-side report export.
- Kept Prisma, external/government/AI APIs, login, payments, and GitHub Pages Static Export unchanged.

## 1.0.0-alpha - 2026-08-09 - Showcase Release

- Added public `/showcase` landing with product capabilities, story flow, enhanced Demo Cases, Mock Brand Showcase, and Future AI Vision.
- Added five-minute and ten-minute product demonstration scripts.
- Organized visible primary navigation into Tools and Demo sections while preserving existing route architecture.
- Added browser responsive smoke coverage for the public Showcase and seven-step Presentation Mode; human visual sign-off remains a release handoff task.
- Kept Mock Data, Placeholder AI capabilities, Prisma, external services, authentication, payment systems, and GitHub Pages static export unchanged.

## 0.9.5-alpha - 2026-08-09 - Demo Polish

- Added static Presentation View routes with keyboard navigation, full-screen shell bypass, controller, timer, and Presenter Notes.
- Added browser-generated `E.X_AI_Realty_Demo_Report.pdf` from the selected Mock case and seven-step flow.
- Expanded Demo Landing with product positioning, seven-step flow, Presentation View actions, and five-item Future AI Vision.
- Kept Prisma, real data, external and AI APIs, login, payment systems, and GitHub Pages static export unchanged.

## 0.9.0-alpha - 2026-08-09 - Demo Experience Upgrade

- Added public `/demo` landing page, three fixed Mock customer cases, and seven-step `/demo/[caseId]` presentation mode.
- Added typed Demo Flow Engine, progress/sidebar/navigation components, and links into existing working modules.
- Added Future AI Capability placeholders for image, video, market insight, and sales-assistant concepts, all marked Not Enabled.
- Kept Prisma, external and AI APIs, login, payment systems, real data, and GitHub Pages static export unchanged.

## 0.8.0-alpha - 2026-08-09 - Creative Workspace Polish

- Added Creative Project search, modified/created/exported sorting, and static-export-safe local project detail pages.
- Added Asset Manager category filtering, search, browser-local PNG/JPG/SVG upload, modal preview, and confirmed User Upload deletion.
- Added versioned Project Backup `1.0` validation and an editable Mock Brand Kit.
- Kept Prisma, external/AI APIs, authentication, real data, and GitHub Pages static export unchanged.

## 0.7.5-alpha - 2026-08-09 - Creative Workspace Upgrade

- Added `/tools/creative-studio/projects` Dashboard with local project status filters and project metadata cards.
- Added browser-only JSON backup/restore, local PNG/JPG/SVG upload foundation, user asset-library support, Template Gallery, and Mock Brand Kit.
- Kept Prisma, external APIs, AI services, authentication, real data sources, and GitHub Pages static export unchanged.

## 0.7.0-alpha - 2026-08-09 - Creative Asset Management Foundation

- Added localStorage Creative Project save/load/list/delete, DRAFT/EDITING/READY/EXPORTED states, project history, and export records.
- Added six-category Mock Creative Asset Library, enhanced AssetPicker, favorite/recent templates, and recent-project/export-history panels.
- Kept Prisma, external APIs, AI services, authentication, and GitHub Pages static export unchanged.

## 0.6.5-alpha - 2026-08-09 - Template Production Studio

- Added Template Schema, editable content and asset fields, layout positions, and ordered rendering for fixed Creative Studio templates.
- Added a labelled Mock Creative Asset Library, three-column production workspace, and live browser preview.
- Added client-side PNG/PDF export with `property-name_template-name.png` and `property-name_marketing.pdf` naming.
- Kept Prisma, AI APIs, external services, login, and GitHub Pages static export unchanged.

## 0.6.0-alpha - 2026-08-09 - Creative Workflow Foundation

- Added `CreativeContext`, fixed Property Social Templates, typed local Creative Projects, and a future Image Generation request contract.
- Added `/tools/creative-studio` with three Mock Property Cases, CSS preview, five fixed formats, local SVG Mock download, and explicit credit-cost reservation.
- Added the Property Marketing Studio handoff button and Creative Studio entry to centralized Realty Data Tools navigation.
- Kept Prisma, external APIs, AI media generation, login, publishing integrations, and GitHub Pages static export unchanged.

## 0.5.0-alpha - 2026-08-09 - Property Marketing Studio

- Added PropertyMarketingContext, deterministic multi-platform marketing content generation, and typed PropertyCreativeContext reservation.
- Added `/tools/property-marketing` with three Mock Property Cases and 591, Facebook, Instagram, LINE, and TV Wall previews.
- Updated Realty Data Tools Showcase to include the Property → Analysis → Proposal → Marketing flow.
- Kept Prisma, external APIs, AI media generation, login, publishing integrations, and GitHub Pages static export unchanged.

## 0.4.0-alpha - 2026-08-09 - Property Intelligence → Proposal Studio Integration

- Added a UI-independent Property Proposal Adapter, deterministic sales talking points, and a complete PropertyProposalContext.
- Added Demo Property Case import and Property Intelligence Preview inside Proposal Studio.
- Attached property context to Market Proposal Packages and added the conditional tenth Property Intelligence report section.
- Kept Prisma, external APIs, login, and GitHub Pages static export unchanged.

## 0.3.5-alpha - 2026-08-09 - Property Intelligence Layer

- Added `/tools/property-analysis`, three Mock Property Profiles, and a standalone Property Intelligence aggregation layer.
- Added deterministic combined analysis, Demo Generated Score, Property Insight Card, and a typed Proposal Studio handoff reservation.
- Kept Prisma, external APIs, login, Proposal Studio implementation, and GitHub Pages static export unchanged.

## 0.3.0-alpha - 2026-08-09 - Realty Location Intelligence Foundation

- Added `/tools/location-intelligence` and a standalone Mock-only Location Intelligence module for nearby-place analysis, lifestyle scoring, and sales insight cards.
- Added three labelled demo living areas and a typed Property Analysis Flow reservation for future Real Price integration.
- Kept Prisma, Google Maps, government data, login, and GitHub Pages static export unchanged.

## 0.2.5 - 2026-08-09 - Realty Data Tools Sprint 2.5 Final

- Added `/tools/real-price/showcase`, an AI SaaS-style executive product landing page with Demo CTA and Mock report download.
- Grouped Real Price Explorer routes under `Realty Data Tools` navigation and added commercial metadata to the three Mock demo cases.
- Added deterministic `Demo Generated Insight` and expanded the Complete Market Proposal Package from eight to nine PDF pages.
- Kept Prisma, external APIs, login, map scope, and GitHub Pages static export unchanged.

## 0.2.4 - 2026-08-09 - Realty Data Tools Sprint 2.95

- Added `/tools/real-price/demo/presentation`, a five-step executive demo flow for case selection, market analysis, community comparison, transaction case, and proposal generation.
- Added enhanced Mock demo-case metadata, home Showcase CTA, and an eight-section Complete Market Proposal Package PDF export.
- Kept Mock Data mode, Prisma schema, external API boundaries, map scope, login scope, and GitHub Pages static export unchanged.

## 0.2.3 - 2026-08-09 - Realty Data Tools Sprint 2.9

- 新增三個生活圈 Demo Case、`/tools/real-price/demo` 與首頁 Realty Data Tools Showcase。
- 強化模板展示風格、BrandConfig、Brand Preview Card 與四步驟流程提示。
- 新增 Demo Case、模板套用與提案組合測試。
- 未修改 Prisma Schema、政府 API、登入、地圖或 GitHub Pages Static Export。

## 0.2.2 - 2026-08-09 - Realty Data Tools Sprint 2.8

- 新增四種提案模板、BrandConfig、Market Proposal Package 與 Proposal Studio。
- 新增 `/tools/real-price/proposal`、模板／品牌預覽與 16:9 PNG/PDF 匯出。
- 匯出檔名採 `<社區名稱>_市場分析報告`，資料來源維持 Mock Data。
- 未修改 Prisma Schema、政府 API、登入、地圖或 GitHub Pages Static Export。

## Unreleased - Realty Data Tools Sprint 2.5

- 新增 `/tools/real-price/compare` 雙社區行情比較、價格趨勢與成交量比較。
- 新增 16:9 成交案例提案卡與 PNG／PDF 瀏覽器端匯出。
- 新增 Mock Branding 預留與社區比較測試。
- 未修改 Prisma Schema、政府 API、登入或 GitHub Pages Static Export。

## 0.2.1 - 2026-08-09 - Realty Data Tools Sprint 2

- 新增 Community Market Analysis、`/tools/real-price/community` 與社區成交摘要／趨勢圖。
- 新增成交案例詳情 Drawer、社區平均比較與最近五筆 localStorage 查詢。
- 升級 PDF 市場報告，加入查詢條件、價格趨勢、社區分析、成交案例與 Mock Data 來源。
- 未修改 Prisma Schema、登入、政府 API 或 GitHub Pages Static Export。

## Unreleased - Realty Data Tools Sprint 1

- 新增共用 Real Price 型別、TransactionRepository、MockTransactionRepository 與未實作的政府資料 adapter contract。
- Mock 成交資料新增路段、屋齡與 `MOCK` 來源；新增路段、地址、屋齡篩選、查詢摘要及空結果狀態。
- PDF 市場報告新增資料來源、查詢條件與產生時間。
- 未修改 Prisma Schema、GitHub Pages 設定、登入或外部 API。

## Unreleased - GitHub Pages Demo

- 新增 Next.js Static Export、GitHub Pages 子路徑設定與 `out/` 輸出忽略規則。
- 新增 GitHub Actions Pages 部署 workflow 與 `DEPLOYMENT.md`。
- 展示頁維持 Mock Data；未新增 API、登入、真實資料或後端服務。

## Unreleased - Real Price Explorer（展示版）

- 新增「房產資料工具」導航與 `/tools/real-price` 實價登錄查詢展示版。
- 新增 20 筆具型別 Mock 成交資料、查詢篩選、行情摘要、成交列表與三種分析圖表。
- 新增本機 PDF 市場分析摘要與 Real Price Explorer 模組文件。
- 未串接外部 API、政府資料或爬蟲；未修改 Prisma Schema。

## 0.2.0 - 2026-08-01 - Admin Production Studio Phase 1

- 新增行政製作中心、榮譽圖、公告圖、模板管理、歷史紀錄與共用素材庫入口。
- 新增固定模板引擎、表單欄位、即時預覽、localStorage 儲存與 PNG/PDF 匯出。
- 建立素材 audit；incoming 來源目前為空，未覆寫或加工任何原始圖片。

## 0.1.1 - 2026-08-01 - Foundation Stable

- 完成 Tailwind v4 PostCSS、響應式驗收、手機抽屜與 ESLint 警告清理。
