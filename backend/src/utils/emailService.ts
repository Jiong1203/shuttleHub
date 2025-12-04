import nodemailer from 'nodemailer'

// 郵件服務配置
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com'
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587')
const SMTP_USER = process.env.SMTP_USER || ''
const SMTP_PASS = process.env.SMTP_PASS || ''
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

// 創建郵件傳輸器
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465, // true for 465, false for other ports
  auth: SMTP_USER && SMTP_PASS
    ? {
        user: SMTP_USER,
        pass: SMTP_PASS,
      }
    : undefined,
})

/**
 * 發送密碼重設郵件
 * @param email 收件人 Email
 * @param resetToken 重設 Token
 * @param userName 使用者名稱
 */
export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string,
  userName: string,
): Promise<void> => {
  const resetUrl = `${FRONTEND_URL}/reset-password?token=${resetToken}`

  const mailOptions = {
    from: SMTP_USER || 'noreply@shuttlehub.com',
    to: email,
    subject: 'ShuttleHub - 重設密碼',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background-color: #ffffff;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 30px;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #10b981;
              margin: 0;
              font-size: 24px;
            }
            .content {
              margin-bottom: 30px;
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background-color: #10b981;
              color: #ffffff;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 600;
              margin: 20px 0;
            }
            .button:hover {
              background-color: #059669;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              font-size: 14px;
              color: #6b7280;
              text-align: center;
            }
            .warning {
              background-color: #fef3c7;
              border-left: 4px solid #f59e0b;
              padding: 12px;
              margin: 20px 0;
              border-radius: 4px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏸 ShuttleHub</h1>
            </div>
            <div class="content">
              <p>親愛的 ${userName}，</p>
              <p>我們收到您要求重設密碼的請求。請點擊下方按鈕來重設您的密碼：</p>
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">重設密碼</a>
              </div>
              <p>或者複製以下連結到瀏覽器：</p>
              <p style="word-break: break-all; color: #6b7280; font-size: 14px;">${resetUrl}</p>
              <div class="warning">
                <strong>⚠️ 安全提醒：</strong>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  <li>此連結將在 1 小時後過期</li>
                  <li>如果您沒有要求重設密碼，請忽略此郵件</li>
                  <li>請勿將此連結分享給他人</li>
                </ul>
              </div>
            </div>
            <div class="footer">
              <p>此為系統自動發送的郵件，請勿回覆。</p>
              <p>© ${new Date().getFullYear()} ShuttleHub. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
ShuttleHub - 重設密碼

親愛的 ${userName}，

我們收到您要求重設密碼的請求。請使用以下連結來重設您的密碼：

${resetUrl}

此連結將在 1 小時後過期。

如果您沒有要求重設密碼，請忽略此郵件。

此為系統自動發送的郵件，請勿回覆。
© ${new Date().getFullYear()} ShuttleHub. All rights reserved.
    `.trim(),
  }

  // 如果沒有配置 SMTP，在開發環境下只輸出到控制台
  if (!SMTP_USER || !SMTP_PASS) {
    console.log('='.repeat(60))
    console.log('📧 密碼重設郵件（開發模式）')
    console.log('='.repeat(60))
    console.log(`收件人: ${email}`)
    console.log(`重設連結: ${resetUrl}`)
    console.log('='.repeat(60))
    console.log('\n⚠️  注意：未配置 SMTP，郵件未實際發送。')
    console.log('   請在生產環境中配置 SMTP_USER 和 SMTP_PASS 環境變數。\n')
    return
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log(`密碼重設郵件已發送至: ${email}`)
  } catch (error) {
    console.error('發送郵件失敗:', error)
    throw new Error('無法發送郵件，請稍後再試')
  }
}

