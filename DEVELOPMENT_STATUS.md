# ShuttleHub 開發狀態總覽

> 最後更新：2025-11-28 16:39

## 📊 專案概況

**專案名稱**：ShuttleHub - 羽球活動管理系統  
**開發階段**：後端開發完成，等待資料庫部署  
**技術棧**：Vue 3 + TypeScript + Pinia (前端) / Express + Prisma + PostgreSQL (後端)

---

## ✅ 已完成的修改內容

### 一、後端專案結構建立

#### 1.1 專案初始化

- ✅ 建立 `backend/` 資料夾
- ✅ 初始化 Node.js 專案 (`package.json`)
- ✅ 配置 TypeScript (`tsconfig.json`)
- ✅ 建立基本目錄結構

**目錄結構：**

```
backend/
├── src/
│   ├── config/          # 配置檔案
│   ├── controllers/     # 控制器
│   ├── middleware/      # 中介層
│   ├── routes/          # 路由
│   ├── services/        # 業務邏輯
│   ├── types/           # 型別定義
│   ├── utils/           # 工具函式
│   └── index.ts         # 入口檔案
├── prisma/
│   └── schema.prisma    # 資料庫 Schema
├── .env                 # 環境變數
├── .env.example         # 環境變數範例
├── .gitignore           # Git 忽略檔案
├── package.json         # 專案配置
└── tsconfig.json        # TypeScript 配置
```

#### 1.2 安裝的套件

**核心依賴：**

- `express` - Web 框架
- `@prisma/client` - Prisma ORM 客戶端
- `bcrypt` - 密碼加密
- `jsonwebtoken` - JWT 認證
- `cors` - 跨域請求處理
- `dotenv` - 環境變數管理

**開發依賴：**

- `typescript` - TypeScript 支援
- `ts-node` - TypeScript 執行環境
- `nodemon` - 熱重載
- `prisma` - Prisma CLI
- `@types/*` - 型別定義檔

### 二、資料庫設計 (Prisma Schema)

#### 2.1 資料模型

**User 模型（使用者）**

```prisma
model User {
  id            Int            @id @default(autoincrement())
  email         String         @unique
  password      String         // bcrypt 加密
  name          String
  role          Role           @default(MEMBER)
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  organizedEvents Event[]      @relation("EventOrganizer")
  registrations   Registration[]
}
```

**Event 模型（活動）**

```prisma
model Event {
  id            Int            @id @default(autoincrement())
  title         String
  description   String
  date          DateTime
  startTime     String         // "HH:mm" 格式
  endTime       String         // "HH:mm" 格式
  location      String
  price         Int
  maxAttendees  Int
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  organizer     User           @relation("EventOrganizer", fields: [organizerId], references: [id], onDelete: Cascade)
  organizerId   Int
  registrations Registration[]
}
```

**Registration 模型（報名）**

```prisma
model Registration {
  id              Int                @id @default(autoincrement())
  participantName String
  numberOfPeople  Int                @default(1)
  status          RegistrationStatus @default(CONFIRMED)
  createdAt       DateTime           @default(now())
  updatedAt       DateTime           @updatedAt

  user          User               @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId        Int
  event         Event              @relation(fields: [eventId], references: [id], onDelete: Cascade)
  eventId       Int

  @@unique([userId, eventId])
}
```

**枚舉類型：**

```prisma
enum Role {
  MEMBER
  ORGANIZER
  ADMIN
}

enum RegistrationStatus {
  CONFIRMED
  WAITLISTED
}
```

### 三、後端 API 實作

#### 3.1 工具函式 (`src/utils/`)

**密碼加密 (`password.ts`)**

- `hashPassword(password)` - 加密密碼
- `comparePassword(password, hash)` - 驗證密碼

**JWT 處理 (`jwt.ts`)**

- `generateToken(payload)` - 生成 Token
- `verifyToken(token)` - 驗證 Token

#### 3.2 中介層 (`src/middleware/`)

**認證中介層 (`auth.ts`)**

- `authenticate` - 驗證 JWT Token
- 自動將使用者資訊注入 `req.user`

**授權中介層 (`authorize.ts`)**

- `authorize(roles)` - 檢查使用者角色權限

#### 3.3 服務層 (`src/services/`)

**認證服務 (`authService.ts`)**

- `registerUser(userData)` - 註冊新使用者
- `loginUser(loginData)` - 使用者登入

**活動服務 (`eventService.ts`)**

- `getAllEvents(page, limit)` - 取得活動列表（分頁）
- `getEventById(id)` - 取得活動詳情
- `createEvent(eventData, organizerId)` - 建立活動
- `updateEvent(id, eventData, userId, userRole)` - 更新活動
- `deleteEvent(id, userId, userRole)` - 刪除活動

**報名服務 (`registrationService.ts`)**

- `registerForEvent(eventId, userId, participantName, numberOfPeople)` - 報名活動
- `cancelRegistration(id, userId, userRole)` - 取消報名
- `getUserRegistrations(userId)` - 查詢使用者報名紀錄

#### 3.4 控制器 (`src/controllers/`)

**認證控制器 (`authController.ts`)**

- `register` - 處理註冊請求
- `login` - 處理登入請求

**活動控制器 (`eventController.ts`)**

- `getEvents` - 取得活動列表
- `getEvent` - 取得活動詳情
- `createEvent` - 建立活動
- `updateEvent` - 更新活動
- `deleteEvent` - 刪除活動

**報名控制器 (`registrationController.ts`)**

- `register` - 處理報名請求
- `cancel` - 處理取消報名
- `getMyRegistrations` - 查詢我的報名

#### 3.5 路由 (`src/routes/`)

**認證路由 (`auth.ts`)**

- `POST /api/auth/register` - 註冊
- `POST /api/auth/login` - 登入

**活動路由 (`events.ts`)**

- `GET /api/events` - 取得活動列表
- `GET /api/events/:id` - 取得活動詳情
- `POST /api/events` - 建立活動 🔒
- `PUT /api/events/:id` - 更新活動 🔒
- `DELETE /api/events/:id` - 刪除活動 🔒

**報名路由 (`registrations.ts`)**

- `POST /api/events/:eventId/register` - 報名活動 🔒
- `DELETE /api/registrations/:id` - 取消報名 🔒
- `GET /api/registrations/me` - 查詢我的報名 🔒

🔒 = 需要登入

#### 3.6 主程式 (`src/index.ts`)

- ✅ Express 應用程式設定
- ✅ CORS 配置
- ✅ JSON 解析中介層
- ✅ 路由註冊
- ✅ 健康檢查端點 (`GET /health`)

### 四、前端整合

#### 4.1 API Service 層

**新增檔案：`src/services/api.ts`**

- ✅ Axios 實例配置
- ✅ 請求攔截器（自動附加 JWT Token）
- ✅ 回應攔截器（處理 401 錯誤）

```typescript
// 自動從 localStorage 讀取 Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

#### 4.2 AuthStore 更新

**修改檔案：`src/stores/authStore.ts`**

**主要變更：**

- ✅ `register()` 改為呼叫後端 API
- ✅ `login()` 改為呼叫後端 API
- ✅ `logout()` 清除 Token 和使用者資訊
- ✅ `init()` 從 localStorage 載入 Token
- ✅ 所有函式改為 `async/await`
- ✅ 完整的錯誤處理

**Token 儲存方式：**

```typescript
// 註冊/登入成功後
localStorage.setItem('token', data.data.token)
localStorage.setItem('user', JSON.stringify(data.data.user))

// 登出時
localStorage.removeItem('token')
localStorage.removeItem('user')
```

#### 4.3 EventStore 更新

**修改檔案：`src/stores/eventStore.ts`**

**主要變更：**

- ✅ 完全重寫，使用後端 API
- ✅ 新增 `loading` 和 `error` 狀態
- ✅ 所有函式改為 `async/await`
- ✅ 資料型別對應（後端 number ID → 前端 string ID）

**新增/更新的函式：**

- `fetchEvents()` - 載入活動列表
- `fetchEventById(id)` - 載入活動詳情
- `createEvent(eventData)` - 建立活動
- `updateEvent(id, updates)` - 更新活動
- `deleteEvent(id)` - 刪除活動
- `registerForEvent(eventId, participantName, numberOfPeople)` - 報名
- `cancelRegistration(id)` - 取消報名
- `fetchMyRegistrations()` - 查詢報名紀錄

### 五、配置檔案

#### 5.1 環境變數

**檔案：`backend/.env`**

```env
# 資料庫連線（待更新為本地 PostgreSQL）
DATABASE_URL="postgresql://postgres:password@localhost:5432/shuttlehub"
DIRECT_URL="postgresql://postgres:password@localhost:5432/shuttlehub"

# JWT 設定
JWT_SECRET="shuttlehub-super-secret-jwt-key-2025-change-in-production"
JWT_EXPIRES_IN="7d"

# 伺服器設定
PORT=3001
NODE_ENV="development"

# CORS 設定
FRONTEND_URL="http://localhost:5173"
```

#### 5.2 TypeScript 配置

**檔案：`backend/tsconfig.json`**

- ✅ 目標版本：ES2020
- ✅ 模組系統：CommonJS
- ✅ 輸出目錄：`dist/`
- ✅ 嚴格模式啟用

#### 5.3 Package.json 腳本

**後端腳本：**

```json
{
  "scripts": {
    "dev": "nodemon src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

---

## ⏳ 待執行項目

### 階段一：資料庫部署（優先）

#### 1.1 本地 PostgreSQL 設定

- [ ] 確認 PostgreSQL 已安裝並運行
- [ ] 建立資料庫 `shuttlehub`
- [ ] 更新 `backend/.env` 中的連線字串

**執行指令：**

```bash
# 建立資料庫
psql -U postgres
CREATE DATABASE shuttlehub;
```

#### 1.2 執行 Prisma 遷移

- [ ] 執行資料庫遷移
- [ ] 生成 Prisma Client
- [ ] 驗證資料表建立成功

**執行指令：**

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

**預期結果：**

- 建立 `User`, `Event`, `Registration` 三個資料表
- 生成 Prisma Client 在 `node_modules/@prisma/client`

### 階段二：後端啟動與測試

#### 2.1 啟動後端伺服器

- [ ] 啟動開發伺服器
- [ ] 測試健康檢查端點

**執行指令：**

```bash
cd backend
npm run dev
```

**驗證：**

```bash
curl http://localhost:3001/health
# 預期回應：{"status":"ok","timestamp":"..."}
```

#### 2.2 API 功能測試

**認證測試：**

- [ ] 測試註冊 API
- [ ] 測試登入 API
- [ ] 驗證 Token 生成

**活動測試：**

- [ ] 測試取得活動列表
- [ ] 測試建立活動（需團長權限）
- [ ] 測試更新活動
- [ ] 測試刪除活動

**報名測試：**

- [ ] 測試報名活動
- [ ] 測試候補邏輯（人數超過上限）
- [ ] 測試取消報名
- [ ] 測試查詢報名紀錄

### 階段三：前端整合測試

#### 3.1 基本功能測試

- [ ] 測試註冊流程
- [ ] 測試登入流程
- [ ] 測試登出功能
- [ ] 驗證 Token 自動附加

#### 3.2 活動管理測試

- [ ] 測試瀏覽活動列表
- [ ] 測試查看活動詳情
- [ ] 測試建立活動（團長）
- [ ] 測試編輯活動
- [ ] 測試刪除活動

#### 3.3 報名功能測試

- [ ] 測試報名活動
- [ ] 測試修改報名人數
- [ ] 測試取消報名
- [ ] 測試候補功能
- [ ] 測試查看我的報名

### 階段四：資料準備

#### 4.1 建立測試帳號

- [ ] 建立管理員帳號
- [ ] 建立團長帳號
- [ ] 建立一般會員帳號

**方式一：使用 Prisma Studio**

```bash
cd backend
npx prisma studio
```

**方式二：使用 SQL**

```sql
-- 注意：密碼需要先用 bcrypt 加密
INSERT INTO "User" (email, password, name, role) VALUES
  ('admin@shuttlehub.com', '$2b$10$...', '系統管理員', 'ADMIN'),
  ('organizer@test.com', '$2b$10$...', '測試團長', 'ORGANIZER'),
  ('member@test.com', '$2b$10$...', '測試會員', 'MEMBER');
```

#### 4.2 建立測試活動

- [ ] 建立多個測試活動
- [ ] 設定不同的日期、時間、地點
- [ ] 測試不同的人數上限

### 階段五：優化與增強

#### 5.1 錯誤處理優化

- [ ] 統一 API 錯誤回應格式
- [ ] 新增詳細的錯誤訊息
- [ ] 前端錯誤提示優化

#### 5.2 UI/UX 改進

- [ ] 新增載入動畫
- [ ] 優化錯誤提示樣式
- [ ] 新增成功提示訊息
- [ ] 改善表單驗證提示

#### 5.3 功能增強

- [ ] 新增活動搜尋功能
- [ ] 新增活動篩選（日期、地點、價格）
- [ ] 新增報名人員管理介面
- [ ] 新增活動取消功能
- [ ] 新增 Email 通知（可選）

### 階段六：部署準備

#### 6.1 環境配置

- [ ] 設定生產環境變數
- [ ] 更換生產環境 JWT_SECRET
- [ ] 配置 Supabase 生產資料庫

#### 6.2 Vercel 部署

- [ ] 配置 Vercel 專案
- [ ] 設定環境變數
- [ ] 部署前端
- [ ] 部署後端（Serverless Functions）

#### 6.3 資料庫遷移

- [ ] 在 Supabase 執行 Prisma 遷移
- [ ] 驗證生產資料庫連線
- [ ] 匯入初始資料（如需要）

---

## 📋 開發檢查清單

### 立即執行（高優先級）

- [ ] **安裝 PostgreSQL**
- [ ] **執行 Prisma 遷移**
- [ ] **啟動後端伺服器**
- [ ] **測試基本功能**

### 短期目標（1-2 天）

- [ ] 建立測試資料
- [ ] 完整功能測試
- [ ] 修復發現的 Bug
- [ ] UI/UX 優化

### 中期目標（1 週）

- [ ] 功能增強
- [ ] 效能優化
- [ ] 安全性檢查
- [ ] 撰寫 API 文件

### 長期目標（2 週+）

- [ ] 準備部署
- [ ] 生產環境測試
- [ ] 上線發布

---

## 💡 重要提醒

### 安全性

- ⚠️ **請勿將 `.env` 檔案提交到 Git**
- ⚠️ **生產環境務必更換 JWT_SECRET**
- ⚠️ **定期更新依賴套件**

### 資料庫

- ⚠️ **定期備份資料庫**
- ⚠️ **測試環境與生產環境分離**
- ⚠️ **謹慎執行資料庫遷移**

### 開發流程

- ✅ 每次修改後測試功能
- ✅ 使用 Git 版本控制
- ✅ 撰寫清楚的 Commit 訊息
- ✅ 遇到問題記錄錯誤訊息

---

## 📞 需要協助？

如果在開發過程中遇到問題，請檢查：

1. **部署指南** - 詳細的步驟說明
2. **錯誤訊息** - 記錄完整的錯誤訊息
3. **環境配置** - 確認 `.env` 設定正確
4. **資料庫連線** - 確認 PostgreSQL 運行中

---

**最後更新：2025-11-28 16:39**  
**開發進度：後端 100% | 前端整合 100% | 資料庫部署 0%**
