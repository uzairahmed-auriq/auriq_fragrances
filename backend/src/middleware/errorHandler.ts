import { Request, Response, NextFunction } from 'express'

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status || 500

  // Don't leak internal error details in production
  const isPrismaError = err.code && err.code.startsWith('P')
  const isProduction = process.env.NODE_ENV === 'production'

  let message = err.message || 'Internal Server Error'

  if (isProduction && (status === 500 || isPrismaError)) {
    message = 'Internal Server Error'
  }

  res.status(status).json({ success: false, message })
}
