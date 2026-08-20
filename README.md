# E.X Realty Operations Hub

## v1.3.3 UI Language + Visual System Polish

App UI now uses a shared token-based Surface System with two switchable themes: 深色 / Midnight Blue and 亮色 / Rose Ivory. The header Theme Switch persists the choice in browser localStorage without reloading or changing routes. Sidebar navigation is independently scrollable on desktop and mobile, and the homepage now prioritizes Property Market Report, Property Intelligence, Real Price Intelligence, and Area Map Intelligence before marketing, showcase, and admin tools.

Client Report and Presentation routes remain isolated from App Theme tokens and retain their warm-white, deep-navy, champagne-gold print-safe visual system. No Prisma, API, login, payment, or external service changes were made.

## v1.3.2-alpha Presentation / Print Hotfix

Fixed Property Report Presentation Mode so non-cover sections use the same 16:9 stage as the cover and receive their own report colour variables. Print flow now removes Contact / CTA vertical centering, so its content starts at the top of the A4 document flow.

## v1.3.1-alpha Client Report Visual QA & Print Fix

Client Report presentation and browser-print output now use report-owned semantic colours, print-safe document flow, and image-safe rules. Light report pages explicitly render deep navy text; the print cover no longer depends on background graphics for readable text. Required property, floorplan, map, lifestyle, logo, agent, and QR visuals remain real image elements with resolver fallbacks and basePath-aware paths.

## v1.3.0-alpha Property Market Report & Client Presentation Layer

新增 `/tools/property-report` 房產市場智慧報告與 `/tools/property-report/present` 16:9 客戶展示模式。報告固定為 8 頁，沿用既有 Property Intelligence、Real Price、Map Intelligence、Location Intelligence 與 Demo Property adapter，提供暖白、深藍、香檳金的客戶簡報視覺，以及 A4 portrait browser print / Save as PDF 基礎。三組 Demo Case 使用 `assets/v1.3-client-presentation` 的 mock / placeholder 素材；缺少素材時會自動使用安全 fallback。

報告資料明確標示 `MOCK DATA` 與 `Demo Generated Insight`，未串接政府資料、地圖服務、AI API、登入或付款。原始素材不覆寫，素材稽核見 [property-report-assets.md](docs/modules/property-report-assets.md)。

`predev` / `prebuild` 會掃描可用的 v1.3 展示圖片並準備到被忽略的 `public/report-assets/`；素材包或單檔缺少時，報告頁仍以 placeholder 顯示。

## v1.2.0-alpha Real Price Map Intelligence

新增 `/tools/real-price/map` 區域行情智慧分析展示頁。以 CSS Mock Map Canvas、三組高雄生活圈、可替換的 `AreaMapAdapter`、區域搜尋面板與規則式 `Demo Generated Insight` 展示平均單價、成交量、年增幅、熱門社區與生活標籤。所有資料為 `MOCK DATA`，未串接地圖、政府或第三方資料 API。

## v1.1.0-alpha Public Experience Upgrade

新增 `/tour` 六步產品導覽，以「現場問題 → 系統解決方式 → 展示入口」讓非技術訪客了解平台價值。`/showcase` 新增傳統流程與 AI Realty Workflow 對照；`/tools/real-price` 新增案例導覽模式，可選三組 Mock Case 並載入對應行情查詢；`/demo` 新增完成頁與 Future AI Automation Layer 說明。

## v1.0.1-alpha Real Price Explorer Showcase

`/tools/real-price` 現在是 Realty Data Tools 的公開核心入口：以 Realty Data Intelligence Hero、五段產品流程、六個既有功能入口、三組推薦 Demo Case 與產品定位區，串接成交資料、社區分析、市場比較、生活圈分析與智慧提案。所有資料仍為 Mock Data，Future AI Capability 明確標示為未啟用。

## v1.0.0-alpha Showcase Release

新增公開 `/showcase` 產品入口，聚合 Realty Data Tools、Property Intelligence、Marketing Automation、Creative Studio 與 Proposal Generation。展示頁以三組商業化 Mock Case、品牌展示、完整產品故事流程與未啟用的 Future AI Vision，提供客戶、主管與合作夥伴瀏覽。

新增 `/demo/[caseId]/present` 全螢幕 Presentation View，提供七步簡報控制器、鍵盤切換、Escape 離開、展示者專用 Notes、前端計時與 Mock Demo PDF 匯出。一般訪客頁不顯示 Presenter Notes；所有內容仍為 Mock / Placeholder，未啟用 AI API 或外部資料。

新增公開 Demo Center（`/demo`）與三個客戶展示案例。每個案例以七步簡報模式串接 Property Overview、Market Analysis、Location Intelligence、Property Intelligence、Marketing Content、Creative Studio 與 Proposal Export；全程使用 Mock Data 與 Placeholder，不啟用 AI API 或外部資料。

Creative Studio 現在提供 Project Dashboard 搜尋／排序、固定靜態的專案詳情殼頁、六分類素材管理、瀏覽器端上傳與刪除確認、備份版本檢查，以及可編輯的 Mock Brand Kit。所有工作資料仍只存在目前瀏覽器的 localStorage；請勿輸入真實個資或機密素材。

完成骨架穩定化、行政製作中心第一階段，以及適合主管 Demo 的 Realty Data Tools Showcase 與品牌化提案中心。

E.X 房仲營運整合中心，定位為 AI-Powered Real Estate Operations & Marketing Platform。

## 安裝與開發

```bash
npm install
copy .env.example .env
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

## 目前版本

v1.3.0-alpha：完成 Next.js App Router、TypeScript、Tailwind、集中式導覽與權限模擬、Prisma SQLite Schema、Real Price Explorer、Map / Location Intelligence、Property Intelligence、Proposal Studio、Property Marketing Studio、Creative Workspace 與 Property Market Report。新增固定 8 頁客戶報告、素材 resolver、三組 Demo Case selector、16:9 presentation mode 與 A4 browser print 基礎；所有展示內容維持 Mock Data，未串接外部發布或 AI API。

## GitHub Pages Demo

專案可透過 Next.js Static Export 產生 `out/`，並由 GitHub Actions 部署為公開展示版本。詳細步驟請見 [DEPLOYMENT.md](DEPLOYMENT.md)。

展示版主要入口為 `/tools/real-price/`；所有交易資料均為 Mock Data，不代表正式實價登錄或真實市場行情。

## 結構

`src/app` 路由、`src/components` 共用元件、`src/config` 導覽設定、`src/lib` 權限、`prisma` Schema/seed、`docs` 管理文件。

## 尚未完成

正式登入、完整 CRUD、AI API、社群自動發布、FFmpeg、Booking Studio/Video Autopilot 整合與正式營運部署。

## 安全提醒

僅使用假資料與 SQLite 本機開發；禁止放入任何 API Key、密碼、Token 或個人資料。
