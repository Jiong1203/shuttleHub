import { Router } from 'express'
import * as registrationController from '../controllers/registrationController'
import { authenticate } from '../middleware/auth'

const router = Router()

// 所有報名相關路由都需要登入
router.use(authenticate)

router.post('/events/:eventId/register', registrationController.register)
router.delete('/registrations/:id', registrationController.cancel)
router.get('/registrations/me', registrationController.getMyRegistrations)

export default router
