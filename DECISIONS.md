# Decisions

1. 使用 Next.js App Router。
2. 開發環境使用 SQLite，保留 PostgreSQL 擴充可能性。
3. 不串接付費 AI API。
4. 角色預覽不等同正式登入。
5. 影音與預約只保留 adapter/interface，不複製其他專案核心。
6. v0.2 Phase 1 暫不修改 Prisma Schema，先用 localStorage 驗證模板流程，避免在正式素材與權限未確認前建立錯誤資料模型。
7. 匯出先支援 PNG/PDF，不建立 PPT；版型採固定模板，不建立自由拖拉設計器。
