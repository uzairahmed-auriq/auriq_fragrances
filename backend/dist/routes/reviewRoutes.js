"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reviewController_1 = require("../controllers/reviewController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// POST /api/reviews
// Protected route: Only authenticated users can leave a review
router.post('/', authMiddleware_1.verifyUser, reviewController_1.addReview);
// GET /api/reviews/product/:id
// Public route: Anyone can see the reviews for a product
router.get('/product/:id', reviewController_1.getProductReviews);
exports.default = router;
