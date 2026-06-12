require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  try {
    const data = await prisma.discountCode.findMany();
    console.log("Success:", data);
  } catch (e) {
    console.error("Error:", e.message);
  }
}
main();
