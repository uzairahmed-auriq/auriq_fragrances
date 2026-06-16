import { Router } from 'express'
import { subscribeNewsletter, submitContact, getPublicSettings } from '../controllers/miscController'

const router = Router()

router.post('/newsletter/subscribe', subscribeNewsletter)
router.post('/contact', submitContact)
router.get('/public/settings', getPublicSettings)

export default router