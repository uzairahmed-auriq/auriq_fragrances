"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMerchantCenterFeed = exports.searchProducts = exports.getProductById = exports.getBestSellers = exports.getFeaturedProducts = exports.getAllProducts = void 0;
const database_1 = __importDefault(require("../config/database"));
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
                    images: { orderBy: { sort_order: 'asc' } },
                    fragrance_notes: true,
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
        console.error('GET ALL PRODUCTS ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getAllProducts = getAllProducts;
const getFeaturedProducts = async (req, res) => {
    try {
        const products = await database_1.default.product.findMany({
            where: { is_active: true, is_featured: true },
            include: {
                category: true,
                variants: true,
                images: { orderBy: { sort_order: 'asc' } },
            },
            take: 8
        });
        res.json({ success: true, data: products });
    }
    catch (error) {
        console.error('GET FEATURED PRODUCTS ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getFeaturedProducts = getFeaturedProducts;
const getBestSellers = async (req, res) => {
    try {
        const products = await database_1.default.product.findMany({
            where: { is_active: true, is_best_seller: true },
            include: {
                category: true,
                variants: true,
                images: { orderBy: { sort_order: 'asc' } },
            },
            take: 8
        });
        res.json({ success: true, data: products });
    }
    catch (error) {
        console.error('GET BEST SELLERS ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getBestSellers = getBestSellers;
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await database_1.default.product.findUnique({
            where: { id: parseInt(id) },
            include: {
                category: true,
                variants: true,
                images: { orderBy: { sort_order: 'asc' } },
                fragrance_notes: true,
            }
        });
        if (!product || !product.is_active) {
            res.status(404).json({ success: false, message: 'Product not found' });
            return;
        }
        res.json({ success: true, data: product });
    }
    catch (error) {
        console.error('GET PRODUCT BY ID ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getProductById = getProductById;
// GET /api/products/search?q=keyword
const searchProducts = async (req, res) => {
    try {
        const q = req.query.q;
        if (!q) {
            res.status(400).json({ success: false, message: 'Search query required' });
            return;
        }
        const products = await database_1.default.product.findMany({
            where: {
                is_active: true,
                OR: [
                    { name: { contains: q, mode: 'insensitive' } },
                    { brand: { contains: q, mode: 'insensitive' } },
                    { fragrance_type: { contains: q, mode: 'insensitive' } },
                    { description: { contains: q, mode: 'insensitive' } },
                ]
            },
            take: 8,
            include: {
                images: { where: { is_primary: true }, take: 1 },
                variants: {
                    where: { is_active: true },
                    orderBy: { price: 'asc' },
                    take: 1,
                    select: { price: true, discount_price: true, size_ml: true }
                }
            }
        });
        res.json({ success: true, data: products });
    }
    catch (error) {
        console.error('SEARCH ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.searchProducts = searchProducts;
// GET /api/products/feed/merchant-center
const generateMerchantCenterFeed = async (req, res) => {
    try {
        const products = await database_1.default.product.findMany({
            where: { is_active: true },
            include: {
                variants: { where: { is_active: true } },
                images: { orderBy: { sort_order: 'asc' }, take: 1 },
            }
        });
        const storeUrl = process.env.STOREFRONT_URL || 'https://auriqfragrances.com';
        let itemsXml = '';
        products.forEach(product => {
            const primaryImage = product.images.length > 0 ? product.images[0].image_url : '';
            const productLink = `${storeUrl}/product/${product.slug}`;
            const description = product.description || 'Luxury fragrance by Auriq';
            product.variants.forEach(variant => {
                // Build an item for each variant
                itemsXml += `
    <item>
      <g:id>${variant.sku}</g:id>
      <g:title><![CDATA[${product.name} - ${variant.size_ml}ml]]></g:title>
      <g:description><![CDATA[${description}]]></g:description>
      <g:link>${productLink}</g:link>
      <g:image_link><![CDATA[${primaryImage}]]></g:image_link>
      <g:condition>new</g:condition>
      <g:availability>${variant.stock_quantity > 0 ? 'in_stock' : 'out_of_stock'}</g:availability>
      <g:price>${variant.price.toString()} PKR</g:price>
      <g:brand>Auriq</g:brand>
      <g:item_group_id>${product.id}</g:item_group_id>
    </item>`;
            });
        });
        const feedXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Auriq Fragrances</title>
    <link>${storeUrl}</link>
    <description>Premium luxury fragrances crafted for elegance and sophistication.</description>
${itemsXml}
  </channel>
</rss>`;
        res.set('Content-Type', 'application/xml');
        res.send(feedXml);
    }
    catch (error) {
        console.error('MERCHANT CENTER FEED ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error generating feed' });
    }
};
exports.generateMerchantCenterFeed = generateMerchantCenterFeed;
