import rateLimit from 'express-rate-limit'

// Rate limiters
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // 20 login attempts per 15 min
  message: { success: false, message: 'Too many attempts, please try again later' },
  skip: (req) => req.path !== '/login' // only limit login endpoints
})

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500, // generous limit for admin panel
  message: { success: false, message: 'Too many requests, please slow down' }
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

// Middleware
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

// Routes
app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/admin', authLimiter, adminRoutes)
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
}, 4 * 60 * 1000);
