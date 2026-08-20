# Architecture

## v1.3.3 UI Language + Visual System Polish

The application shell now uses `src/lib/theme.ts` for the two App Theme names, labels, storage key, and safe default. `ThemeProvider` owns browser-local persistence and applies `midnight` or `rose-ivory` tokens to the shared app surface; `ThemeSwitch` is rendered in the App Header and does not reload or alter route state. Shared controls use token-backed geometry in `globals.css`, while existing domain pages can retain their local layout styles.

`Sidebar` separates fixed brand / role / footer regions from `.sidebar-nav`, which has `min-height: 0` and `overflow-y: auto` so all centralized navigation remains reachable in desktop and mobile drawers. Homepage grouping is a rendering concern over the existing navigation configuration; no route or permission metadata was duplicated.

The existing `[...slug]` fallback now excludes concrete App Router pages from `generateStaticParams`. This is a narrow Static Export collision guard: skeleton pages remain available for planned navigation items, while implemented pages such as Property Report, Property Intelligence, Creative Studio, and Real Price retain their concrete output.

Property Report, Client Presentation, and Print remain isolated through `.property-report-shell`, `.property-report-presentation`, report semantic tokens, and print rules. App Theme selectors are scoped to `.app-shell`, so Rose Ivory cannot alter report pages or their A4 output.

## v1.3.2-alpha Presentation / Print Hotfix

Presentation retains the same report component but now scopes the report colour tokens and 16:9 sizing to every section rendered inside `property-report-presentation-main`. Print flow only overrides layout behaviour: the Contact / CTA page starts from the top without vertical centering. No report domain, asset resolver, route, or data adapter changed.

## v1.3.1-alpha Client Report Visual QA & Print Fix

Client Report retains the v1.3 adapter boundary. Visual stability is handled only in report CSS: semantic light/dark text surfaces prevent application dark-theme inheritance, while print media switches report pages to warm-white, deep-navy document flow. Required visuals remain `next/image` output with `unoptimized` Static Export and the single `asset-resolver.ts` basePath-aware path contract.

## v1.3.0-alpha Property Market Report & Client Presentation Layer

`src/features/property-report/` 是客戶報告的唯一組合邊界。`report-adapter.ts` 將現有 `PropertyProposalContext`、Real Price transactions、`AreaRegion`、Location Intelligence score、Mock Branding 與三組 `mockProperties` 組成 `PropertyMarketReport`；UI 不直接跨多個 domain 讀取資料。`report-template.ts` 定義固定的 Cover、Overview、Market Analysis、Area Map、Lifestyle、Comparison、Sales Positioning、Contact 八頁，`report-builder.ts` 提供 section 複製與完整性檢查。

`scripts/prepare-property-report-assets.mjs` 會在 dev / build 前掃描 v1.3 client-presentation sample assets，只複製可用的展示圖片到被 gitignore 的 `public/report-assets/`；來源資料夾或單一檔案缺少時不讓 build fail。`asset-resolver.ts` 使用相對 manifest path、Next basePath 與 `onError` fallback，提供 `MissingPropertyImage`、`MissingFloorplan`、`MissingMap`、`MissingAgent`、`MissingLogo` 與 QR fallback。原始 `assets/` 檔案不覆寫，逐檔清單見 `docs/modules/property-report-assets.md`；`references/` 和 `product-ui/` 不直接載入。

`/tools/property-report` 是帶 Demo Case selector 的 A4 報告頁，`/tools/property-report/present` 是以 query caseId 選案的 Static Export-safe 16:9 client presentation。`AppShell` 只對這個精確 presentation pathname 隱藏 sidebar / utility header；presentation controller 在瀏覽器端處理左右鍵、Escape、頁碼與列印。報告列印使用 CSS `@page`、A4 portrait、`break-after: page` 與 print-only UI 隱藏，PDF 仍是 browser print / Save as PDF，不經 server 或付費服務。

所有報告行情與生活圈資料仍標示 `MOCK DATA`；規則式洞察標示 `Demo Generated Insight`。未修改 Prisma、Static Export、登入、付款或任何外部 API 邊界。

## v1.2.0-alpha Real Price Map Intelligence

`src/features/location-intelligence/map/types.ts` defines the Map domain (`AreaRegion`, `MapMarker`, `AreaFilter`) and the future-facing `AreaMapAdapter` contract. `mock-area-map-adapter.ts` is the only current implementation and reads `src/data/mock/location/map-data.ts`; a future authorized source adapter can implement the same interface without changing presentation code. `/tools/real-price/map` renders a CSS-only Mock Map Canvas, so it does not load any map SDK, external tiles, or location service. `market-insight.ts` deterministically derives labelled `Demo Generated Insight` copy from the selected Mock region. Demo Case map mapping remains a typed constant in `demo-flow.ts`.

## v1.1.0-alpha Public Experience Upgrade

`src/features/public-experience/tour-content.ts` owns the UI-independent product-tour steps, workflow comparison rows, and current Demo Completion capability list. `/tour` is a Static Export-safe presentational route that renders those definitions without storage, API, or authentication. `src/features/real-price/case-guide.ts` maps an existing typed `RealtyDemoCase` to the shared `RealPriceQuery`; `RealPriceCaseGuide` remains a client-side orchestrator that only updates the existing Explorer query state, then links to the existing community, comparison, location, and proposal routes. The Showcase comparison and Demo completion sections reuse the same pure content definitions.

## v1.0.1-alpha Real Price Explorer Showcase

`src/features/real-price/showcase-content.ts` contains typed, UI-independent copy and route metadata for the five-stage story, capability entries, and product-positioning pillars. `real-price-landing.tsx` only composes those definitions with existing typed Mock Demo Cases and existing routes; it neither fetches nor mutates data. `RealPriceExplorer` retains ownership of query state, local recent-search state, summary/chart computations, transaction selection, and the existing browser-side report action. The public landing is therefore Static Export-safe and does not alter the Repository, Prisma, or API boundaries.

## v1.0.0-alpha Showcase Release

`/showcase` is a server-rendered Static Export landing page composed from isolated presentational components in `src/components/showcase/`. It reads typed Mock Demo Case data and the existing Mock Brand Kit only; no browser storage is required for the public page. `showcase-story-flow.tsx` presents the product narrative without coupling analysis modules. Sidebar grouping is a rendering concern over the existing centralized navigation configuration, preserving routes and role metadata. `docs/demo-script.md` is the operational handoff for five- and ten-minute product presentations.

## Demo Polish

`/demo/[caseId]/present` uses the same finite `generateStaticParams` case list as the normal Demo route. `AppShell` bypasses its sidebar and utility header only for this exact presentation pathname, leaving all other routes unchanged. `presenter-notes.ts`, `demo-report.ts`, and timer helpers are UI-independent Mock-only boundaries. `FullscreenPresentation` owns browser keyboard listeners and local timer state; it exposes Presenter Notes only on the `/present` route. `DemoReportExport` uses the existing client-side `jsPDF` dependency and never sends report data to a server.

## Demo Experience Upgrade

`src/features/demo/demo-flow.ts` is a UI-independent Demo boundary containing the three fixed Mock cases and seven ordered presentation steps. `/demo/[caseId]` uses `generateStaticParams` for all cases, so the public presentation route remains compatible with GitHub Pages Static Export. `DemoPresentationMode` resolves a selected Mock property through existing Property Intelligence, Real Price, Marketing, Creative, and Proposal adapters; it does not introduce a database, API, login session, payment flow, or new analysis source. Future AI cards are presentation-only labels and are deliberately marked `Not Enabled`.

## Creative Workspace Polish

`project-query.ts` is a pure search/sort boundary over local `CreativeProject` metadata; UI filters do not replace storage or permission controls. `/tools/creative-studio/projects/[id]` declares the finite Mock property/template IDs through `generateStaticParams`, preserving GitHub Pages static export, then reads browser-local project content after hydration. `project-backup.ts` now serializes `version: "1.0"` and `createdAt`; incompatible backup versions are rejected before restoration. `asset-upload.ts` stores a selected six-category label with browser-local uploads, while `AssetManager` exposes only User Upload deletion and keeps Mock assets immutable. `brand-kit.ts` remains Mock-only and stores its editable configuration under a separate localStorage key.

## Creative Workspace Upgrade

`/tools/creative-studio/projects` is a client-side Dashboard over `project-storage.ts`; static generation produces the shell while browser localStorage supplies project cards after hydration. `project-backup.ts` serializes a portable JSON object containing the selected project, its fixed template, referenced assets, project history, and export history; import validates that browser-side shape before restoration. `asset-upload.ts` accepts only PNG, JPG, and SVG up to 2 MB, converts files to browser data URLs, and stores them locally. Template Gallery remains fixed-template UI; `brand-kit.ts` supplies Mock-only branding for future creative, credit, and branch-management integrations.

## Creative Asset Management Foundation

`project-storage.ts`, `history.ts`, `export-history.ts`, and `template-preferences.ts` are browser-local persistence boundaries. They use distinct localStorage keys and a non-browser in-memory fallback so static prerendering and unit tests never require a database. `library.ts` expands the Mock Creative Asset Library into logo, agent, property, floorplan, background, and icon categories. Creative Studio orchestrates these modules only in the client, while project composition and template rendering remain UI-independent. Browser storage is device-local, should not contain real customer data, and is cleared with browser site data.

## Template Production Studio

`TemplateSchema` extends the Creative Studio fixed-template contract with typed fields, element order, and relative layout coordinates. `src/data/mock/creative-assets/` supplies labelled SVG data-URL placeholders for property photos, floor plans, logos, and QR codes; no original or external asset is read. `template-field-editor/` separates editable text fields, controlled asset selection, and the preview panel. `export.ts` uses the existing client-side `html-to-image` and `jsPDF` dependencies to export the rendered preview as PNG or PDF without a server, database write, or upload.

## Creative Workflow Foundation

`src/features/creative-studio/` is a UI-independent, Mock-only creative boundary. `creative-context.ts` converts the existing `PropertyMarketingContext` and generated platform content into `CreativeContext`; `template-engine.ts` owns five fixed social templates; and `creative-project.ts` creates typed local projects without persistence. `image-generation.ts` defines the future AI-image request shape and returns only a local SVG Mock response in this release. `credits.ts` keeps future usage costs explicit but does not charge or persist points. `/tools/creative-studio` composes these layers into a responsive three-column selection, template, and preview workflow. No image/video API, Prisma migration, login, or publishing service is invoked.

## Property Marketing Studio

`marketing-adapter.ts` converts the existing UI-independent `PropertyProposalContext` into `PropertyMarketingContext`; `generate-marketing-content.ts` deterministically renders platform-specific text for 591, Facebook, Instagram, LINE, and TV Wall. `PropertyCreativeContext` is a typed text-only reservation for a future creative pipeline and does not invoke image or video generation. `/tools/property-marketing` composes these modules for three Mock Property Cases without external publishing, AI APIs, Prisma changes, or authentication.

## Property Intelligence → Proposal Studio Integration

`proposal-adapter.ts` is the integration boundary: it resolves a `PropertyProfile` through existing Mock Real Price and Location Intelligence data, generates deterministic scores and sales talking points, then creates a UI-independent `PropertyProposalContext`. `createPropertyMarketProposalPackage` attaches that context to the existing `MarketProposalPackage`; Proposal Studio consumes the package without duplicating analysis logic. `demo-presentation.ts` conditionally adds the tenth Property Intelligence section only when a package has a property context. Proposal Studio's PNG/PDF export remains the existing client-side export mechanism.

## Property Intelligence Layer

`src/features/property-intelligence/` is a Mock-only aggregation layer. `generatePropertyAnalysis` resolves an existing property community against Real Price transactions and its `locationId` against Location Intelligence cases, producing a portable `PropertyAnalysis`. `calculatePropertyScore` produces bounded deterministic Market, Location, Value, and Overall scores marked `Demo Generated Score`. `PropertyProposalContext` is a type-only future handoff to Proposal Studio; this sprint does not change proposal generation, Prisma, authentication, or external services.

## Realty Location Intelligence Foundation

`src/features/location-intelligence/` is an isolated, deterministic domain layer containing shared types, score constants, analysis functions, a Mock-data re-export, and module documentation. `src/data/mock/location/location-data.ts` owns three labelled Mock living-area cases. `calculateLifestyleScore` awards school/university, MRT, market, park, shopping, and hospital availability under the documented 100-point cap. `PropertyAnalysisFlow` reserves a future Property ID → Real Price → Location Intelligence → AI Proposal integration without coupling either existing module or adding database/API dependencies.

## Realty Data Tools Sprint 2.5 Final Showcase Edition

`/tools/real-price/showcase` is a client-side product landing page that reuses the existing Mock transaction repository and complete-report composer to offer a downloadable demonstration report. `src/features/real-price/insights/market-insight.ts` is intentionally deterministic: it converts `CommunitySummary`, `ComparisonResult`, and commercial demo-case metadata into `Demo Generated Insight`, without a model call or external API. The ninth report section is composed in `demo-presentation.ts`; the existing PDF exporter remains generic and renders every report section in order.

## Realty Data Tools Sprint 2.95 Demo Presentation

`src/features/real-price/demo-presentation.ts` owns the five-step presentation definition and composes a typed `CompleteMarketReport` from a selected `RealtyDemoCase` and `MarketProposalPackage`. `src/components/real-price/demo-presentation.tsx` is the presentation-only orchestrator; it reuses the existing repository, community analysis, comparison, branding, and proposal preview layers without changing Prisma or data sources. `complete-market-report-export.tsx` creates an eight-page client-side PDF from report sections using `html-to-image` and `jsPDF`; every exported page explicitly identifies Mock Data and the report is not a formal valuation.

前端採 Next.js 15 App Router、TypeScript、Tailwind v4、PostCSS 與共用元件。`src/config/navigation.ts` 集中管理模組、角色、狀態與版本；`src/lib/permissions.ts` 提供權限判斷。

v0.2 Phase 1 的 `src/features/template-engine` 以 Template、TemplateField、TemplateProject、ExportJob 型別分離模板定義、表單資料、紀錄與匯出狀態；目前紀錄層為瀏覽器 localStorage，未改動既有 Prisma Schema。

匯出使用 html-to-image 產生 PNG，jsPDF 產生 PDF。正式素材庫、登入授權、資料庫持久化、PPT 與外部專案 adapter 留待後續階段。

## Real Price Explorer

`/tools/real-price` 採獨立的前端展示模組：`src/data/mock/real-price` 保存具型別的靜態假交易資料，`src/features/real-price/analysis.ts` 負責篩選、摘要與圖表資料轉換，`src/components/real-price` 分離查詢、摘要、列表、圖表與 PDF 匯出元件。此路徑不讀取 Prisma、沒有外部請求，也不寫入資料庫。

未來正式資料源確認後，將於伺服器端引入資料來源 adapter，集中處理授權、資料正規化、快取、來源時間戳與稽核。前端維持使用統一的交易資料型別，以避免與外部 API 耦合。

### Sprint 1 repository layer

`src/features/real-price/types.ts` 是交易資料、查詢條件與 `TransactionRepository` 的唯一型別來源。`MockTransactionRepository` 提供靜態展示資料；`government-data-adapter.ts` 僅保留未來 contract，沒有 API 實作、網路請求或憑證。分析與所有 Real Price UI 元件均依賴共用型別，而非直接依賴 Mock Data 檔案。

### Sprint 2 market presentation layer

`community-analysis.ts` 以任意交易集合計算 `CommunitySummary`，並提供單筆成交與社區平均的比較。`/tools/real-price/community` 使用同一 Mock repository 呈現社區行情；成交詳情與最近查詢均在瀏覽器端執行，最近五筆條件僅保存於 localStorage。PDF 輸出以瀏覽器端生成的視覺報告呈現摘要、價格趨勢、社區分析與成交案例。

### Sprint 2.5 proposal layer

`community-comparison.ts` 將兩個 `CommunitySummary` 轉為 `ComparisonResult`，並提供價格與成交量的比較圖資料。`/tools/real-price/compare` 使用相同 Mock repository 選擇兩個社區。成交詳情 Drawer 內的 `TransactionProposalCard` 固定為 16:9，透過瀏覽器端 `html-to-image` 與 jsPDF 匯出 PNG／PDF；`branding.ts` 只提供 Mock Branding，未連接帳號、素材庫或資料庫。

### Sprint 2.8 Branding & Proposal Studio

`proposal-templates/` 分離模板定義、模板清單與 Market Proposal Package 組合邏輯。Proposal Studio 使用 Mock repository 選擇社區、比較社區與成交案例，再將 CommunitySummary、ComparisonResult、價格趨勢與 BrandConfig 組合為 16:9 預覽。輸出只在瀏覽器端以 HTML 轉圖片後嵌入 PDF，檔名為 `<社區名稱>_市場分析報告`；BrandConfig 目前完全是 Mock Data，沒有登入或持久化。

### Sprint 2.9 Demo polish

`src/data/mock/real-price/demo-cases/` 定義生活圈展示案例；Demo Center 只用 caseId 對應既有 Mock 交易資料，並自動組合社區摘要、比較結果與建議模板。BrandConfig 新增展示用公司 Logo、業務頭像、品牌訊息與頁尾文字，全部為無外部圖片的 Mock 值。首頁 Showcase 與 RealtyDataFlow 提示從查詢、分析、比較到提案的產品路徑；未建立地圖或生活機能資料模組。
