"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDiscount = exports.updateDiscount = exports.createDiscount = exports.getAllDiscounts = void 0;
const database_1 = __importDefault(require("../config/database"));
const auditLog_1 = require("../utils/auditLog");
const getAllDiscounts = async (req, res) => {
    try {
        const discounts = await database_1.default.discountCode.findMany({
            orderBy: { created_at: 'desc' }
        });
        res.json({ success: true, data: discounts });
    }
    catch (error) {
        console.error('Error fetching discounts:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.getAllDiscounts = getAllDiscounts;
const createDiscount = async (req, res) => {
    try {
        const { code, type, value, min_order, max_uses, is_active, expires_at } = req.body;
        const existing = await database_1.default.discountCode.findUnique({ where: { code } });
        if (existing) {
            res.status(400).json({ success: false, message: 'Discount code already exists' });
            return;
        }
        const discount = await database_1.default.discountCode.create({
            data: {
                code: code.toUpperCase(),
                type,
                value,
                min_order: min_order || 0,
                max_uses: max_uses || null,
                is_active: is_active ?? true,
                expires_at: expires_at ? new Date(expires_at) : null
            }
        });
        await (0, auditLog_1.logAdminAction)(req.admin.id, 'CREATE_DISCOUNT', 'DiscountCode', discount.id, null, { code: discount.code });
        res.json({ success: true, data: discount });
    }
    catch (error) {
        console.error('Error creating discount:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.createDiscount = createDiscount;
const updateDiscount = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active, max_uses, expires_at } = req.body;
        const discount = await database_1.default.discountCode.update({
            where: { id: parseInt(id) },
            data: {
                is_active,
                max_uses: max_uses === '' ? null : max_uses,
                expires_at: expires_at ? new Date(expires_at) : null
            }
        });
        await (0, auditLog_1.logAdminAction)(req.admin.id, 'UPDATE_DISCOUNT', 'DiscountCode', discount.id, null, discount);
        res.json({ success: true, data: discount });
    }
    catch (error) {
        console.error('Error updating discount:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.updateDiscount = updateDiscount;
const deleteDiscount = async (req, res) => {
    try {
        const { id } = req.params;
        await database_1.default.discountCode.delete({
            where: { id: parseInt(id) }
        });
        await (0, auditLog_1.logAdminAction)(req.admin.id, 'DELETE_DISCOUNT', 'DiscountCode', parseInt(id), null, null);
        res.json({ success: true, message: 'Discount deleted' });
    }
    catch (error) {
        console.error('Error deleting discount:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.deleteDiscount = deleteDiscount;
