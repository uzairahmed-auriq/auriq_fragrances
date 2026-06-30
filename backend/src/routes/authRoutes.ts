import { Router } from 'express'
import { validate, registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../middleware/validate'
import { register, login, logout, refreshAccessToken, googleLogin, facebookLogin, verifyEmail, completeOAuth, forgotPassword, resetPassword } from '../controllers/authController'

const router = Router()

router.post('/register', validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)
router.post('/logout', logout)
router.post('/refresh', refreshAccessToken)
router.post('/google', googleLogin)
router.post('/facebook', facebookLogin)
router.post('/verify-email', verifyEmail)
router.post('/complete-oauth', completeOAuth)
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword)
router.post('/reset-password', validate(resetPasswordSchema), resetPassword)

export default router