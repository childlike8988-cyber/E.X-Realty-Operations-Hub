# E.X Realty Operations Hub

## v0.2.0 Demo Foundation

完成骨架穩定化、行政製作中心第一階段與 Real Price Explorer Mock Data 展示工具。

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

v0.2.0：完成 Next.js App Router、TypeScript、Tailwind、集中式導覽與權限模擬、Prisma SQLite Schema、行政製作中心與 `/tools/real-price/` 展示版。

## GitHub Pages Demo

專案可透過 Next.js Static Export 產生 `out/`，並由 GitHub Actions 部署為公開展示版本。詳細步驟請見 [DEPLOYMENT.md](DEPLOYMENT.md)。

展示版主要入口為 `/tools/real-price/`；所有交易資料均為 Mock Data，不代表正式實價登錄或真實市場行情。

## 結構

`src/app` 路由、`src/components` 共用元件、`src/config` 導覽設定、`src/lib` 權限、`prisma` Schema/seed、`docs` 管理文件。

## 尚未完成

正式登入、完整 CRUD、AI API、社群自動發布、FFmpeg、Booking Studio/Video Autopilot 整合與正式營運部署。

## 安全提醒

僅使用假資料與 SQLite 本機開發；禁止放入任何 API Key、密碼、Token 或個人資料。
