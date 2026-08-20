# Decisions

16. v1.3.3 Circuit Layer Enhancement uses one CSS background SVG token per App Theme, with sparse right-angle and angled traces, branches, terminal nodes, and restrained local glow. This preserves a shared visual language while Midnight Blue retains cool blue-grey strength and Rose Ivory uses reduced champagne-grey strength. Hairline texture, Client Report scope, Print CSS, and the two-theme architecture remain unchanged.

13. v1.3.3 uses one token-based App Theme system with `midnight` as the default and `rose-ivory` as an alternate. Persistence is browser-local; no new dependency, database, login, or API is introduced.
14. Sidebar overflow is fixed structurally with a dedicated scrollable navigation region; brand, role preview, and footer remain stable.
15. Client Report / Presentation / Print styles remain outside App Theme selectors to protect the existing warm-white, deep-navy, champagne-gold client-facing visual system.

12. v1.3.2 Final Polish print pagination starts with Cover using `break-before: auto`; only later report sections create a page break. The final section never forces a trailing break.
11. v1.3.2 Presentation Mode must provide the report colour tokens and 16:9 stage to every active section, not just Cover. Print keeps normal top-aligned document flow for Contact / CTA and does not reuse screen vertical-centering rules.
10. v1.3.1 Client Report presentation and print typography is report-owned rather than inherited from the application dark theme. Browser print uses warm-white surfaces and deep-navy text so readable content does not depend on Background graphics; required assets remain resolver-backed image elements.

1. 使用 Next.js App Router。
2. 開發環境使用 SQLite，保留 PostgreSQL 擴充可能性。
3. 不串接付費 AI API。
4. 角色預覽不等同正式登入。
5. 影音與預約只保留 adapter/interface，不複製其他專案核心。
6. v0.2 Phase 1 暫不修改 Prisma Schema，先用 localStorage 驗證模板流程，避免在正式素材與權限未確認前建立錯誤資料模型。
7. 匯出先支援 PNG/PDF，不建立 PPT；版型採固定模板，不建立自由拖拉設計器。
8. v1.3 Client Report 沿用既有 Property / Real Price / Map / Location Intelligence adapter 與 Demo data，避免建立第二套市場分析邏輯或跨 feature 的 UI 耦合。
9. v1.3 客戶報告採固定八頁、暖白／深藍／香檳金與 browser print-safe CSS；素材以靜態 import + resolver fallback 支援 Static Export，不引入 server PDF、外部 rendering service 或真實資料。
