import { Response } from 'express';
import prisma from '../config/database';
import { UserAuthRequest } from '../middleware/authMiddleware';

export const getCart = async (req: UserAuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const sessionId = req.headers['x-guest-session-id'] as string;

    if (!userId && !sessionId) {
      res.status(400).json({ success: false, message: 'User ID or Session ID is required' });
      return;
    }

    const cart = await prisma.cart.findFirst({
      where: userId ? { user_id: userId } : { session_id: sessionId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: { images: { take: 1, orderBy: { sort_order: "asc" } } }
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
  } catch (error) {
    console.error('Error getting cart:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const addToCart = async (req: UserAuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const sessionId = req.headers['x-guest-session-id'] as string;
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
    let cart = await prisma.cart.findFirst({
      where: userId ? { user_id: userId } : { session_id: sessionId }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          user_id: userId || null,
          session_id: userId ? null : sessionId
        }
      });
    }

    // Check if item already exists
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cart_id: cart.id,
        variant_id: variantId || null,
        bundle_id: bundleId || null
      }
    });

    if (existingItem) {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      });
    } else {
      // Add new item
      await prisma.cartItem.create({
        data: {
          cart_id: cart.id,
          variant_id: variantId || null,
          bundle_id: bundleId || null,
          quantity
        }
      });
    }

    // Return updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            variant: { include: { product: { include: { images: { take: 1, orderBy: { sort_order: "asc" } } } } } },
            bundle: true
          }
        }
      }
    });

    res.json({ success: true, data: updatedCart });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const updateCartItem = async (req: UserAuthRequest, res: Response): Promise<void> => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const userId = req.user?.id;
    const sessionId = req.headers['x-guest-session-id'] as string;

    if (quantity < 1) {
      res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
      return;
    }

    const item = await prisma.cartItem.findUnique({
      where: { id: parseInt(itemId as string) },
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

    await prisma.cartItem.update({
      where: { id: parseInt(itemId as string) },
      data: { quantity }
    });

    res.json({ success: true, message: 'Quantity updated' });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const removeFromCart = async (req: UserAuthRequest, res: Response): Promise<void> => {
  try {
    const { itemId } = req.params;
    const userId = req.user?.id;
    const sessionId = req.headers['x-guest-session-id'] as string;

    const item = await prisma.cartItem.findUnique({
      where: { id: parseInt(itemId as string) },
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

    await prisma.cartItem.delete({
      where: { id: parseInt(itemId as string) }
    });

    res.json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing cart item:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
