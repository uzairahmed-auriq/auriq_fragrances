import dotenv from 'dotenv'
dotenv.config()

export const ENV = {
  PORT: process.env.PORT || 5000,
  DATABASE_URL: process.env.DATABASE_URL!,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME!,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY!,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET!,
  REVALIDATION_SECRET: process.env.REVALIDATION_SECRET!,
  RESEND_API_KEY: process.env.RESEND_API_KEY!,
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
}