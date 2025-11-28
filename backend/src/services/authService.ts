import { PrismaClient, Role } from '@prisma/client'
import { hashPassword, comparePassword } from '../utils/password'
import { generateToken } from '../utils/jwt'

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
