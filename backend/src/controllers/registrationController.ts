import { Request, Response } from 'express'
import * as registrationService from '../services/registrationService'

export const register = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: '未經授權' })
    }

    const eventId = parseInt(req.params.eventId)
    const { participantName, numberOfPeople } = req.body

    const registration = await registrationService.registerForEvent(
      eventId,
      req.user.userId,
      participantName,
      numberOfPeople || 1,
    )

    res.status(201).json({ success: true, data: registration })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '報名失敗'
    res.status(400).json({ success: false, message })
  }
}

export const cancel = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: '未經授權' })
    }

    const id = parseInt(req.params.id)
    await registrationService.cancelRegistration(id, req.user.userId, req.user.role)

    res.json({ success: true, message: '報名已取消' })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '取消報名失敗'
    res.status(400).json({ success: false, message })
  }
}

export const getMyRegistrations = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: '未經授權' })
    }

    const registrations = await registrationService.getUserRegistrations(req.user.userId)
    res.json({ success: true, data: registrations })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '取得報名紀錄失敗'
    res.status(500).json({ success: false, message })
  }
}
