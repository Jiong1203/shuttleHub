import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth'
import eventRoutes from './routes/events'
import registrationRoutes from './routes/registrations'

// 載入環境變數
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  }),
)
app.use(express.json())

// 路由
app.use('/api/auth', authRoutes)
app.use('/api/events', eventRoutes)
app.use('/api', registrationRoutes) // 報名路由通常掛在 /api 下，例如 /api/events/:id/register

// 健康檢查端點
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// 啟動伺服器
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
}

export default app
