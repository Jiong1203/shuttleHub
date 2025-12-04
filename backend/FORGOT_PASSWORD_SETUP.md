# 忘記密碼功能設定指南

## 📋 功能概述

已實作完整的「忘記密碼」功能，包含以下流程：

1. **忘記密碼請求**：用戶輸入 Email，系統發送重設連結
2. **重設密碼**：用戶點擊郵件中的連結，輸入新密碼

## 🔧 環境變數設定

### 必需環境變數

在 `backend/.env` 文件中添加以下環境變數：

```env
# 郵件服務設定（SMTP）
SMTP_HOST=smtp.gmail.com          # SMTP 伺服器地址
SMTP_PORT=587                     # SMTP 端口（587 為 TLS，465 為 SSL）
SMTP_USER=your-email@gmail.com    # 發送郵件的 Email 帳號
SMTP_PASS=your-app-password       # Email 帳號的應用程式密碼

# 前端 URL（用於生成重設連結）
FRONTEND_URL=http://localhost:5173  # 開發環境
# FRONTEND_URL=https://your-domain.com  # 生產環境
```

### Gmail 設定範例

如果使用 Gmail：

1. 啟用「兩步驟驗證」
2. 前往 [Google 帳戶設定](https://myaccount.google.com/apppasswords)
3. 生成「應用程式密碼」
4. 將生成的密碼填入 `SMTP_PASS`

### 其他郵件服務商設定

#### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
```

#### SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

#### 自架 SMTP 伺服器
根據您的 SMTP 伺服器設定調整 `SMTP_HOST` 和 `SMTP_PORT`

## 📦 資料庫遷移

執行以下命令來應用資料庫遷移：

```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

這將創建 `PasswordResetToken` 表來儲存重設 Token。

## 🚀 API 端點

### 1. 忘記密碼請求

**端點**：`POST /api/auth/forgot-password`

**請求體**：
```json
{
  "email": "user@example.com"
}
```

**回應**：
```json
{
  "success": true,
  "message": "如果該 Email 已註冊，我們將發送重設密碼連結"
}
```

### 2. 重設密碼

**端點**：`POST /api/auth/reset-password`

**請求體**：
```json
{
  "token": "reset-token-from-email",
  "newPassword": "newpassword123"
}
```

**回應**：
```json
{
  "success": true,
  "message": "密碼重設成功"
}
```

## 🎨 前端路由

新增的前端路由：

- `/forgot-password` - 忘記密碼頁面
- `/reset-password?token=xxx` - 重設密碼頁面

## 🔒 安全特性

1. **Token 過期時間**：重設連結在 1 小時後過期
2. **一次性使用**：每個 Token 只能使用一次
3. **自動清理**：舊的未使用 Token 會被自動刪除
4. **隱私保護**：即使 Email 不存在，也回傳成功訊息（避免 Email 探測）

## 🧪 開發模式

如果未配置 SMTP 環境變數，系統會在控制台輸出重設連結，方便開發測試：

```
============================================================
📧 密碼重設郵件（開發模式）
============================================================
收件人: user@example.com
重設連結: http://localhost:5173/reset-password?token=xxx
============================================================
```

## 📝 使用流程

1. 用戶在登入頁面點擊「忘記密碼？」
2. 輸入 Email 並提交
3. 系統發送包含重設連結的郵件
4. 用戶點擊郵件中的連結
5. 輸入新密碼並確認
6. 密碼重設成功，自動跳轉到登入頁面

## ⚠️ 注意事項

1. **生產環境**：務必配置有效的 SMTP 設定
2. **Token 安全**：Token 使用加密隨機字串生成
3. **密碼強度**：新密碼至少需要 6 個字元
4. **郵件送達**：請檢查垃圾郵件資料夾

## 🐛 故障排除

### 郵件無法發送

1. 檢查 SMTP 設定是否正確
2. 確認防火牆允許 SMTP 連接
3. 檢查 Email 帳號的應用程式密碼是否正確
4. 查看後端控制台的錯誤訊息

### Token 無效

1. 確認 Token 未過期（1 小時內）
2. 確認 Token 未被使用過
3. 檢查資料庫中的 Token 記錄

### 資料庫錯誤

1. 確認已執行資料庫遷移
2. 檢查 Prisma Client 是否已生成
3. 確認資料庫連接正常

