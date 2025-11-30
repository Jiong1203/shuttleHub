# Vercel 後端部署指南

## 📋 部署步驟

### 步驟 1：在 Vercel 創建新專案

1. 登入 [Vercel Dashboard](https://vercel.com/dashboard)
2. 點擊 **Add New Project**
3. 選擇您的 GitHub repository (`Jiong1203/shuttleHub`)
4. **重要設定**：
   - **Root Directory**: 選擇 `backend`
   - **Framework Preset**: 選擇 `Other` 或 `Express`
   - **Build Command**: `npm run build` (可選，Vercel 會自動檢測)
   - **Output Directory**: 留空（Vercel 會自動處理）

### 步驟 2：設定環境變數

在 Vercel 專案設置中添加以下環境變數：

#### 🔐 必需環境變數

##### 1. DATABASE_URL
- **說明**: Supabase PostgreSQL 連接字串
- **如何取得**:
  1. 登入 [Supabase Dashboard](https://app.supabase.com)
  2. 選擇您的專案
  3. 前往 **Settings** → **Database**
  4. 在 **Connection string** 區塊，選擇 **URI**
  5. 複製連接字串（格式類似：`postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`）
  6. 將 `[YOUR-PASSWORD]` 替換為您的資料庫密碼
- **範例**: `postgresql://postgres:your-password@db.abcdefghijklmnop.supabase.co:5432/postgres`

##### 2. DIRECT_URL
- **說明**: Supabase 直接連接字串（用於 Prisma migrations）
- **如何取得**: 與 DATABASE_URL 相同，通常使用相同的連接字串
- **範例**: `postgresql://postgres:your-password@db.abcdefghijklmnop.supabase.co:5432/postgres`

##### 3. JWT_SECRET
- **說明**: 用於簽署 JWT Token 的密鑰（**請使用強密鑰**）
- **如何生成**: 
  ```bash
  # 在終端機執行以下命令生成隨機密鑰
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```
- **範例**: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2`

##### 4. FRONTEND_URL
- **說明**: 前端應用程式的 URL（用於 CORS 配置）
- **值**: `https://shuttle-hub.vercel.app`
- **注意**: 如果前端 URL 有變更，請更新此值

#### 🔧 可選環境變數

##### 5. JWT_EXPIRES_IN
- **說明**: JWT Token 過期時間
- **預設值**: `7d` (7 天)
- **範例**: `7d`, `24h`, `30d`

##### 6. NODE_ENV
- **說明**: 環境模式
- **值**: `production`
- **注意**: Vercel 通常會自動設定

### 步驟 3：設定環境變數的詳細步驟

1. 在 Vercel 專案 Dashboard 中，點擊 **Settings**
2. 選擇 **Environment Variables**
3. 為每個環境變數點擊 **Add**：
   - 輸入 **Name**（例如：`DATABASE_URL`）
   - 輸入 **Value**（您的實際值）
   - 選擇 **Environment**：
     - ✅ Production
     - ✅ Preview
     - ✅ Development（可選）
4. 點擊 **Save**

### 步驟 4：部署

1. 點擊 **Deployments** 標籤
2. 如果還沒有部署，點擊 **Redeploy**
3. 等待構建完成

### 步驟 5：取得後端 URL

部署完成後：
1. 在 Vercel Dashboard 中查看部署詳情
2. 複製 **Deployment URL**（例如：`https://shuttle-hub-backend.vercel.app`）
3. 後端 API 基礎 URL 為：`https://shuttle-hub-backend.vercel.app/api`

### 步驟 6：更新前端環境變數

1. 回到**前端 Vercel 專案**（`shuttle-hub.vercel.app`）
2. 前往 **Settings** → **Environment Variables**
3. 更新或添加 `VITE_API_URL`：
   - **Name**: `VITE_API_URL`
   - **Value**: `https://shuttle-hub-backend.vercel.app/api`（使用步驟 5 取得的 URL）
4. 重新部署前端專案

## 🔍 驗證部署

### 測試健康檢查端點

在瀏覽器或使用 curl 測試：

```bash
curl https://shuttle-hub-backend.vercel.app/health
```

預期回應：
```json
{
  "status": "ok",
  "timestamp": "2025-01-XX..."
}
```

### 測試 API 端點

```bash
# 測試註冊端點
curl -X POST https://shuttle-hub-backend.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'
```

## ⚠️ 常見問題

### 問題 1: Prisma Client 未生成

**解決方案**:
在 `backend/package.json` 的 `build` 腳本中添加 Prisma generate：

```json
{
  "scripts": {
    "build": "prisma generate && tsc",
    "postinstall": "prisma generate"
  }
}
```

### 問題 2: CORS 錯誤

**解決方案**:
確認 `FRONTEND_URL` 環境變數已正確設定為前端 URL。

### 問題 3: 資料庫連接失敗

**解決方案**:
1. 確認 Supabase 專案正在運行
2. 檢查 `DATABASE_URL` 和 `DIRECT_URL` 是否正確
3. 確認 Supabase 允許來自 Vercel 的連接（通常預設允許）

## 📝 環境變數檢查清單

部署前請確認以下環境變數都已設定：

- [ ] `DATABASE_URL` - Supabase 連接字串
- [ ] `DIRECT_URL` - Supabase 直接連接字串
- [ ] `JWT_SECRET` - JWT 簽署密鑰（強密鑰）
- [ ] `FRONTEND_URL` - 前端 URL
- [ ] `JWT_EXPIRES_IN` - Token 過期時間（可選）
- [ ] `NODE_ENV` - 環境模式（可選）

## 🔗 相關連結

- [Vercel 文檔](https://vercel.com/docs)
- [Supabase 文檔](https://supabase.com/docs)
- [Prisma 文檔](https://www.prisma.io/docs)

