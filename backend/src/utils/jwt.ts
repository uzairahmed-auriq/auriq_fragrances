import jwt from 'jsonwebtoken'
import { ENV } from '../config/env'

export const generateAccessToken = (userId: number) => {
  return jwt.sign({ userId }, ENV.JWT_ACCESS_SECRET, { expiresIn: '7d' })
}

export const generateRefreshToken = (userId: number) => {
  return jwt.sign({ userId }, ENV.JWT_REFRESH_SECRET, { expiresIn: '7d' })
}

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ENV.JWT_ACCESS_SECRET) as { userId: number }
}

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, ENV.JWT_REFRESH_SECRET) as { userId: number }
}

export const generateTempToken = (payload: any) => {
  return jwt.sign(payload, ENV.JWT_ACCESS_SECRET, { expiresIn: '15m' })
}

export const verifyTempToken = (token: string) => {
  return jwt.verify(token, ENV.JWT_ACCESS_SECRET) as any
}