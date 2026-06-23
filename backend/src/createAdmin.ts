import bcrypt from 'bcrypt';
import prisma from './config/database';

async function createAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set in .env before running this script. ' +
      'Do NOT use hardcoded credentials.'
    );
  }

  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin ${email} already exists.`);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  await prisma.admin.create({
    data: {
      first_name: 'Auriq',
      last_name: 'Admin',
      email,
      password: hashedPassword
    }
  });

  // Never log credentials — not even masked versions.
  console.log(`Admin account created for: ${email}`);
}

createAdmin()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
