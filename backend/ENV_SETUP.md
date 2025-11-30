# 🔐 環境變數設定指南

## 在 Vercel 設定環境變數的步驟

### 1. 進入環境變數設定頁面

1. 登入 [Vercel Dashboard](https://vercel.com/dashboard)
2. 選擇您的**後端專案**
3. 點擊 **Settings** → **Environment Variables**

### 2. 必需環境變數清單

#### 📊 DATABASE_URL（Supabase 連接字串）

**如何取得：**
1. 前往 [Supabase Dashboard](https://app.supabase.com)
2. 選擇您的專案
3. **Settings** → **Database**
4. 在 **Connection string** 區塊：
   - 選擇 **URI**
   - 複製連接字串
   - 將 `[YOUR-PASSWORD]` 替換為您的資料庫密碼

**格式範例：**
```
postgresql://postgres:your-password@db.abcdefghijklmnop.supabase.co:5432/postgres
```

**在 Vercel 設定：**
- Name: `DATABASE_URL`
- Value: 您的 Supabase 連接字串
- Environment: ✅ Production, ✅ Preview, ✅ Development

---

#### 📊 DIRECT_URL（Supabase 直接連接）

**說明：** 通常與 DATABASE_URL 相同，用於 Prisma migrations

**在 Vercel 設定：**
- Name: `DIRECT_URL`
- Value: 與 DATABASE_URL 相同的值
- Environment: ✅ Production, ✅ Preview, ✅ Development

---

#### 🔑 JWT_SECRET（JWT 簽署密鑰）

**如何生成：**
在終端機執行：
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**重要：** 請使用強密鑰，不要使用預設值！

**在 Vercel 設定：**
- Name: `JWT_SECRET`
- Value: 生成的隨機字串（至少 32 個字元）
- Environment: ✅ Production, ✅ Preview, ✅ Development

---

#### 🌐 FRONTEND_URL（前端 URL）

**在 Vercel 設定：**
- Name: `FRONTEND_URL`
- Value: `https://shuttle-hub.vercel.app`
- Environment: ✅ Production, ✅ Preview, ✅ Development

---

### 3. 可選環境變數

#### ⏰ JWT_EXPIRES_IN（Token 過期時間）

**在 Vercel 設定：**
- Name: `JWT_EXPIRES_IN`
- Value: `7d`（7 天）或其他值如 `24h`, `30d`
- Environment: ✅ Production（可選）

---

## 📋 快速檢查清單

部署前確認：

- [ ] `DATABASE_URL` 已設定（Supabase 連接字串）
- [ ] `DIRECT_URL` 已設定（與 DATABASE_URL 相同）
- [ ] `JWT_SECRET` 已設定（強密鑰，非預設值）
- [ ] `FRONTEND_URL` 已設定（`https://shuttle-hub.vercel.app`）
- [ ] 所有環境變數都已選擇 **Production** 環境
- [ ] 已點擊 **Save** 儲存所有變數

---

## ⚠️ 安全提醒

1. **JWT_SECRET** 必須是強密鑰，建議至少 32 個字元
2. **DATABASE_URL** 包含密碼，請勿分享或提交到 Git
3. 生產環境和開發環境使用不同的 JWT_SECRET
4. 定期更新密鑰以提高安全性

---

## 🔗 相關資源

- [Supabase 連接字串說明](https://supabase.com/docs/guides/database/connecting-to-postgres)
- [Vercel 環境變數文檔](https://vercel.com/docs/concepts/projects/environment-variables)

