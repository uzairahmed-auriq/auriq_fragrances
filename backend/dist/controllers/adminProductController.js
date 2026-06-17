"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductImage = exports.bulkDeleteProducts = exports.deleteProduct = exports.updateProduct = exports.getAllProducts = exports.createProduct = void 0;
const database_1 = __importDefault(require("../config/database"));
const cloudinary_1 = require("../utils/cloudinary");
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../config/env");
const auditLog_1 = require("../utils/auditLog");
const revalidateFrontend = async (tag) => {
    try {
        // Attempt to revalidate frontend cache
        await axios_1.default.post(`${env_1.ENV.FRONTEND_URL}/api/revalidate`, {
            tag,
            secret: env_1.ENV.REVALIDATION_SECRET
        });
    }
    catch (error) {
        console.error('Failed to revalidate frontend cache:', error);
    }
};
const createProduct = async (req, res) => {
    try {
        const { name, brand, description, category_id, is_active, is_featured, is_best_seller, variants_json } = req.body;
        const files = req.files;
        let uploadedImages = [];
        if (files && files.length > 0) {
            const uploadPromises = files.map(file => (0, cloudinary_1.uploadToCloudinary)(file.buffer, 'auriq_products'));
            const results = await Promise.all(uploadPromises);
            uploadedImages = results.map(res => res.secure_url);
        }
        const product = await database_1.default.product.create({
            data: {
                name,
                slug: name.toLowerCase().replace(/ /g, '-'),
                brand,
                description,
                category_id: parseInt(category_id),
                is_active: is_active === 'true',
                is_featured: is_featured === 'true',
                is_best_seller: is_best_seller === 'true',
                images: {
                    create: uploadedImages.map((url, index) => ({
                        image_url: url,
                        sort_order: index
                    }))
                }
            }
        });
        if (variants_json) {
            const variants = JSON.parse(variants_json);
            for (const v of variants) {
                await database_1.default.productVariant.create({
                    data: {
                        product_id: product.id,
                        size_ml: v.size_ml,
                        price: v.price,
                        stock_quantity: v.stock_quantity,
                        sku: v.sku
                    }
                });
            }
        }
        await revalidateFrontend('products');
        await (0, auditLog_1.logAdminAction)(req.admin.id, 'CREATE_PRODUCT', 'Product', product.id, null, { name: product.name });
        res.json({ success: true, data: product });
    }
    catch (error) {
        console.error('CREATE PRODUCT ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.createProduct = createProduct;
const getAllProducts = async (req, res) => {
    try {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
        const [total, products] = await Promise.all([
            database_1.default.product.count({ where: { is_active: true } }),
            database_1.default.product.findMany({
                where: { is_active: true },
                include: {
                    category: true,
                    variants: true,
                    images: true,
                },
                skip: (page - 1) * limit,
                take: limit,
            })
        ]);
        res.json({
            success: true,
            data: products,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });
    }
    catch (error) {
        console.error('ADMIN GET PRODUCTS ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getAllProducts = getAllProducts;
const updateProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, brand, description, category_id, is_active, is_featured, is_best_seller, is_new_arrival, fragrance_type, gender, variants_json } = req.body;
        const files = req.files;
        // Check product exists
        const existing = await database_1.default.product.findUnique({
            where: { id: parseInt(id) }
        });
        if (!existing) {
            res.status(404).json({ success: false, message: 'Product not found' });
            return;
        }
        // Upload new images if provided
        let uploadedImages = [];
        if (files && files.length > 0) {
            const uploadPromises = files.map(file => (0, cloudinary_1.uploadToCloudinary)(file.buffer, 'auriq_products'));
            const results = await Promise.all(uploadPromises);
            uploadedImages = results.map(res => res.secure_url);
        }
        // Update product
        const product = await database_1.default.product.update({
            where: { id: parseInt(id) },
            data: {
                ...(name && { name, slug: name.toLowerCase().replace(/ /g, '-') }),
                ...(brand && { brand }),
                ...(description && { description }),
                ...(category_id && { category_id: parseInt(category_id) }),
                ...(is_active !== undefined && { is_active: is_active === 'true' }),
                ...(is_featured !== undefined && { is_featured: is_featured === 'true' }),
                ...(is_best_seller !== undefined && { is_best_seller: is_best_seller === 'true' }),
                ...(is_new_arrival !== undefined && { is_new_arrival: is_new_arrival === 'true' }),
                ...(fragrance_type && { fragrance_type }),
                ...(gender && { gender }),
                ...(uploadedImages.length > 0 && {
                    images: {
                        create: uploadedImages.map((url, index) => ({
                            image_url: url,
                            sort_order: index
                        }))
                    }
                })
            }
        });
        // Update variants if provided
        if (variants_json) {
            const variants = JSON.parse(variants_json);
            for (const v of variants) {
                if (v.id) {
                    // Update existing variant
                    await database_1.default.productVariant.update({
                        where: { id: v.id },
                        data: {
                            price: v.price,
                            discount_price: v.discount_price || null,
                            stock_quantity: v.stock_quantity,
                        }
                    });
                }
                else {
                    // Create new variant
                    await database_1.default.productVariant.create({
                        data: {
                            product_id: product.id,
                            size_ml: v.size_ml,
                            price: v.price,
                            stock_quantity: v.stock_quantity,
                            sku: v.sku
                        }
                    });
                }
            }
        }
        await revalidateFrontend('products');
        await (0, auditLog_1.logAdminAction)(req.admin.id, 'UPDATE_PRODUCT', 'Product', product.id, existing, product);
        res.json({ success: true, data: product });
    }
    catch (error) {
        console.error('UPDATE PRODUCT ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const existing = await database_1.default.product.findUnique({
            where: { id: parseInt(id) }
        });
        if (!existing) {
            res.status(404).json({ success: false, message: 'Product not found' });
            return;
        }
        // Soft delete — just set is_active to false
        await database_1.default.product.update({
            where: { id: parseInt(id) },
            data: { is_active: false }
        });
        await revalidateFrontend('products');
        await (0, auditLog_1.logAdminAction)(req.admin.id, 'DELETE_PRODUCT', 'Product', existing.id, existing, { is_active: false });
        res.json({ success: true, message: 'Product deleted successfully' });
    }
    catch (error) {
        console.error('DELETE PRODUCT ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.deleteProduct = deleteProduct;
const bulkDeleteProducts = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
            res.status(400).json({ success: false, message: 'Invalid or missing product IDs' });
            return;
        }
        const intIds = ids.map(id => parseInt(id));
        // Soft delete all specified products
        await database_1.default.product.updateMany({
            where: { id: { in: intIds } },
            data: { is_active: false }
        });
        await revalidateFrontend('products');
        await (0, auditLog_1.logAdminAction)(req.admin.id, 'BULK_DELETE_PRODUCTS', 'Product', 0, null, { deleted_ids: intIds, is_active: false });
        res.json({ success: true, message: 'Products deleted successfully' });
    }
    catch (error) {
        console.error('BULK DELETE PRODUCTS ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.bulkDeleteProducts = bulkDeleteProducts;
const deleteProductImage = async (req, res) => {
    try {
        const imageId = req.params.imageId;
        await database_1.default.productImage.delete({
            where: { id: parseInt(imageId) }
        });
        res.json({ success: true, message: 'Image deleted' });
    }
    catch (error) {
        console.error('DELETE IMAGE ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.deleteProductImage = deleteProductImage;
