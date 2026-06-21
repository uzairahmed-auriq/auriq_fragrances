import { Router } from 'express'
import { validate, registerSchema, loginSchema } from '../middleware/validate'
import { register, login, logout, refreshAccessToken, googleLogin, facebookLogin } from '../controllers/authController'

const router = Router()

router.post('/register', validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)
router.post('/logout', logout)
router.post('/refresh', refreshAccessToken)
router.post('/google', googleLogin)
router.post('/facebook', facebookLogin)

export default router