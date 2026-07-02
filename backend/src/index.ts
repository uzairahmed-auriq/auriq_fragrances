import rateLimit from 'express-rate-limit'
import helmet from 'helmet'

// Rate limiters
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many attempts, please try again later' },
})

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { success: false, message: 'Too many requests, please slow down' }
})

// Baseline limiter applied to ALL /api traffic (stops scraping/abuse; generous for real browsing)
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please slow down' }
})

// Strict limiter for endpoints that send emails (contact, newsletter) to prevent quota abuse
const strictEmailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many requests. Please try again later.' }
})

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { errorHandler } from './middleware/errorHandler'
import { ENV } from './config/env'
import authRoutes from './routes/authRoutes'
import productRoutes from './routes/productRoutes'
import categoryRoutes from './routes/categoryRoutes'
import adRoutes from './routes/adRoutes'
import adminRoutes from './routes/adminRoutes'
import userRoutes from './routes/userRoutes'
import wishlistRoutes from './routes/wishlistRoutes'
import cartRoutes from './routes/cartRoutes'
import orderRoutes from './routes/orderRoutes'
import reviewRoutes from './routes/reviewRoutes'
import miscRoutes from './routes/miscRoutes'
import storyRoutes from './routes/storyRoutes'

dotenv.config()

const app = express()

// Trust the first proxy (Railway/Render/Vercel/Nginx) so rate limiting and IP logging
// use the real client IP from X-Forwarded-For instead of the proxy's IP.
app.set('trust proxy', 1)

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow images/fonts served from this API
}))
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://auriqfragrances.com',
    'https://www.auriqfragrances.com',
  ],
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Baseline rate limit on all API traffic
app.use('/api', globalLimiter)

// Strict limit on the email-sending public endpoints (before the misc routes handle them)
app.use('/api/contact', strictEmailLimiter)
app.use('/api/newsletter/subscribe', strictEmailLimiter)

// Routes
app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/admin/login', authLimiter) // strict limit only on login
app.use('/api/admin', generalLimiter, adminRoutes)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/ads', adRoutes)
app.use('/api/user', userRoutes)
app.use('/api/wishlist', wishlistRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', generalLimiter, orderRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/story', storyRoutes)
app.use('/api', miscRoutes)

// Health check
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Auriq API is running' })
})

// Global error handler
app.use(errorHandler)

import prisma from './config/database'

app.listen(ENV.PORT, async () => {
  try {
    console.log('Running auto-migrations for session_id...');
    await prisma.$executeRawUnsafe(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS session_id TEXT;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE carts ADD COLUMN IF NOT EXISTS session_id TEXT;`);
    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS carts_session_id_key ON carts(session_id);`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS carts_session_id_idx ON carts(session_id);`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS orders_session_id_idx ON orders(session_id);`);
    await prisma.$executeRawUnsafe(`ALTER TABLE product_images ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE ads ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE gallery_images ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verify_token_expires TIMESTAMP;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS low_stock_alert INTEGER DEFAULT 5;`);
    console.log('Auto-migration complete.');
  } catch (error) {
    console.error('Auto-migration failed:', error);
  }
  console.log(`Server running on port ${ENV.PORT}`)
})
// Keep Neon DB alive by pinging every 4 minutes
setInterval(async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (e) {
    console.log('DB keepalive failed:', e);
  }
}, 2 * 60 * 1000);
