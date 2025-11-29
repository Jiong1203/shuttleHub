import { Request, Response, NextFunction } from 'express'
import { Role } from '@prisma/client'

/**
 * 授權 Middleware
 * 檢查使用者是否具有指定角色
 * @param roles 允許的角色陣列
 */
export const authorize = (roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: '未經授權' })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: '權限不足' })
    }

    next()
  }
}
