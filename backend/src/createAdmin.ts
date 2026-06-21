import bcrypt from 'bcrypt';
import prisma from './config/database';

async function createAdmin() {
  const email = 'admin@auriq.com';
  const password = 'password123';
  
  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin ${email} already exists.`);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.admin.create({
    data: {
      first_name: 'Auriq',
      last_name: 'Admin',
      email,
      password: hashedPassword
    }
  });

  console.log(`Admin account created: ${email}`);
}

createAdmin()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
