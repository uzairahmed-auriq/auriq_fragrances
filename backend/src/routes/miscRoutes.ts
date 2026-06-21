import { Router } from 'express'
import { validate, contactSchema } from '../middleware/validate'
import { subscribeNewsletter, submitContact, getPublicSettings, getShippingConfig } from '../controllers/miscController'

const router = Router()

router.post('/newsletter/subscribe', subscribeNewsletter)
router.post('/contact', validate(contactSchema), submitContact)
router.get('/public/settings', getPublicSettings)
router.get('/shipping-config', getShippingConfig)

export default router
