"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductReviews = exports.addReview = void 0;
const database_1 = __importDefault(require("../config/database"));
// POST /api/reviews
const addReview = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        const { product_id, rating, comment } = req.body;
        if (!product_id || rating === undefined) {
            res.status(400).json({ success: false, message: 'Product ID and rating are required' });
            return;
        }
        if (rating < 1 || rating > 5) {
            res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
            return;
        }
        // Check if product exists
        const product = await database_1.default.product.findUnique({ where: { id: Number(product_id) } });
        if (!product) {
            res.status(404).json({ success: false, message: 'Product not found' });
            return;
        }
        // Upsert the review (creates new or updates existing for the same user+product)
        const review = await database_1.default.review.upsert({
            where: {
                user_id_product_id: {
                    user_id: userId,
                    product_id: Number(product_id)
                }
            },
            update: {
                rating: Number(rating),
                comment: comment || null,
                is_active: false, // Needs re-approval if updated
                updated_at: new Date()
            },
            create: {
                user_id: userId,
                product_id: Number(product_id),
                rating: Number(rating),
                comment: comment || null,
                is_active: false // Needs admin approval by default
            }
        });
        res.status(200).json({
            success: true,
            message: 'Review submitted successfully',
            data: review
        });
    }
    catch (error) {
        console.error('ADD REVIEW ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error while adding review' });
    }
};
exports.addReview = addReview;
// GET /api/reviews/product/:id
const getProductReviews = async (req, res) => {
    try {
        const { id } = req.params;
        const reviews = await database_1.default.review.findMany({
            where: {
                product_id: Number(id),
                is_active: true
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        });
        // Calculate average rating
        const totalReviews = reviews.length;
        const averageRating = totalReviews > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
            : 0;
        res.status(200).json({
            success: true,
            data: {
                reviews,
                totalReviews,
                averageRating: Number(averageRating.toFixed(1))
            }
        });
    }
    catch (error) {
        console.error('GET REVIEWS ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching reviews' });
    }
};
exports.getProductReviews = getProductReviews;
