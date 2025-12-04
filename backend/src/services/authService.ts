import { PrismaClient, Role } from '@prisma/client'
import { hashPassword, comparePassword } from '../utils/password'
import { generateToken } from '../utils/jwt'
import { sendPasswordResetEmail } from '../utils/emailService'
import crypto from 'crypto'

// 由於尚未生成 Prisma Client，這裡先定義一個模擬的 Prisma Client
// 實際開發時應使用 import { PrismaClient } from '@prisma/client';
// 並確保 npx prisma generate 已執行
const prisma = new PrismaClient()

interface RegisterData {
  email: string
  password: string
  name: string
  role?: Role
}

export const registerUser = async (userData: RegisterData) => {
  const { email, password, name, role } = userData

  // 檢查 Email 是否已存在
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    throw new Error('Email 已被註冊')
  }

  // 密碼加密
  const hashedPassword = await hashPassword(password)

  // 建立使用者
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: role || Role.MEMBER,
    },
  })

  // 生成 Token
  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  })

  return { user, token }
}

interface LoginData {
  email: string
  password: string
}

export const loginUser = async (loginData: LoginData) => {
  const { email, password } = loginData

  // 尋找使用者
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    throw new Error('Email 或密碼錯誤')
  }

  // 驗證密碼
  const isPasswordValid = await comparePassword(password, user.password)

  if (!isPasswordValid) {
    throw new Error('Email 或密碼錯誤')
  }

  // 生成 Token
  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  })

  return { user, token }
}

interface ForgotPasswordData {
  email: string
}

/**
 * 處理忘記密碼請求
 * 生成重設 Token 並發送郵件
 */
export const forgotPassword = async (data: ForgotPasswordData) => {
  const { email } = data

  // 尋找使用者
  const user = await prisma.user.findUnique({
    where: { email },
  })

  // 為了安全，即使使用者不存在也回傳成功訊息
  // 避免被用來探測哪些 Email 已註冊
  if (!user) {
    return { success: true, message: '如果該 Email 已註冊，我們將發送重設密碼連結' }
  }

  // 生成隨機 Token
  const resetToken = crypto.randomBytes(32).toString('hex')

  // 設定過期時間（1 小時後）
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + 1)

  // 刪除該使用者所有未使用的舊 Token
  await prisma.passwordResetToken.deleteMany({
    where: {
      userId: user.id,
      used: false,
    },
  })

  // 儲存重設 Token
  await prisma.passwordResetToken.create({
    data: {
      token: resetToken,
      userId: user.id,
      expiresAt,
    },
  })

  // 發送郵件
  try {
    await sendPasswordResetEmail(email, resetToken, user.name)
  } catch (error) {
    console.error('發送郵件失敗:', error)
    // 即使發送失敗，也回傳成功（避免洩露資訊）
  }

  return { success: true, message: '如果該 Email 已註冊，我們將發送重設密碼連結' }
}

interface ResetPasswordData {
  token: string
  newPassword: string
}

/**
 * 重設密碼
 * 驗證 Token 並更新密碼
 */
export const resetPassword = async (data: ResetPasswordData) => {
  const { token, newPassword } = data

  // 驗證密碼長度
  if (newPassword.length < 6) {
    throw new Error('密碼長度至少需要 6 個字元')
  }

  // 尋找有效的重設 Token
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  })

  if (!resetToken) {
    throw new Error('無效的重設連結')
  }

  // 檢查 Token 是否已使用
  if (resetToken.used) {
    throw new Error('此重設連結已被使用，請重新申請')
  }

  // 檢查 Token 是否過期
  if (resetToken.expiresAt < new Date()) {
    throw new Error('重設連結已過期，請重新申請')
  }

  // 加密新密碼
  const hashedPassword = await hashPassword(newPassword)

  // 更新使用者密碼
  await prisma.user.update({
    where: { id: resetToken.userId },
    data: { password: hashedPassword },
  })

  // 標記 Token 為已使用
  await prisma.passwordResetToken.update({
    where: { id: resetToken.id },
    data: { used: true },
  })

  // 刪除該使用者所有其他未使用的 Token（安全考量）
  await prisma.passwordResetToken.deleteMany({
    where: {
      userId: resetToken.userId,
      used: false,
      id: { not: resetToken.id },
    },
  })

  return { success: true, message: '密碼重設成功' }
}
