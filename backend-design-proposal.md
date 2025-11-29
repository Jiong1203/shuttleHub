# Shuttle Hub 後端開發建議書

## 1. 總結

目前專案為純前端應用，所有資料皆儲存於瀏覽器中，這對於原型開發很方便，但無法滿足真實應用的需求。為了實現資料的永久保存、跨裝置同步及提升安全性，建議建立一個獨立的後端 API 服務。

本文檔旨在提出一個基於 **Node.js** 與 **Express.js** 的後端架構設計方案。

## 2. 技術棧選擇 (Technology Stack)

*   **執行環境 (Runtime)**: **Node.js** - 讓您可以在後端繼續使用熟悉的 JavaScript/TypeScript。
*   **框架 (Framework)**: **Express.js** - 生態系豐富、社群龐大，擁有大量的文件和第三方套件，易於維護與擴展。
*   **資料庫 (Database)**: **PostgreSQL** - 一個功能強大、穩定且開源的關聯式資料庫，非常適合處理使用者、活動、報名等結構化資料。
*   **ORM (物件關聯對映)**: **Prisma** - 提供絕佳的 TypeScript 整合與型別安全，能讓開發者用 TypeScript 語法安全地操作資料庫，大幅提升開發效率與程式碼品質。

## 3. 核心架構設計

後端將作為一個 **RESTful API** 存在，前端透過標準的 HTTP 請求與之通訊。

### A. 資料庫模型 (Database Schema)

我們將使用 Prisma 來定義資料模型，它會自動生成對應的資料庫結構。

```prisma
// schema.prisma

// 設定資料庫類型
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL") // 資料庫連線字串儲存在環境變數中
}

// Prisma Client 生成器
generator client {
  provider = "prisma-client-js"
}

// 使用者模型
model User {
  id           Int      @id @default(autoincrement())
  email        String   @unique
  password     String   // 密碼需要經過加密 (hashing) 處理
  name         String
  role         Role     @default(MEMBER)
  registrations Registration[]
}

// 活動模型
model Event {
  id           Int      @id @default(autoincrement())
  title        String
  description  String
  date         DateTime
  location     String
  maxAttendees Int
  organizer    User     @relation(fields: [organizerId], references: [id])
  organizerId  Int
  registrations Registration[]
}

// 報名模型
model Registration {
  id      Int   @id @default(autoincrement())
  user    User  @relation(fields: [userId], references: [id])
  userId  Int
  event   Event @relation(fields: [eventId], references: [id])
  eventId Int
  status  RegistrationStatus @default(CONFIRMED)

  // 複合唯一鍵，確保同一使用者對同一活動只能報名一次
  @@unique([userId, eventId])
}

// 角色枚舉
enum Role {
  MEMBER
  ORGANIZER
  ADMIN
}

// 報名狀態枚舉
enum RegistrationStatus {
  CONFIRMED
  WAITLISTED
}
```

### B. API 端點 (API Endpoints)

後端將提供一系列 API 端點來取代前端的本地邏輯。

*   **認證 (Auth)**
    *   `POST /api/auth/register`: 註冊新使用者。
    *   `POST /api/auth/login`: 使用者登入，成功後回傳 JWT。

*   **活動 (Events)**
    *   `GET /api/events`: 取得所有活動列表。
    *   `GET /api/events/:id`: 取得單一活動的詳細資訊。
    *   `POST /api/events`: 建立新活動 (需要 `ORGANIZER` 權限)。
    *   `PUT /api/events/:id`: 更新活動資訊 (需要 `ORGANIZER` 權限)。
    *   `DELETE /api/events/:id`: 刪除活動 (需要 `ORGANIZER` 權限)。

*   **報名 (Registrations)**
    *   `POST /api/events/:id/register`: 報名特定活動 (需要 `MEMBER` 權限)。
    *   `DELETE /api/registrations/:id`: 取消報名。

### C. 認證與授權 (Authentication & Authorization)

1.  **登入流程**: 使用者提供 Email 和密碼，後端驗證成功後，生成一個 **JSON Web Token (JWT)** 並返回給前端。
2.  **儲存 Token**: 前端將此 JWT 儲存起來 (建議放在 `HttpOnly` cookie 中以提升安全性)。
3.  **請求驗證**: 對於需要保護的 API 請求，前端必須在請求標頭 (`Authorization: Bearer <token>`) 或 cookie 中附上此 JWT。
4.  **後端保護**: 後端建立一個中介層 (Middleware)，在處理受保護的路由前，會先驗證 JWT 的有效性，並從中解析出使用者資訊 (如 `userId`, `role`)。
5.  **權限管理**: 根據解析出的使用者角色 (`role`)，判斷其是否有權限執行特定操作（例如，只有 `ORGANIZER` 才能建立活動）。

## 4. 前端修改建議

當後端 API 開發完成後，需要修改前端的 `src/stores` 目錄下的 Pinia stores：

1.  **安裝 HTTP 客戶端**: 在前端專案中加入 `axios` 或使用原生的 `fetch`。
2.  **修改 `authStore.ts`**:
    *   `login` 函式：呼叫 `POST /api/auth/login`，並將後端返回的 JWT 和使用者資料存入狀態。
    *   `register` 函式：呼叫 `POST /api/auth/register`。
    *   `logout` 函式：清除本地儲存的 JWT 並重設狀態。
3.  **修改 `eventStore.ts`**:
    *   `fetchEvents` 函式：呼叫 `GET /api/events` 來獲取活動列表。
    *   所有涉及活動修改、報名的函式都應改為呼叫對應的後端 API。
4.  **建立 API Service 層**: 建議在 `src` 下建立一個 `services` 或 `api` 目錄，將所有與後端通訊的 logique 封裝起來，讓 `stores` 的職責更單純。

## 5. 開發步驟建議

1.  在專案根目錄下建立一個新的 `backend` 資料夾。
2.  在 `backend` 資料夾中初始化 Node.js 專案 (`npm init -y`) 並安裝 TypeScript。
3.  安裝 Express.js, Prisma, PostgreSQL Driver (`pg`), `cors`, `bcrypt` (用於密碼加密), `jsonwebtoken` 等核心套件。
4.  設定 Prisma (`npx prisma init`) 並撰寫 `schema.prisma`。
5.  撰寫 API 的路由、控制器 (Controllers) 和服務 (Services) 邏輯。
6.  完成後端 API 的基本功能後，再回頭修改前端的 `stores` 來對接 API。

---

這份文件提供了一個清晰的開發藍圖，遵循此建議將能建構一個穩固、安全且可擴展的後端系統。
