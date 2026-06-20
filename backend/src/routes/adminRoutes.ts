import { Router } from 'express';
import { upload } from '../middleware/uploadMiddleware';
import { adminLogin } from '../controllers/adminAuthController';
import { createProduct, getAllProducts, updateProduct, deleteProduct, deleteProductImage, bulkDeleteProducts } from '../controllers/adminProductController';
import { createCategory, updateCategory } from '../controllers/adminCategoryController';
import { createAd, getAllAds, deleteAd, toggleAdStatus } from '../controllers/adminAdController';
import { getAllOrders, updateOrderStatus, getDashboardStats } from '../controllers/adminOrderController';
import { getAllDiscounts, createDiscount, updateDiscount, deleteDiscount } from '../controllers/adminDiscountController';
import { verifyAdmin } from '../middleware/authMiddleware';

import { validateRequest } from '../middleware/validateRequest';
import { createProductSchema, updateProductSchema, categorySchema, adSchema } from '../validators/schemas';
import { updateStory } from '../controllers/storyController';


const router = Router();

// Auth routes (public)
router.post('/login', adminLogin);

// Protected Admin Routes
router.use(verifyAdmin);

import { getAnalytics, getNotifications } from '../controllers/adminAnalyticsController';
import { getInventory } from '../controllers/adminInventoryController';
import { getAllReviews, updateReviewStatus } from '../controllers/adminReviewController';
import { getMessages, updateMessageStatus, deleteMessage } from '../controllers/adminMessageController';
import { getSettingsByGroup, updateSettings } from '../controllers/adminSettingsController';
import { getAllTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../controllers/adminTestimonialController';
import { getProfile, updateProfile, updatePassword, logoutOtherDevices } from '../controllers/adminProfileController';
import { getSubscribers, deleteSubscriber, exportSubscribersCSV } from '../controllers/adminNewsletterController';

router.get('/profile', getProfile);
router.put('/profile', upload.single('profile_image'), updateProfile);
router.put('/profile/password', updatePassword);
router.delete('/profile/sessions', logoutOtherDevices);

router.get('/dashboard', getDashboardStats);
router.get('/notifications', getNotifications);
router.get('/analytics', getAnalytics);
router.get('/inventory', getInventory);

// CMS Settings
router.get('/cms/settings', getSettingsByGroup);
router.put('/cms/settings', updateSettings);

// Testimonials
router.get('/testimonials', getAllTestimonials);
router.post('/testimonials', createTestimonial);
router.put('/testimonials/:id', updateTestimonial);
router.delete('/testimonials/:id', deleteTestimonial);

// Reviews
router.get('/reviews', getAllReviews);
router.put('/reviews/:id/status', updateReviewStatus);

// Messages
router.get('/messages', getMessages);
router.put('/messages/:id', updateMessageStatus);
router.delete('/messages/:id', deleteMessage);

// Products
router.get('/products', getAllProducts);
router.post('/products', upload.array('images', 3), validateRequest(createProductSchema), createProduct);
router.put('/products/:id', upload.array('images', 3), validateRequest(updateProductSchema), updateProduct);
router.delete('/products', bulkDeleteProducts);
router.delete('/products/:id', deleteProduct);
router.delete('/products/images/:imageId', deleteProductImage);

// Categories
router.post('/categories', validateRequest(categorySchema), createCategory);
router.put('/categories/:id', validateRequest(categorySchema), updateCategory);

// Ads
router.get('/ads', getAllAds);
router.post('/ads', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'mobile_image', maxCount: 1 }]), validateRequest(adSchema), createAd);
router.delete('/ads/:id', deleteAd);
router.put('/ads/:id/status', toggleAdStatus);

// Orders
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

// Discounts
router.get('/discounts', getAllDiscounts);
router.post('/discounts', createDiscount);
router.put('/discounts/:id', updateDiscount);
router.delete('/discounts/:id', deleteDiscount);

// Newsletters
router.get('/newsletters', getSubscribers);
router.delete('/newsletters/:id', deleteSubscriber);
router.get('/export/subscribers', exportSubscribersCSV);

// Story (CMS)

router.put('/story', upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }]), updateStory);

import { getAdminShippingConfig, updateShippingConfig } from "../controllers/miscController";
router.get("/shipping", getAdminShippingConfig);
router.put("/shipping", updateShippingConfig);

export default router;
