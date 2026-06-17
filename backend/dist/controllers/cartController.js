"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFromCart = exports.updateCartItem = exports.addToCart = exports.getCart = void 0;
const database_1 = __importDefault(require("../config/database"));
const getCart = async (req, res) => {
    try {
        const userId = req.user?.id;
        const sessionId = req.headers['x-guest-session-id'];
        if (!userId && !sessionId) {
            res.status(400).json({ success: false, message: 'User ID or Session ID is required' });
            return;
        }
        const cart = await database_1.default.cart.findFirst({
            where: userId ? { user_id: userId } : { session_id: sessionId },
            include: {
                items: {
                    include: {
                        variant: {
                            include: {
                                product: {
                                    include: { images: { where: { is_primary: true } } }
                                }
                            }
                        },
                        bundle: true
                    }
                }
            }
        });
        if (!cart) {
            res.json({ success: true, data: { items: [] } });
            return;
        }
        res.json({ success: true, data: cart });
    }
    catch (error) {
        console.error('Error getting cart:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.getCart = getCart;
const addToCart = async (req, res) => {
    try {
        const userId = req.user?.id;
        const sessionId = req.headers['x-guest-session-id'];
        const { variantId, bundleId, quantity = 1 } = req.body;
        if (!userId && !sessionId) {
            res.status(400).json({ success: false, message: 'User ID or Session ID is required' });
            return;
        }
        if (!variantId && !bundleId) {
            res.status(400).json({ success: false, message: 'Variant ID or Bundle ID is required' });
            return;
        }
        // Find or create cart
        let cart = await database_1.default.cart.findFirst({
            where: userId ? { user_id: userId } : { session_id: sessionId }
        });
        if (!cart) {
            cart = await database_1.default.cart.create({
                data: {
                    user_id: userId || null,
                    session_id: userId ? null : sessionId
                }
            });
        }
        // Check if item already exists
        const existingItem = await database_1.default.cartItem.findFirst({
            where: {
                cart_id: cart.id,
                variant_id: variantId || null,
                bundle_id: bundleId || null
            }
        });
        if (existingItem) {
            // Update quantity
            await database_1.default.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity }
            });
        }
        else {
            // Add new item
            await database_1.default.cartItem.create({
                data: {
                    cart_id: cart.id,
                    variant_id: variantId || null,
                    bundle_id: bundleId || null,
                    quantity
                }
            });
        }
        // Return updated cart
        const updatedCart = await database_1.default.cart.findUnique({
            where: { id: cart.id },
            include: {
                items: {
                    include: {
                        variant: { include: { product: { include: { images: { where: { is_primary: true } } } } } },
                        bundle: true
                    }
                }
            }
        });
        res.json({ success: true, data: updatedCart });
    }
    catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.addToCart = addToCart;
const updateCartItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { quantity } = req.body;
        const userId = req.user?.id;
        const sessionId = req.headers['x-guest-session-id'];
        if (quantity < 1) {
            res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
            return;
        }
        const item = await database_1.default.cartItem.findUnique({
            where: { id: parseInt(itemId) },
            include: { cart: true }
        });
        if (!item) {
            res.status(404).json({ success: false, message: 'Item not found' });
            return;
        }
        // Verify ownership
        if (userId && item.cart.user_id !== userId) {
            res.status(403).json({ success: false, message: 'Forbidden' });
            return;
        }
        if (!userId && item.cart.session_id !== sessionId) {
            res.status(403).json({ success: false, message: 'Forbidden' });
            return;
        }
        await database_1.default.cartItem.update({
            where: { id: parseInt(itemId) },
            data: { quantity }
        });
        res.json({ success: true, message: 'Quantity updated' });
    }
    catch (error) {
        console.error('Error updating cart item:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.updateCartItem = updateCartItem;
const removeFromCart = async (req, res) => {
    try {
        const { itemId } = req.params;
        const userId = req.user?.id;
        const sessionId = req.headers['x-guest-session-id'];
        const item = await database_1.default.cartItem.findUnique({
            where: { id: parseInt(itemId) },
            include: { cart: true }
        });
        if (!item) {
            res.status(404).json({ success: false, message: 'Item not found' });
            return;
        }
        // Verify ownership
        if (userId && item.cart.user_id !== userId) {
            res.status(403).json({ success: false, message: 'Forbidden' });
            return;
        }
        if (!userId && item.cart.session_id !== sessionId) {
            res.status(403).json({ success: false, message: 'Forbidden' });
            return;
        }
        await database_1.default.cartItem.delete({
            where: { id: parseInt(itemId) }
        });
        res.json({ success: true, message: 'Item removed from cart' });
    }
    catch (error) {
        console.error('Error removing cart item:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.removeFromCart = removeFromCart;
