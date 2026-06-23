import { Router } from 'express'
import { validateRequest } from '../middleware/validateRequest'
import { registerSchema, loginSchema } from '../validators/schemas'
import { register, login, logout, refreshAccessToken, googleLogin, facebookLogin } from '../controllers/authController'

const router = Router()

router.post('/register', validateRequest(registerSchema), register)
router.post('/login', validateRequest(loginSchema), login)
router.post('/logout', logout)
router.post('/refresh', refreshAccessToken)
router.post('/google', googleLogin)
router.post('/facebook', facebookLogin)

export default router