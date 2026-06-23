import express from 'express';
import { createOrder, getMyOrders, getOrderById } from '../controllers/orderController';
import { validateDiscount } from '../controllers/discountController';
import { cancelOrder } from '../controllers/miscController';
import { optionalUser, verifyUser } from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validateRequest';
import { createOrderSchema } from '../validators/schemas';

const router = express.Router();

router.post('/validate-discount', optionalUser, validateDiscount);
router.post('/', optionalUser, validateRequest(createOrderSchema), createOrder);
router.get('/my-orders', verifyUser, getMyOrders);
router.get('/:id', optionalUser, getOrderById);
router.post('/:id/cancel', verifyUser, cancelOrder);

export default router;