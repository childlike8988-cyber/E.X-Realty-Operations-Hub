# GitHub Pages 展示部署

## 定位

此設定只部署公開展示 Demo，不是正式營運系統。主要展示頁為 `/tools/real-price/`，全部成交資料均為 Mock Data；不含登入、真實資料、AI API、點數或後端服務。

## 靜態匯出設定

`next.config.ts` 使用 `output: 'export'` 產生 `out/`。GitHub Actions 建置時會依 `GITHUB_REPOSITORY` 自動設定專案 Pages 的 `basePath` 與 `assetPrefix`，避免 `/repository-name/` 子路徑下的 CSS、JavaScript 與 App Router 導覽失效。

- 一般專案 Pages：`https://<owner>.github.io/<repository>/`
- 使用者／組織首頁倉庫（`<owner>.github.io`）：不加子路徑。
- `trailingSlash: true` 確保靜態路由輸出為目錄與 `index.html`。
- Next Image 已設為未最佳化，適合無圖片最佳化服務的靜態主機。

## 啟用步驟

1. 將本專案建立為 GitHub repository，並推送至 `main` 分支。
2. 在 GitHub repository 的 **Settings → Pages** 將 Source 設為 **GitHub Actions**。
3. 確認 Actions 可執行 `Deploy demo to GitHub Pages` 工作流程。
4. 推送至 `main`，或在 Actions 頁手動執行 **Run workflow**。
5. 等待 deploy job 完成後，從 job summary 的 Pages URL 開啟展示版。

目前工作區尚未偵測到 Git repository，因此上述建立、提交、推送與 Pages 啟用均需人工完成；本輪不會進行 push 或公開部署。

## 本機驗證

```bash
npm run build
```

成功後檢查 `out/tools/real-price/index.html`。如需模擬專案 Pages 子路徑，可在 PowerShell 設定 `GITHUB_ACTIONS=true` 與 `GITHUB_REPOSITORY=owner/repository` 後執行 build。

## Demo 限制

- 所有查詢結果為靜態假資料，不能視為政府實價登錄、正式估價或交易建議。
- GitHub Pages 不提供 API Route、資料庫、伺服器端驗證、秘密管理或正式帳號功能。
- PDF 匯出在使用者瀏覽器端執行。

## 未來正式部署

正式營運版應改採支援伺服器端執行的主機，將資料來源 adapter、Prisma／PostgreSQL、登入與權限驗證、稽核、備份及機密管理置於伺服器端。不得將任何憑證、真實客戶資料或正式資料庫放入 GitHub Pages artifact。
