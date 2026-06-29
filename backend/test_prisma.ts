import dotenv from 'dotenv';
dotenv.config();
import prisma from './src/config/database';
import bcrypt from 'bcrypt';

async function test() {
  try {
    const existing = await prisma.user.findUnique({ where: { email: 'test_create@example.com' } });
    if (existing) {
       await prisma.user.delete({ where: { email: 'test_create@example.com' } });
    }
    
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await prisma.user.create({
      data: { 
        name: 'Test Create', 
        email: 'test_create@example.com', 
        password: hashedPassword, 
        phone: '+923001234567', 
        is_email_verified: false, 
        email_verify_token: '123456' 
      }
    });
    console.log("Success:", user.id);
  } catch (e) {
    console.error("Error creating user:", e);
  }
}
test();
