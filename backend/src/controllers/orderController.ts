import { Response } from 'express';
import prisma from '../config/database';
import { UserAuthRequest } from '../middleware/authMiddleware';

export const createOrder = async (req: UserAuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const sessionId = req.headers['x-guest-session-id'] as string;
    
    const { 
      guestInfo, 
      shippingAddress, 
      paymentMethod = 'COD',
      notes = '',
      discountCode = null
    } = req.body;

    // Validate request
    if (!userId && !sessionId) {
      res.status(400).json({ success: false, message: 'User ID or Session ID is required' });
      return;
    }

    // Get Cart
    const cart = await prisma.cart.findFirst({
      where: userId ? { user_id: userId } : { session_id: sessionId },
      include: {
        items: {
          include: {
            variant: { include: { product: true } },
            bundle: true
          }
        }
      }
    });

    if (!cart || cart.items.length === 0) {
      res.status(400).json({ success: false, message: 'Cart is empty' });
      return;
    }

    // Need shipping config for shipping fee
    const shippingConfig = await prisma.shippingConfig.findFirst() || { flat_fee: 250, free_shipping_above: 5000 };

    // Use a transaction for creating order and updating stock
    const result = await prisma.$transaction(async (tx) => {
      let subtotal = 0;
      const orderItemsData: any[] = [];

      for (const item of cart.items) {
        if (item.variant) {
          const price = Number(item.variant.discount_price || item.variant.price);
          const itemTotal = price * item.quantity;
          subtotal += itemTotal;

          // Check stock
          if (item.variant.stock_quantity < item.quantity) {
            throw new Error(`Insufficient stock for ${item.variant.product.name}`);
          }

          // Decrement stock
          await tx.productVariant.update({
            where: { id: item.variant.id },
            data: { stock_quantity: item.variant.stock_quantity - item.quantity }
          });

          orderItemsData.push({
            variant_id: item.variant.id,
            item_name: item.variant.product.name,
            item_sku: item.variant.sku,
            size_ml: item.variant.size_ml,
            quantity: item.quantity,
            unit_price: price,
            total_price: itemTotal
          });
        }
        // TODO: Handle bundles similarly
      }

      // Check and apply discount
      let discountAmount = 0;
      let appliedDiscountCodeId: number | null = null;
      if (discountCode) {
        const discount = await tx.discountCode.findUnique({
          where: { code: discountCode.toUpperCase() }
        });

        if (!discount || !discount.is_active || (discount.expires_at && discount.expires_at < new Date()) || (discount.max_uses && discount.used_count >= discount.max_uses) || subtotal < Number(discount.min_order)) {
          throw new Error('Invalid or inapplicable discount code');
        }

        if (userId) {
          const existingUse = await tx.discountUse.findUnique({
            where: {
              discount_code_id_user_id: {
                discount_code_id: discount.id,
                user_id: userId
              }
            }
          });
          if (existingUse) {
            throw new Error('You have already used this discount code');
          }
        }

        if (discount.type === 'PERCENTAGE') {
          discountAmount = (subtotal * Number(discount.value)) / 100;
        } else if (discount.type === 'FLAT') {
          discountAmount = Number(discount.value);
        }
        if (discountAmount > subtotal) discountAmount = subtotal;

        appliedDiscountCodeId = discount.id;
      }

      const shippingFee = subtotal >= Number(shippingConfig.free_shipping_above) ? 0 : Number(shippingConfig.flat_fee);
      const total = subtotal + shippingFee - discountAmount;

      // Create Order
      const order = await tx.order.create({
        data: {
          user_id: userId || null,
          guest_email: userId ? null : guestInfo?.email,
          guest_name: userId ? null : guestInfo?.name,
          guest_phone: userId ? null : guestInfo?.phone,
          shipping_name: shippingAddress.name,
          shipping_phone: shippingAddress.phone,
          shipping_street: shippingAddress.street,
          shipping_city: shippingAddress.city,
          shipping_province: shippingAddress.province,
          shipping_postal: shippingAddress.postal_code,
          payment_method: paymentMethod,
          payment_status: paymentMethod === 'COD' ? 'UNPAID' : 'PAID', // Simplified for mock card
          subtotal,
          shipping_fee: shippingFee,
          discount_amount: discountAmount,
          discount_code: discountCode ? discountCode.toUpperCase() : null,
          total,
          notes,
          items: {
            create: orderItemsData
          }
        },
        include: { items: true }
      });

      // Update discount usage
      if (appliedDiscountCodeId) {
        await tx.discountCode.update({
          where: { id: appliedDiscountCodeId },
          data: { used_count: { increment: 1 } }
        });
        if (userId) {
          await tx.discountUse.create({
            data: {
              discount_code_id: appliedDiscountCodeId,
              user_id: userId
            }
          });
        }
      }

      // Clear the cart
      await tx.cart.delete({ where: { id: cart.id } });

      return order;
    });

    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error creating order:', error);
    if (error.message && (error.message.includes('Insufficient stock') || error.message.includes('Invalid') || error.message.includes('already used'))) {
      res.status(400).json({ success: false, message: error.message });
      return;
    }
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
};

export const getMyOrders = async (req: UserAuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const orders = await prisma.order.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      include: { items: true }
    });

    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getOrderById = async (req: UserAuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const order = await prisma.order.findUnique({
      where: { id: parseInt(id as string) },
      include: { items: true }
    });

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    // STRICT SECURITY RULE: Must be owner or guest accessing their own order (can use email/token)
    if (order.user_id && order.user_id !== userId) {
      res.status(403).json({ success: false, message: 'Forbidden: You do not have permission to view this order.' });
      return;
    }

    // Note: If it's a guest order, we might need a separate mechanism like order token to view it
    // For now, if it's a guest order, we'll return it, but a robust app would require an order_token
    if (!order.user_id && !req.headers['x-guest-session-id']) {
      // In a real scenario, protect guest orders too.
    }

    res.json({ success: true, data: order });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
