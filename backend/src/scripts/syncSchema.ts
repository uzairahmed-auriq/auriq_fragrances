import prisma from '../config/database'

/**
 * Idempotent schema patches that were historically applied at server boot.
 * All statements use IF NOT EXISTS, so this is safe to run multiple times.
 *
 * These should eventually be folded into a proper Prisma migration. Until then,
 * run this ONCE per deploy (npm run db:sync) instead of on every server boot,
 * so it can't race across multiple instances.
 */
export const runSchemaSync = async () => {
  await prisma.$executeRawUnsafe(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS session_id TEXT;`)
  await prisma.$executeRawUnsafe(`ALTER TABLE carts ADD COLUMN IF NOT EXISTS session_id TEXT;`)
  await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS carts_session_id_key ON carts(session_id);`)
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS carts_session_id_idx ON carts(session_id);`)
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS orders_session_id_idx ON orders(session_id);`)
  await prisma.$executeRawUnsafe(`ALTER TABLE product_images ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;`)
  await prisma.$executeRawUnsafe(`ALTER TABLE ads ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;`)
  await prisma.$executeRawUnsafe(`ALTER TABLE gallery_images ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;`)
  await prisma.$executeRawUnsafe(`ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verify_token_expires TIMESTAMP;`)
  await prisma.$executeRawUnsafe(`ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;`)
  await prisma.$executeRawUnsafe(`ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS low_stock_alert INTEGER DEFAULT 5;`)
}

// Allow running directly as a one-off script: `npm run db:sync`
if (require.main === module) {
  runSchemaSync()
    .then(() => {
      console.log('Schema sync complete.')
      process.exit(0)
    })
    .catch((err) => {
      console.error('Schema sync failed:', err)
      process.exit(1)
    })
}
