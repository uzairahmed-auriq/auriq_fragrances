import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.systemSetting.upsert({
    where: { key: 'PROMO1_IMAGE' },
    update: { value: '/promotional_card_1.png' },
    create: { key: 'PROMO1_IMAGE', value: '/promotional_card_1.png', group: 'HOMEPAGE' }
  });

  await prisma.systemSetting.upsert({
    where: { key: 'PROMO2_IMAGE' },
    update: { value: '/promotional_card_2.png' },
    create: { key: 'PROMO2_IMAGE', value: '/promotional_card_2.png', group: 'HOMEPAGE' }
  });

  console.log('Successfully updated promo images in database.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
