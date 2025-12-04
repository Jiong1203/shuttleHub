import { Request, Response } from 'express'
import * as authService from '../services/authService'

export const register = async (req: Request, res: Response) => {
  try {
    const { user, token } = await authService.registerUser(req.body)
    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        token,
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '註冊失敗'
    res.status(400).json({
      success: false,
      message,
    })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { user, token } = await authService.loginUser(req.body)
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        token,
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '登入失敗'
    res.status(401).json({
      success: false,
      message,
    })
  }
}

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const result = await authService.forgotPassword(req.body)
    res.status(200).json({
      success: true,
      message: result.message,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '處理失敗'
    res.status(400).json({
      success: false,
      message,
    })
  }
}

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const result = await authService.resetPassword(req.body)
    res.status(200).json({
      success: true,
      message: result.message,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '重設密碼失敗'
    res.status(400).json({
      success: false,
      message,
    })
  }
}
