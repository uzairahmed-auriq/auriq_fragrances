import dotenv from 'dotenv';
dotenv.config();
import prisma from './src/config/database';

async function clearUsers() {
  try {
    const result = await prisma.user.deleteMany({});
    console.log(`Successfully deleted ${result.count} registered users from the database.`);
  } catch (error) {
    console.error('Error deleting users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearUsers();
