import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

async function test() {
  const token = jwt.sign({ id: 1 }, process.env.JWT_ACCESS_SECRET || '5f8a9b2c3d4e5f6a7b8c9d0e1f2a3b4c');
  try {
    const res = await axios.get('http://localhost:5000/api/orders/my-orders', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("SUCCESS:", res.data);
  } catch (error: any) {
    console.error("FAILED:", error.response?.data || error.message);
  }
}
test();
