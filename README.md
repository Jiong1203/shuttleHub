# 🏸 ShuttleHub - 羽球開團與報名平台

ShuttleHub 是一個專為羽球愛好者設計的活動開團與報名網站。無論您是想尋找球友切磋球技，還是熱心的主辦者想要舉辦活動，ShuttleHub 都能滿足您的需求。

## ✨ 核心功能

- **🏠 首頁 (Landing Page)**
  - 吸引人的 Hero 區塊與功能亮點介紹。
  - 快速引導使用者尋找活動或開團。

- **📋 活動瀏覽**
  - 查看所有即將到來的羽球活動。
  - 卡片式設計，清晰呈現時間、地點、程度與費用等關鍵資訊。

- **🏸 我要開團**
  - 簡單直覺的表單，快速建立新活動。
  - 支援設定程度分級 (新手友善、中級程度等)、人數上限與費用。

- **📝 報名系統**
  - 使用者可查看活動詳情並一鍵報名。
  - 即時顯示目前報名狀況 (已報名人數/名額上限)。

- **👥 管理介面 (主辦者專用)**
  - 管理自己發布的活動。
  - 審核報名者名單 (核准/拒絕)。
  - 檢視報名統計數據。

## 🛠️ 技術堆疊

本專案採用現代化的前端技術構建：

- **框架**: [Vue 3](https://vuejs.org/) (Script Setup)
- **建置工具**: [Vite](https://vitejs.dev/)
- **狀態管理**: [Pinia](https://pinia.vuejs.org/)
- **路由管理**: [Vue Router](https://router.vuejs.org/)
- **樣式**: Vanilla CSS (搭配 CSS Variables 實作設計系統)
- **語言**: TypeScript

## 🚀 快速開始

### 環境需求

- Node.js (建議 v18+)
- npm

### 安裝依賴

```sh
npm install
```

### 啟動開發伺服器

```sh
npm run dev
```

### 建置生產版本

```sh
npm run build
```

### 程式碼檢查

```sh
npm run lint
```

## 📂 專案結構

- `src/views`: 頁面視圖 (Home, EventList, EventDetail, etc.)
- `src/components`: 可重複使用的 UI 元件 (Button, Card, Input)
- `src/stores`: Pinia 狀態管理 (EventStore)
- `src/assets`: 靜態資源與全域樣式 (main.css)
- `doc`: 專案文件 (Walkthrough)

## 📝 開發文件

詳細的功能展示與操作流程，請參考 [doc/walkthrough.md](./doc/walkthrough.md)。
