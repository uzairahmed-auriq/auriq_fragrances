import { Request, Response, NextFunction } from 'express'
import { z, ZodSchema } from 'zod'

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      const errors = result.error.errors.map(e => e.message).join(', ')
      res.status(400).json({ success: false, message: errors })
      return
    }
    req.body = result.data
    next()
  }
}

// Auth schemas
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().regex(/^\+92\d{10}$/, 'Phone must start with +92 followed by 10 digits')
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
})

export const adminLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
})

// Order schema
export const createOrderSchema = z.object({
  shippingAddress: z.object({
    name: z.string().min(1, 'Name is required'),
    phone: z.string().min(1, 'Phone is required'),
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    province: z.string().min(1, 'Province is required'),
    postal_code: z.string().min(1, 'Postal code is required')
  }),
  paymentMethod: z.enum(['COD', 'CARD']),
  guestInfo: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1)
  }).optional(),
  notes: z.string().optional(),
  discountCode: z.string().optional()
})

// Contact schema
export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(1, 'Message is required')
})
