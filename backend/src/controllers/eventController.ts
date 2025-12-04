import { Request, Response } from 'express'
import * as eventService from '../services/eventService'

export const getEvents = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10

    const result = await eventService.getAllEvents(page, limit)
    res.json({ success: true, data: result })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '取得活動列表失敗'
    res.status(500).json({ success: false, message })
  }
}

export const getEvent = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const event = await eventService.getEventById(id)
    res.json({ success: true, data: event })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '取得活動詳情失敗'
    res.status(404).json({ success: false, message })
  }
}

export const createEvent = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: '未經授權' })
    }

    const event = await eventService.createEvent(req.body, req.user.userId)
    res.status(201).json({ success: true, data: event })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '建立活動失敗'
    console.error('Create Event Error:', error)
    res.status(400).json({ success: false, message })
  }
}

export const updateEvent = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: '未經授權' })
    }

    const id = req.params.id
    const event = await eventService.updateEvent(id, req.body, req.user.userId, req.user.role)
    res.json({ success: true, data: event })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '更新活動失敗'
    res.status(400).json({ success: false, message })
  }
}

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: '未經授權' })
    }

    const id = req.params.id
    await eventService.deleteEvent(id, req.user.userId, req.user.role)
    res.json({ success: true, message: '活動已刪除' })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '刪除活動失敗'
    res.status(400).json({ success: false, message })
  }
}
