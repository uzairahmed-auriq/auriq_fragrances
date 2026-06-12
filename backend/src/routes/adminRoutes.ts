import { Router } from 'express';
import { upload } from '../middleware/uploadMiddleware';
import { adminLogin } from '../controllers/adminAuthController';
import { createProduct, getAllProducts } from '../controllers/adminProductController';
import { createCategory, updateCategory } from '../controllers/adminCategoryController';
import { createAd, getAllAds } from '../controllers/adminAdController';
import { getAllOrders, updateOrderStatus } from '../controllers/adminOrderController';
import { getAllDiscounts, createDiscount, updateDiscount, deleteDiscount } from '../controllers/adminDiscountController';
import { verifyAdmin } from '../middleware/authMiddleware';

const router = Router();

// Auth routes (public)
router.post('/login', adminLogin);

// Protected Admin Routes
router.use(verifyAdmin);

// Products
router.get('/products', getAllProducts);
router.post('/products', upload.array('images', 5), createProduct);

// Categories
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);

// Ads
router.get('/ads', getAllAds);
router.post('/ads', upload.single('image'), createAd);

// Orders
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

// Discounts
router.get('/discounts', getAllDiscounts);
router.post('/discounts', createDiscount);
router.put('/discounts/:id', updateDiscount);
router.delete('/discounts/:id', deleteDiscount);

export default router;
