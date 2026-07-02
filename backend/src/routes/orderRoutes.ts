import express from 'express';
import { createOrder, getMyOrders, getOrderById } from '../controllers/orderController';
import { validateDiscount } from '../controllers/discountController';
import { cancelOrder } from '../controllers/miscController';
import { optionalUser, verifyUser } from '../middleware/authMiddleware';
import { validate, createOrderSchema } from '../middleware/validate';

const router = express.Router();

router.post('/validate-discount', optionalUser, validateDiscount);
router.post('/', optionalUser, validate(createOrderSchema), createOrder);
router.get('/my-orders', verifyUser, getMyOrders);
router.get('/:id', optionalUser, getOrderById);
router.post('/:id/cancel', verifyUser, cancelOrder);

export default router;