import { Request, Response, NextFunction } from 'express'

// Prisma error codes that indicate a DB-level issue (not a user-facing message).
const PRISMA_ERROR_CODES = new Set(['P1000','P1001','P1002','P2000','P2001','P2002','P2003','P2004','P2025'])

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status || err.statusCode || 500

  // Sanitize: never leak raw Prisma or internal error messages to clients.
  // Only pass through messages that were explicitly set by our own code.
  const isPrismaError = err.code && PRISMA_ERROR_CODES.has(err.code)
  const isInternalError = status >= 500

  const message =
    isPrismaError || isInternalError
      ? 'Internal server error'
      : (err.message || 'Something went wrong')

  res.status(status).json({ success: false, message })
}
