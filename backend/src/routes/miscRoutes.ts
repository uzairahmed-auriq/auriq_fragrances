import { Router } from 'express'
import { subscribeNewsletter, submitContact } from '../controllers/miscController'

const router = Router()

router.post('/newsletter/subscribe', subscribeNewsletter)
router.post('/contact', submitContact)

export default router