import express from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart } from '../controllers/cartController';
import { optionalUser } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', optionalUser, getCart);
router.post('/', optionalUser, addToCart);
router.put('/:itemId', optionalUser, updateCartItem);
router.delete('/:itemId', optionalUser, removeFromCart);

export default router;
