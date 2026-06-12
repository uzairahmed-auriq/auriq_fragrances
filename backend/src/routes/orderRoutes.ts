import express from 'express';
import { createOrder, getMyOrders, getOrderById } from '../controllers/orderController';
import { validateDiscount } from '../controllers/discountController';
import { optionalUser, verifyUser } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/validate-discount', optionalUser, validateDiscount);
router.post('/', optionalUser, createOrder);
router.get('/my-orders', verifyUser, getMyOrders);
router.get('/:id', optionalUser, getOrderById);

export default router;
