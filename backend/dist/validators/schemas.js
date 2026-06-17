"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adSchema = exports.categorySchema = exports.updateProductSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
// Product Validation
exports.createProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Product name must be at least 2 characters"),
    brand: zod_1.z.string().min(1, "Brand is required"),
    description: zod_1.z.string().optional(),
    category_id: zod_1.z.string().transform((val) => parseInt(val, 10)).refine((val) => !isNaN(val), "Category ID must be a number"),
    is_active: zod_1.z.enum(['true', 'false']).optional(),
    is_featured: zod_1.z.enum(['true', 'false']).optional(),
    is_best_seller: zod_1.z.enum(['true', 'false']).optional(),
    variants_json: zod_1.z.string().optional() // Can be further validated as JSON if needed
});
exports.updateProductSchema = exports.createProductSchema.extend({
    is_new_arrival: zod_1.z.enum(['true', 'false']).optional(),
    fragrance_type: zod_1.z.string().optional(),
    gender: zod_1.z.enum(['MALE', 'FEMALE', 'UNISEX']).optional(),
}).partial();
// Category Validation
exports.categorySchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Category name must be at least 2 characters"),
    meta_title: zod_1.z.string().optional(),
    meta_desc: zod_1.z.string().optional(),
    is_active: zod_1.z.boolean().optional(),
});
// Ad Validation
exports.adSchema = zod_1.z.object({
    title: zod_1.z.string().min(2, "Title is required"),
    link_url: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    position: zod_1.z.enum(['HERO', 'ANNOUNCEMENT_BAR']),
    is_active: zod_1.z.enum(['true', 'false']).optional(),
    button_text: zod_1.z.string().optional(),
    sort_order: zod_1.z.string().optional(),
    starts_at: zod_1.z.string().optional(),
    ends_at: zod_1.z.string().optional(),
});
