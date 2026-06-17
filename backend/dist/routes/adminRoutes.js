"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uploadMiddleware_1 = require("../middleware/uploadMiddleware");
const adminAuthController_1 = require("../controllers/adminAuthController");
const adminProductController_1 = require("../controllers/adminProductController");
const adminCategoryController_1 = require("../controllers/adminCategoryController");
const adminAdController_1 = require("../controllers/adminAdController");
const adminOrderController_1 = require("../controllers/adminOrderController");
const adminDiscountController_1 = require("../controllers/adminDiscountController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validateRequest_1 = require("../middleware/validateRequest");
const schemas_1 = require("../validators/schemas");
const storyController_1 = require("../controllers/storyController");
const router = (0, express_1.Router)();
// Auth routes (public)
router.post('/login', adminAuthController_1.adminLogin);
// Protected Admin Routes
router.use(authMiddleware_1.verifyAdmin);
const adminAnalyticsController_1 = require("../controllers/adminAnalyticsController");
const adminInventoryController_1 = require("../controllers/adminInventoryController");
const adminReviewController_1 = require("../controllers/adminReviewController");
const adminMessageController_1 = require("../controllers/adminMessageController");
const adminSettingsController_1 = require("../controllers/adminSettingsController");
const adminTestimonialController_1 = require("../controllers/adminTestimonialController");
const adminProfileController_1 = require("../controllers/adminProfileController");
const adminNewsletterController_1 = require("../controllers/adminNewsletterController");
router.get('/profile', adminProfileController_1.getProfile);
router.put('/profile', uploadMiddleware_1.upload.single('profile_image'), adminProfileController_1.updateProfile);
router.put('/profile/password', adminProfileController_1.updatePassword);
router.delete('/profile/sessions', adminProfileController_1.logoutOtherDevices);
router.get('/dashboard', adminOrderController_1.getDashboardStats);
router.get('/analytics', adminAnalyticsController_1.getAnalytics);
router.get('/inventory', adminInventoryController_1.getInventory);
// CMS Settings
router.get('/cms/settings', adminSettingsController_1.getSettingsByGroup);
router.put('/cms/settings', adminSettingsController_1.updateSettings);
// Testimonials
router.get('/testimonials', adminTestimonialController_1.getAllTestimonials);
router.post('/testimonials', adminTestimonialController_1.createTestimonial);
router.put('/testimonials/:id', adminTestimonialController_1.updateTestimonial);
router.delete('/testimonials/:id', adminTestimonialController_1.deleteTestimonial);
// Reviews
router.get('/reviews', adminReviewController_1.getAllReviews);
router.put('/reviews/:id/status', adminReviewController_1.updateReviewStatus);
// Messages
router.get('/messages', adminMessageController_1.getMessages);
router.put('/messages/:id', adminMessageController_1.updateMessageStatus);
router.delete('/messages/:id', adminMessageController_1.deleteMessage);
// Products
router.get('/products', adminProductController_1.getAllProducts);
router.post('/products', uploadMiddleware_1.upload.array('images', 3), (0, validateRequest_1.validateRequest)(schemas_1.createProductSchema), adminProductController_1.createProduct);
router.put('/products/:id', uploadMiddleware_1.upload.array('images', 3), (0, validateRequest_1.validateRequest)(schemas_1.updateProductSchema), adminProductController_1.updateProduct);
router.delete('/products', adminProductController_1.bulkDeleteProducts);
router.delete('/products/:id', adminProductController_1.deleteProduct);
router.delete('/products/images/:imageId', adminProductController_1.deleteProductImage);
// Categories
router.post('/categories', (0, validateRequest_1.validateRequest)(schemas_1.categorySchema), adminCategoryController_1.createCategory);
router.put('/categories/:id', (0, validateRequest_1.validateRequest)(schemas_1.categorySchema), adminCategoryController_1.updateCategory);
// Ads
router.get('/ads', adminAdController_1.getAllAds);
router.post('/ads', uploadMiddleware_1.upload.fields([{ name: 'image', maxCount: 1 }, { name: 'mobile_image', maxCount: 1 }]), (0, validateRequest_1.validateRequest)(schemas_1.adSchema), adminAdController_1.createAd);
router.delete('/ads/:id', adminAdController_1.deleteAd);
router.put('/ads/:id/status', adminAdController_1.toggleAdStatus);
// Orders
router.get('/orders', adminOrderController_1.getAllOrders);
router.put('/orders/:id/status', adminOrderController_1.updateOrderStatus);
// Discounts
router.get('/discounts', adminDiscountController_1.getAllDiscounts);
router.post('/discounts', adminDiscountController_1.createDiscount);
router.put('/discounts/:id', adminDiscountController_1.updateDiscount);
router.delete('/discounts/:id', adminDiscountController_1.deleteDiscount);
// Newsletters
router.get('/newsletters', adminNewsletterController_1.getSubscribers);
router.delete('/newsletters/:id', adminNewsletterController_1.deleteSubscriber);
router.get('/export/subscribers', adminNewsletterController_1.exportSubscribersCSV);
// Story (CMS)
router.put('/story', uploadMiddleware_1.upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }]), storyController_1.updateStory);
exports.default = router;
