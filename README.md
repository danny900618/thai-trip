# 泰國家族旅行 2027 🇹🇭

2027/1/18–1/23・9 人。手機優先的旅遊網站，可「加入主畫面」當 App 用，離線也能看上次載入的資料。

## 功能

| 分頁 | 內容 |
|---|---|
| 🏠 今天 | 出發前：倒數、準備進度、天氣、第一天行程 ／ 旅途中：現在＋下一個行程、今日天氣、今日時間軸、給司機看的飯店地址 |
| 📅 行程 | 依日期切換的完整行程 |
| 📋 須知 | 必帶清單（勾選記在各自手機）、注意事項 |
| 🆘 緊急 | 一鍵撥號：泰國緊急電話、駐泰辦事處、團內聯絡人、飯店 |
| 👤 我的 | 個人專屬連結：入境卡 QR、房號、班機 |

## 開發

```bash
npm install
npm run dev
```

**模擬時間**（測試旅途中的畫面）：網址加 `?now=2027-01-19T10:00`（泰國時間）
**測試個人頁**：網址加 `?me=demo`

## 要填的資料

- `src/config.ts`：出發時間、班機、飯店（含泰文地址）、團內聯絡人、天氣城市（搜尋 `TODO`）
- 行程與成員：Google Sheet，設定方式見 [docs/GOOGLE_SHEET.md](docs/GOOGLE_SHEET.md)
- 必帶清單、注意事項、緊急電話：`src/data/static.ts`

## 部署（擇一，皆免費）

- **Vercel / Netlify**：連結 GitHub repo，Build command `npm run build`，Output `dist`
- **GitHub Pages**：`npm run build` 後把 `dist/` 推到 `gh-pages` 分支

天氣資料來自 [Open-Meteo](https://open-meteo.com/)（免費、免金鑰，最多預報 16 天）。
