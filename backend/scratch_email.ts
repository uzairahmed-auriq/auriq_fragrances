import { sendOTPEmail } from './src/services/emailService';

async function test() {
  console.log("Testing email...");
  await sendOTPEmail("test@example.com", "123456");
  console.log("Done.");
}

test();
