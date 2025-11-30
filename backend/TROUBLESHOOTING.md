# 🔧 故障排除指南

## 問題：DEPLOYMENT_NOT_FOUND 錯誤

### 原因 1：使用了範例 URL

**錯誤：**
```bash
curl https://your-backend-url.vercel.app/health
# 返回：DEPLOYMENT_NOT_FOUND
```

**解決方案：**
1. 前往 [Vercel Dashboard](https://vercel.com/dashboard)
2. 選擇您的**後端專案**
3. 在 **Deployments** 標籤中，找到最新的部署
4. 複製實際的部署 URL（格式類似：`https://shuttle-hub-backend-xxx.vercel.app`）
5. 使用實際 URL 測試：
   ```bash
   curl https://shuttle-hub-backend-xxx.vercel.app/health
   ```

---

### 原因 2：部署失敗

**檢查步驟：**

1. **查看構建日誌**
   - 在 Vercel Dashboard 中，點擊失敗的部署
   - 查看 **Build Logs** 和 **Function Logs**
   - 尋找錯誤訊息

2. **常見錯誤及解決方案**

#### 錯誤：找不到模組或路徑
```
Error: Cannot find module '../src/index'
```

**解決方案：**
- 確認 `backend/api/index.ts` 文件存在
- 確認 `backend/src/index.ts` 文件存在
- 檢查文件路徑是否正確

#### 錯誤：Prisma Client 未生成
```
Error: @prisma/client did not initialize yet
```

**解決方案：**
- 確認 `package.json` 中有 `postinstall` 腳本：
  ```json
  "postinstall": "prisma generate"
  ```
- 確認 `build` 腳本包含 Prisma generate：
  ```json
  "build": "prisma generate && tsc"
  ```

#### 錯誤：環境變數未設定
```
Error: DATABASE_URL is not defined
```

**解決方案：**
- 前往 Vercel 專案設置
- 確認所有必需環境變數都已設定
- 參考 `ENV_SETUP.md` 檢查清單

---

### 原因 3：Vercel 配置問題

**檢查項目：**

1. **Root Directory 設定**
   - 確認 Vercel 專案的 Root Directory 設為 `backend`
   - 路徑：Settings → General → Root Directory

2. **Framework Preset**
   - 可以選擇 `Other` 或 `Express`
   - 兩者都可以，因為我們有 `vercel.json` 配置

3. **Build Command**
   - 可以留空（Vercel 會自動檢測）
   - 或設定為：`npm run build`

4. **Output Directory**
   - 留空（Vercel Serverless Functions 不需要）

---

## 驗證部署的步驟

### 步驟 1：確認部署成功

1. 前往 Vercel Dashboard
2. 選擇後端專案
3. 檢查 **Deployments** 標籤
4. 確認最新部署狀態為 **Ready**（綠色勾號）

### 步驟 2：取得實際 URL

1. 點擊最新的部署
2. 在部署詳情頁面，找到 **Domains** 區塊
3. 複製 URL（例如：`https://shuttle-hub-backend-abc123.vercel.app`）

### 步驟 3：測試健康檢查端點

使用實際 URL 測試：

```bash
# Windows PowerShell
curl https://your-actual-backend-url.vercel.app/health

# 或使用瀏覽器直接訪問
# https://your-actual-backend-url.vercel.app/health
```

**預期回應：**
```json
{
  "status": "ok",
  "timestamp": "2025-01-XX..."
}
```

### 步驟 4：測試 API 端點

```bash
# 測試註冊端點
curl -X POST https://your-actual-backend-url.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"test123\",\"name\":\"Test User\"}"
```

---

## 常見問題 FAQ

### Q1: 如何找到我的後端部署 URL？

**A:** 
1. 登入 Vercel Dashboard
2. 選擇後端專案
3. 在專案首頁的右上角，會顯示部署 URL
4. 或在 **Deployments** 標籤中，點擊最新部署查看 URL

### Q2: 部署成功但 API 返回 404？

**A:** 
- 確認路由路徑正確
- 健康檢查端點：`/health`（不需要 `/api` 前綴）
- API 端點：`/api/auth/login`、`/api/events` 等

### Q3: CORS 錯誤？

**A:**
- 確認 `FRONTEND_URL` 環境變數已設定
- 確認前端 URL 正確（例如：`https://shuttle-hub.vercel.app`）
- 檢查 `backend/src/index.ts` 中的 CORS 配置

### Q4: 資料庫連接失敗？

**A:**
- 確認 `DATABASE_URL` 和 `DIRECT_URL` 環境變數已設定
- 確認 Supabase 專案正在運行
- 檢查連接字串格式是否正確
- 確認 Supabase 允許外部連接

### Q5: 如何查看詳細錯誤日誌？

**A:**
1. 在 Vercel Dashboard 中，點擊部署
2. 查看 **Function Logs** 標籤
3. 查看 **Build Logs** 標籤
4. 檢查是否有錯誤訊息

---

## 需要更多協助？

如果問題仍然存在，請提供以下資訊：

1. **Vercel 構建日誌**（從 Build Logs 複製）
2. **實際的部署 URL**
3. **錯誤訊息**（完整的錯誤訊息）
4. **環境變數設定**（確認已設定的變數名稱，不要提供實際值）

這樣可以更快診斷問題！

