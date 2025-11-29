import { Router } from 'express'
import * as eventController from '../controllers/eventController'
import { authenticate } from '../middleware/auth'
import { authorize } from '../middleware/authorize'
import { Role } from '@prisma/client'

const router = Router()

// 公開路由
router.get('/', eventController.getEvents)
router.get('/:id', eventController.getEvent)

// 受保護路由 (需要登入)
router.post('/', authenticate, authorize([Role.ORGANIZER, Role.ADMIN]), eventController.createEvent)
router.put(
  '/:id',
  authenticate,
  authorize([Role.ORGANIZER, Role.ADMIN]),
  eventController.updateEvent,
)
router.delete(
  '/:id',
  authenticate,
  authorize([Role.ORGANIZER, Role.ADMIN]),
  eventController.deleteEvent,
)

export default router
