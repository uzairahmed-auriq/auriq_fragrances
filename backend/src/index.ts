import rateLimit from 'express-rate-limit'
import helmet from 'helmet'

// Rate limiters
// NOTE: these use the default in-memory store, which is correct for a single backend
// instance. If you ever scale horizontally (2+ instances behind a load balancer),
// switch to a shared store (e.g. rate-limit-redis) so counts are enforced globally.
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
// Allowed origins: the known production domains plus whatever FRONTEND_URL is set to
// (so a changed domain or preview URL works without a code change).
const allowedOrigins = [
  'http://localhost:3000',
  'https://auriqfragrances.com',
  'https://www.auriqfragrances.com',
  ENV.FRONTEND_URL,
].filter(Boolean)

app.use(cors({
  origin: allowedOrigins,
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
import { runSchemaSync } from './scripts/syncSchema'

app.listen(ENV.PORT, async () => {
  // In development, keep the schema patches automatic for convenience.
  // In production, run `npm run db:sync` ONCE at deploy instead — this avoids
  // running DDL on every boot and prevents races when multiple instances start.
  if (process.env.NODE_ENV !== 'production') {
    try {
      console.log('Running schema sync (dev)...');
      await runSchemaSync();
      console.log('Schema sync complete.');
    } catch (error) {
      console.error('Schema sync failed:', error);
    }
  }
  console.log(`Server running on port ${ENV.PORT}`)
})
// Keep Neon DB alive by pinging every 2 minutes (Neon free tier suspends after ~5 min idle).
// Harmless to leave on once you upgrade Neon / disable auto-suspend.
setInterval(async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (e) {
    console.log('DB keepalive failed:', e);
  }
}, 2 * 60 * 1000);
