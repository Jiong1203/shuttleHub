# 🚀 快速修復指南

## 問題 1: "Cannot GET /" 錯誤

### ✅ 已修復
已添加根路徑路由，現在訪問 `https://shuttle-hub-backed.vercel.app/` 會顯示 API 資訊。

### 測試端點

1. **根路徑**（API 資訊）：
   ```
   https://shuttle-hub-backed.vercel.app/
   ```

2. **健康檢查**：
   ```
   https://shuttle-hub-backed.vercel.app/health
   ```

3. **API 端點**：
   ```
   https://shuttle-hub-backed.vercel.app/api/auth/login
   https://shuttle-hub-backed.vercel.app/api/events
   ```

---

## 問題 2: Framework Settings 警告

### 解決步驟

1. **在 Vercel Dashboard 中**：
   - 前往您的後端專案
   - Settings → Build and Deployment → Framework Settings

2. **更新 Build Command**：
   - 找到 **Build Command** 欄位
   - 點擊右側的 **Override** 開關（開啟）
   - 輸入：`npm run vercel-build`
   - 或使用：`prisma generate && tsc`

3. **確認其他設定**：
   - **Framework Preset**: `Other` ✅
   - **Output Directory**: 留空或 `.` ✅
   - **Install Command**: 留空（使用預設）✅

4. **儲存設定**：
   - 點擊頁面底部的 **Save** 按鈕

5. **重新部署**：
   - 前往 **Deployments** 標籤
   - 點擊最新部署右側的 **⋯** 選單
   - 選擇 **Redeploy**
   - 或推送新的 commit 觸發自動部署

---

## 驗證修復

### 步驟 1: 測試根路徑

在瀏覽器訪問：
```
https://shuttle-hub-backed.vercel.app/
```

**預期回應：**
```json
{
  "message": "ShuttleHub API Server",
  "version": "1.0.0",
  "endpoints": {
    "health": "/health",
    "auth": "/api/auth",
    "events": "/api/events",
    "registrations": "/api/registrations"
  }
}
```

### 步驟 2: 測試健康檢查

在瀏覽器訪問：
```
https://shuttle-hub-backed.vercel.app/health
```

**預期回應：**
```json
{
  "status": "ok",
  "timestamp": "2025-01-XX..."
}
```

### 步驟 3: 測試 API 端點

使用 curl 或 Postman 測試：

```bash
# 測試註冊端點
curl -X POST https://shuttle-hub-backed.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"test123\",\"name\":\"Test User\"}"
```

---

## 如果仍有問題

### 檢查清單

- [ ] 已更新 Build Command 為 `npm run vercel-build`
- [ ] 已點擊 **Save** 儲存設定
- [ ] 已重新部署專案
- [ ] 所有環境變數已正確設定
- [ ] Root Directory 設為 `backend`

### 查看構建日誌

1. 前往 **Deployments** 標籤
2. 點擊最新的部署
3. 查看 **Build Logs**
4. 確認沒有錯誤訊息

---

## 下一步

修復完成後：

1. **更新前端環境變數**：
   - 前往前端 Vercel 專案
   - Settings → Environment Variables
   - 更新 `VITE_API_URL` 為：`https://shuttle-hub-backed.vercel.app/api`

2. **重新部署前端**：
   - 觸發前端重新部署以應用新的 API URL

3. **測試完整流程**：
   - 訪問前端網站
   - 測試登入功能
   - 確認可以正常連接後端 API

