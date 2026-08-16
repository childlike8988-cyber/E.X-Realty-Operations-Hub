# E.X Realty Operations Hub v1.3 — Client Presentation 範例素材包

此套件提供 v1.3 Client Presentation 的可覆蓋替換檔案結構。所有圖片均為明確標示的示意素材（mock / placeholder），不可作為真實物件、實際業務人員、商標或市場資料使用。

## 使用方式

1. 解壓縮後，將整個 `assets/v1.3-client-presentation/` 資料夾複製至專案的對應位置。
2. 保留檔名與資料夾路徑，直接以正式素材覆蓋同名檔案。
3. 正式版應將 `brand/` 中的示意品牌檔換成核准的 E.X Realty 品牌檔，並將各 Case 影像、平面圖與生活圈圖片全部替換。

## 目錄與替換對照

| 路徑 | 用途 | 正式素材建議 |
| --- | --- | --- |
| `brand/` | Logo 與 QR | 透明 PNG；Logo 深淺底各一版；正式 QR |
| `agents/` | 業務形象照 | 原始 JPG 與去背 PNG |
| `cases/<case-id>/` | 物件圖 | 每個案例 5–8 張、最短邊至少 1600px |
| `floorplans/` | 平面圖 | 清晰 PNG 或 JPG，避免擷取畫面模糊 |
| `location/` | 區域生活圈視覺 | 每案例 2–3 張；地圖維持 mock，直到資料來源核准 |
| `references/` | 視覺方向參考 | 僅供設計比對，不會被產品直接載入 |

## 命名規則

`類別-用途-案例或人物-版本.副檔名`，使用小寫 kebab-case。案例 ID：

- `gushan-art-district`：鼓山美術館生活圈
- `zuoying-hsr-district`：左營高鐵生活圈
- `fengshan-metro-district`：鳳山捷運生活圈

## 示意檔說明

- `brand-logo-*.png`、`demo-qr-showcase.png`、`demo-agent-*.png` 與 `*-placeholder.jpg` 是可直接覆蓋的視覺佔位檔。
- 佔位物件照採同一張「虛構住宅」示意圖，方便先驗證版型和裁切，不代表不同空間或真實案件。
- `README.md` 與 `asset-manifest.json` 供工程與設計核對；上線前應更新 manifest 的素材來源與核准狀態。

## 版型建議

- 16:9：主管／客戶簡報。
- A4 直式：PDF 報告。
- 手機版：閱讀優先，避免複雜編輯。

視覺方向：客戶報告使用暖白、深藍、金色；後台維持 Data Intelligence 科技感。
