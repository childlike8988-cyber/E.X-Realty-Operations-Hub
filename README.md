# E.X Realty Operations Hub

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

v0.7.5-alpha：完成 Next.js App Router、TypeScript、Tailwind、集中式導覽與權限模擬、Prisma SQLite Schema、Real Price Explorer、Location Intelligence、Property Intelligence、Proposal Studio、Property Marketing Studio 與 Creative Workspace Upgrade。Creative Studio 新增 Project Dashboard、瀏覽器端 JSON Backup／Restore、使用者本機素材、Template Gallery 與 Mock Brand Kit；所有展示內容維持 Mock Data，未串接外部發布或 AI API。

## GitHub Pages Demo

專案可透過 Next.js Static Export 產生 `out/`，並由 GitHub Actions 部署為公開展示版本。詳細步驟請見 [DEPLOYMENT.md](DEPLOYMENT.md)。

展示版主要入口為 `/tools/real-price/`；所有交易資料均為 Mock Data，不代表正式實價登錄或真實市場行情。

## 結構

`src/app` 路由、`src/components` 共用元件、`src/config` 導覽設定、`src/lib` 權限、`prisma` Schema/seed、`docs` 管理文件。

## 尚未完成

正式登入、完整 CRUD、AI API、社群自動發布、FFmpeg、Booking Studio/Video Autopilot 整合與正式營運部署。

## 安全提醒

僅使用假資料與 SQLite 本機開發；禁止放入任何 API Key、密碼、Token 或個人資料。
