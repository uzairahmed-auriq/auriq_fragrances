import { Router } from 'express'
import { subscribeNewsletter, submitContact, getPublicSettings, getShippingConfig } from '../controllers/miscController'

const router = Router()

router.post('/newsletter/subscribe', subscribeNewsletter)
router.post('/contact', submitContact)
router.get('/public/settings', getPublicSettings)
router.get('/shipping-config', getShippingConfig)

export default router
