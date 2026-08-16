# Tasks

## v1.3.2-alpha Final Polish / Final QA - pending final human print validation

- [x] First print page is explicitly Cover; later sections alone add a page break and the final section never forces a trailing page.
- [ ] Human Chrome Print review remains required for Background graphics on and off.

## v1.3.2-alpha Presentation / Print Hotfix - completed pending human print validation

- [x] Fixed non-cover Presentation stage mapping, report palette availability, and section sizing.
- [x] Fixed Contact / CTA print vertical centering and added stable presentation/print regression guards.
- [ ] Human Chrome Print review remains required for Background graphics on and off.

## v1.3.1-alpha Client Report Visual QA & Print Fix - completed pending human print validation

- [x] Corrected presentation contrast and report-owned semantic text colours.
- [x] Added print-safe document flow, image rules, and A4 page-break safeguards.
- [ ] Human Chrome Print review remains required for Background graphics on and off.

## v1.3.0-alpha Property Market Report & Client Presentation Layer - completed

- [x] 建立三組 Demo Case 的 asset inventory 與原始素材不覆寫規則。
- [x] 建立 PropertyMarketReport、adapter、report builder、8 個固定 sections 與 Mock / Demo Generated Insight labels。
- [x] 新增 `/tools/property-report` 報告頁與 `/tools/property-report/present` 16:9 presentation mode，支援案例切換、上一頁／下一頁、鍵盤左右鍵、Escape 離開與瀏覽器列印。
- [x] 建立暖白／深藍／香檳金 client-report 視覺、A4 print-safe page break 與缺圖 fallback。
- [x] 新增 asset resolver、report adapter、三案例 mapping、8 sections、static export compatibility 測試。
- [x] 完成瀏覽器 viewport 驗收（1440、1600、1920、768、390、430、16:9）；DOM 確認 8 頁、圖片載入與無水平溢出。
- [ ] 仍需在實際列印對話框執行 Save as PDF，確認 A4 page-break 與輸出檔案的最終視覺。

## v1.2.0-alpha Real Price Map Intelligence - completed

- [x] CSS Mock Map Canvas, three Kaohsiung Mock regions, price markers, filters, and region market summary.
- [x] Replaceable map adapter interface plus deterministic Mock market insight and Demo Case mapping.
- [x] Real Price landing/map navigation and typed map coverage.
- [ ] Perform a human desktop/mobile visual review of marker placement and filter interaction before public sharing.

## v1.1.0-alpha Public Experience Upgrade - completed

- [x] Public `/tour` with six problem-to-solution product steps and route-backed showcase entry points.
- [x] Showcase workflow comparison, Real Price Mock Case Guide, and Demo Completion section.
- [x] Typed coverage for tour flow, workflow comparison, case-query mapping, and completion capabilities.
- [ ] Perform a human mobile and desktop walkthrough before sharing the public experience externally.

## v1.0.1-alpha Real Price Explorer Showcase - completed

- [x] Realty Data Intelligence Hero, five-stage product flow, and Mock/Future AI boundaries.
- [x] Six Real Price Explorer capability entries, three linked Demo Case cards, and product positioning cards.
- [x] Preserved the existing query, analysis, reporting, and all previously generated static routes.
- [ ] Perform a human mobile and desktop visual review, including a report download, before public sharing.

## v1.0.0-alpha Showcase Release - completed

- [x] Public product Showcase landing, capability cards, product story flow, and Demo CTA.
- [x] Three commercially positioned Mock cases with covers, descriptions, suitable audiences, and sales scenarios.
- [x] Mock Brand Showcase and Future AI Vision for presentation-oriented product context.
- [x] Five-minute and ten-minute Demo Script documentation plus Showcase regression coverage.
- [x] Completed automated browser responsive smoke checks for the public Showcase and Presentation Mode.
- [ ] Perform a human browser visual acceptance at mobile and desktop widths before sharing the Showcase externally.

## Demo Polish - completed

- [x] Fullscreen static Presentation View for all three Demo Cases.
- [x] Presentation controller, progress, keyboard navigation, Escape exit, and browser-only timer.
- [x] Presenter-only notes plus general-visitor separation by route.
- [x] Mock Demo PDF report and expanded five-item Future AI Vision.
- [x] Automated coverage for presentation data, navigation, notes, timer, report, and AI vision.
- [ ] Perform a human full-screen browser rehearsal including keyboard navigation, timer reset, and PDF download before client use.

## Demo Experience Upgrade - completed

- [x] Public Demo Center with three Mock cases and start-presentation actions.
- [x] Seven-step flow definition plus Static Export-safe client presentation pages.
- [x] Presentation progress, sidebar selection, previous/next controls, and existing-workspace handoff links.
- [x] Future AI Capability placeholder cards explicitly labelled Not Enabled.
- [x] Automated coverage for cases, flow, navigation boundaries, and placeholders.
- [ ] Perform a human browser presentation rehearsal at desktop and mobile widths before sharing the public Demo link.

## Creative Workspace Polish - completed

- [x] Search, status filter, and updated/created/exported sorting for browser-local Creative Projects.
- [x] Static project-detail route with template, assets, history, exports, and re-edit entry.
- [x] Asset Manager search/category/preview/delete workflow and labelled user-upload categories.
- [x] Backup JSON `1.0` version check plus Mock Brand Kit editor.
- [x] Automated regression coverage for search, uploaded assets, backup versions, detail storage data, and Brand Kit persistence.
- [ ] Perform a human browser check for actual asset file upload/delete, Backup JSON download/import, and modal preview before sharing a demo.

## Creative Workspace Upgrade - completed

- [x] Project Dashboard route with status filters and locally saved project cards.
- [x] Client-side JSON backup/restore for project, template, assets, history, and export records.
- [x] PNG/JPG/SVG local upload foundation, Template Gallery, and Mock Brand Kit.
- [x] Test coverage for Dashboard data, backup/restore, uploads, gallery templates, and Brand Kit.
- [ ] Perform a human browser test for file upload, backup JSON import/export, and Dashboard restoration before sharing externally.

## Creative Asset Management Foundation - completed

- [x] Browser-local project persistence, typed status lifecycle, project history, and export history.
- [x] Six-category Mock asset library plus enhanced AssetPicker.
- [x] Favorite/recent template preferences and recent-project/export-record workspace panels.
- [x] Test coverage for persistence, history, library categories, preferences, and export metadata.
- [ ] Perform a human browser check of saved project restoration and actual PNG/PDF download before sharing a demo.

## Template Production Studio - completed

- [x] Template Schema with text/image field definitions, layout coordinates, and order.
- [x] Mock property-photo, floor-plan, logo, and QR-code asset selector.
- [x] Editable live preview and browser-side PNG/PDF export actions.
- [x] Test coverage for schema, immutable field updates, Mock assets, and export naming.
- [ ] Perform a human browser export and mobile-layout review before sharing externally.

## Creative Workflow Foundation - completed

- [x] Typed CreativeContext, CreativeProject, fixed template catalog, image-request interface, Mock response, and credit action costs.
- [x] Creative Studio route with three Mock Property Cases, five social templates, client-side preview, and Mock SVG download.
- [x] Property Marketing Studio handoff and centralized Realty Data Tools navigation entry.
- [x] Test coverage for context conversion, template loading, project creation, request shape, and credit costs.
- [ ] Perform a human browser review of template selection, Mock download, and mobile layout before executive demonstration.

## Property Marketing Studio - completed

- [x] PropertyProposalContext → PropertyMarketingContext adapter and rule-based multi-platform content generator.
- [x] Marketing Studio route with three Mock Property Cases, intelligence summary, tabs, previews, and copy action.
- [x] Typed future PropertyCreativeContext with text-only image/video concept reservation.
- [x] Test coverage for context conversion, three cases, five platform outputs, and creative context completeness.
- [ ] Perform human browser content-review and clipboard interaction acceptance before executive demonstration.

## Property Intelligence → Proposal Studio Integration - completed

- [x] PropertyProposalContext adapter with market, location, score, customer, strategy, talking-points, and transaction data.
- [x] Proposal Studio property import UI and Property Intelligence Preview.
- [x] Property-aware Market Proposal Package and conditional tenth report page.
- [x] Integration coverage for adapter conversion, property package, talking points, and all three Mock Property Cases.
- [ ] Perform manual browser import and PNG/PDF export acceptance before executive demonstration.

## Property Intelligence Layer - completed

- [x] Three Mock Property Profiles and shared property intelligence types.
- [x] Single-property market/location composition, deterministic scoring, and sales insight card.
- [x] Reserved `PropertyProposalContext` for a future Proposal Studio handoff without modifying that module.
- [ ] Perform a human browser responsive and sales-copy review before an executive demonstration.

## Realty Location Intelligence Foundation - completed

- [x] Typed Mock location cases, nearby-place data, score rules, and rule-based sales insights.
- [x] Location Intelligence showcase route with case switcher, category cards, lifestyle score, and flow reservation.
- [x] Unit coverage for Mock data, scoring logic, and insight generation.
- [ ] Perform human browser responsive and content-review acceptance before executive demonstration.

## Realty Data Tools Sprint 2.5 Final - completed

- [x] Showcase product landing page with Hero, capability cards, workflow timeline, and CSS-only screenshot placeholder.
- [x] Demo report download plus a ninth `Demo Generated Insight` report section.
- [x] Commercial positioning fields for all Mock demo cases and Showcase/Insight coverage tests.
- [ ] Perform a human browser visual review and actual PDF download before a public executive showcase.

## Realty Data Tools Sprint 2.95 - completed

- [x] Executive presentation route, progress controls, and case selection.
- [x] Complete Market Proposal Package with cover, area, market, community, comparison, case, branding, and source sections.
- [x] Mock-only eight-page PDF export and presentation-flow coverage tests.
- [ ] Perform a human browser download/visual review of the generated PDF before a public executive demonstration.

## v0.2 Phase 1 已完成

- 行政製作中心、榮譽圖與公告圖模板工作台。
- 表單欄位、圖片上傳、4:5 預覽、localStorage 紀錄。
- PNG/PDF 匯出與歷史紀錄軟刪除。
- 素材 audit 與空素材狀態說明。

## Real Price Explorer 已完成

- 房產資料工具導航、展示版查詢、行情摘要與成交列表。
- Mock 成交資料、圖表資料轉換與 PDF 市場分析摘要。
- 測試涵蓋資料載入、篩選、摘要與圖表資料集。

## Realty Data Tools Sprint 1 已完成

- 共用型別、TransactionRepository 與 MockTransactionRepository。
- 路段／地址／屋齡篩選、查詢摘要、空結果清除操作。
- 報告來源與條件追溯資訊；repository、路段、屋齡與空結果測試。

## Realty Data Tools Sprint 2 已完成

- Community Market Analysis、社區行情頁與成交趨勢／成交量圖。
- 成交案例右側 Drawer、社區平均比較、差異百分比與狀態標示。
- 最近五筆 localStorage 查詢，以及含社區分析的 PDF 市場報告。

## Realty Data Tools Sprint 2.5 已完成

- 雙社區 ComparisonResult、價格趨勢與成交量比較。
- 16:9 成交案例提案卡、Mock Branding 與 PNG/PDF 匯出。
- 社區比較計算、價格差異與成交量比較測試。

## Realty Data Tools Sprint 2.8 已完成

- 商務、豪宅、科技與極簡四種提案模板。
- Proposal Studio 資料／模板選擇、品牌預覽與市場分析提案包。
- 以社區名稱命名的 PNG/PDF 匯出與提案資料組合測試。

## Realty Data Tools Sprint 2.9 已完成

- 三個生活圈 Demo Case、自動載入分析與 Proposal Preview 的 Demo Center。
- 模板展示差異、Brand Preview Card、四步驟流程提示與首頁 Showcase。
- Demo Case 載入、模板套用與提案資料完整性測試。

## 下一步

- 接入正式素材庫與公司品牌資料。
- 評估 Prisma Template／TemplateProject／ExportJob 模型。
- 建立伺服器端授權與正式資料持久化。
- 確認授權資料來源後，建立 Real Price 資料來源 adapter 與來源稽核策略。
- 規劃 Sprint 2 的社區行情比較、交易詳情與報告版型優化。
- Sprint 3 前確認地圖資料、外部服務授權與顯示範圍，再規劃周邊生活機能。
- 提案品牌資料、Logo 與 QR Code 應在登入／權限與正式資產流程確認後才持久化。
- Sprint 3 前先確認地圖與生活機能資料的授權、成本與個資邊界。
- 先安排主管現場 Demo 與人工檢視 PNG/PDF 輸出，再決定 Sprint 3 優先順序。
