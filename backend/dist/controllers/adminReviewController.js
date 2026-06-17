"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReviewStatus = exports.getAllReviews = void 0;
const database_1 = __importDefault(require("../config/database"));
const auditLog_1 = require("../utils/auditLog");
const getAllReviews = async (req, res) => {
    try {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
        const [total, reviews] = await Promise.all([
            database_1.default.review.count(),
            database_1.default.review.findMany({
                include: {
                    product: { select: { name: true } },
                    user: { select: { name: true, email: true } }
                },
                orderBy: { created_at: 'desc' },
                skip: (page - 1) * limit,
                take: limit
            })
        ]);
        res.json({
            success: true,
            data: reviews,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });
    }
    catch (error) {
        console.error('GET ALL REVIEWS ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getAllReviews = getAllReviews;
const updateReviewStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active, is_featured } = req.body;
        const existing = await database_1.default.review.findUnique({ where: { id: parseInt(id) } });
        const review = await database_1.default.review.update({
            where: { id: parseInt(id) },
            data: {
                ...(is_active !== undefined && { is_active }),
                ...(is_featured !== undefined && { is_featured })
            }
        });
        await (0, auditLog_1.logAdminAction)(req.admin.id, 'UPDATE_REVIEW_STATUS', 'Review', review.id, existing, review);
        res.json({ success: true, data: review, message: 'Review updated successfully' });
    }
    catch (error) {
        console.error('UPDATE REVIEW STATUS ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.updateReviewStatus = updateReviewStatus;
