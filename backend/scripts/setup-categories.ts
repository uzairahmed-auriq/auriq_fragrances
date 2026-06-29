import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function main() {
  console.log('Setting up essential structural data only (No sample products)...')

  // Categories (Required to add products)
  await prisma.category.upsert({ where: { slug: 'men' }, update: {}, create: { name: 'Men', slug: 'men', is_active: true } })
  await prisma.category.upsert({ where: { slug: 'women' }, update: {}, create: { name: 'Women', slug: 'women', is_active: true } })
  await prisma.category.upsert({ where: { slug: 'unisex' }, update: {}, create: { name: 'Unisex', slug: 'unisex', is_active: true } })
  await prisma.category.upsert({ where: { slug: 'bundles' }, update: {}, create: { name: 'Bundles', slug: 'bundles', is_active: true } })
  await prisma.category.upsert({ where: { slug: 'gift-sets' }, update: {}, create: { name: 'Gift Sets', slug: 'gift-sets', is_active: true } })

  console.log('✅ Base Categories created')

  // Shipping config (Required for checkout to work)
  const existingConfig = await prisma.shippingConfig.findFirst()
  if (!existingConfig) {
    await prisma.shippingConfig.create({
      data: {
        flat_fee: 200,
        free_shipping_above: 5000
      }
    })
    console.log('✅ Base Shipping config created')
  }

  console.log('🎉 Essential setup complete. Your product catalog is completely empty!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
