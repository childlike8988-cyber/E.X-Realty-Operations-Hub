# Architecture

前端採 Next.js 15 App Router、TypeScript、Tailwind v4、PostCSS 與共用元件。`src/config/navigation.ts` 集中管理模組、角色、狀態與版本；`src/lib/permissions.ts` 提供權限判斷。

v0.2 Phase 1 的 `src/features/template-engine` 以 Template、TemplateField、TemplateProject、ExportJob 型別分離模板定義、表單資料、紀錄與匯出狀態；目前紀錄層為瀏覽器 localStorage，未改動既有 Prisma Schema。

匯出使用 html-to-image 產生 PNG，jsPDF 產生 PDF。正式素材庫、登入授權、資料庫持久化、PPT 與外部專案 adapter 留待後續階段。

## Real Price Explorer

`/tools/real-price` 採獨立的前端展示模組：`src/data/mock/real-price` 保存具型別的靜態假交易資料，`src/features/real-price/analysis.ts` 負責篩選、摘要與圖表資料轉換，`src/components/real-price` 分離查詢、摘要、列表、圖表與 PDF 匯出元件。此路徑不讀取 Prisma、沒有外部請求，也不寫入資料庫。

未來正式資料源確認後，將於伺服器端引入資料來源 adapter，集中處理授權、資料正規化、快取、來源時間戳與稽核。前端維持使用統一的交易資料型別，以避免與外部 API 耦合。
