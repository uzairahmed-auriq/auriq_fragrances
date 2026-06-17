"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDiscount = void 0;
const database_1 = __importDefault(require("../config/database"));
const validateDiscount = async (req, res) => {
    try {
        const { code, cartTotal } = req.body;
        const userId = req.user?.id;
        if (!code || cartTotal === undefined) {
            res.status(400).json({ success: false, message: 'Discount code and cart total are required' });
            return;
        }
        const discount = await database_1.default.discountCode.findUnique({
            where: { code: code.toUpperCase() }
        });
        if (!discount) {
            res.status(404).json({ success: false, message: 'Invalid discount code' });
            return;
        }
        if (!discount.is_active) {
            res.status(400).json({ success: false, message: 'Discount code is inactive' });
            return;
        }
        if (discount.expires_at && discount.expires_at < new Date()) {
            res.status(400).json({ success: false, message: 'Discount code has expired' });
            return;
        }
        if (discount.max_uses && discount.used_count >= discount.max_uses) {
            res.status(400).json({ success: false, message: 'Discount code usage limit reached' });
            return;
        }
        if (Number(cartTotal) < Number(discount.min_order)) {
            res.status(400).json({ success: false, message: `Minimum order amount of Rs. ${discount.min_order} required` });
            return;
        }
        // Check if user has already used this code
        if (userId) {
            const existingUse = await database_1.default.discountUse.findUnique({
                where: {
                    discount_code_id_user_id: {
                        discount_code_id: discount.id,
                        user_id: userId
                    }
                }
            });
            if (existingUse) {
                res.status(400).json({ success: false, message: 'You have already used this discount code' });
                return;
            }
        }
        // Calculate discount amount
        let discountAmount = 0;
        if (discount.type === 'PERCENTAGE') {
            discountAmount = (Number(cartTotal) * Number(discount.value)) / 100;
        }
        else if (discount.type === 'FLAT') {
            discountAmount = Number(discount.value);
        }
        // Ensure discount doesn't exceed cart total
        if (discountAmount > Number(cartTotal)) {
            discountAmount = Number(cartTotal);
        }
        res.json({
            success: true,
            data: {
                code: discount.code,
                type: discount.type,
                value: discount.value,
                discountAmount,
                newTotal: Number(cartTotal) - discountAmount
            }
        });
    }
    catch (error) {
        console.error('Error validating discount:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.validateDiscount = validateDiscount;
