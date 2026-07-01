import { Request, Response } from 'express';
import { sendOrderStatusUpdate } from '../services/emailService';
import prisma from '../config/database';
import { logAdminAction } from '../utils/auditLog';

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true } },
        items: true,
        address: true
      },
      orderBy: { created_at: 'desc' }
    });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('GET ALL ORDERS ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const VALID_ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'WAREHOUSE', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const normalizedStatus = (status || '').toUpperCase();
    if (!VALID_ORDER_STATUSES.includes(normalizedStatus)) {
      res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${VALID_ORDER_STATUSES.join(', ')}` });
      return;
    }

    const order = await prisma.order.update({
      where: { id: parseInt(id as string) },
      data: { status: normalizedStatus as any }
    });

    await logAdminAction((req as any).admin.id, 'UPDATE_ORDER_STATUS', 'Order', order.id, null, { status });

    const fullOrder = await prisma.order.findUnique({ where: { id: order.id }, include: { user: { select: { name: true, email: true } }, items: true } });
    const recipientEmail = fullOrder?.user?.email || fullOrder?.guest_email;
    const recipientName = fullOrder?.user?.name || fullOrder?.guest_name || 'Valued Customer';
    if (recipientEmail) sendOrderStatusUpdate(fullOrder, recipientEmail, recipientName, status.toUpperCase()).catch(console.error);
    res.json({ success: true, data: order });
  } catch (error) {
    console.error('UPDATE ORDER STATUS ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.id as string);
    if (isNaN(orderId)) {
      res.status(400).json({ success: false, message: 'Invalid order ID' });
      return;
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true }
    });

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    // Restore stock for non-cancelled/delivered orders
    if (!['CANCELLED', 'DELIVERED'].includes(order.status)) {
      await prisma.$transaction(
        order.items
          .filter(item => item.variant_id !== null)
          .map(item =>
            prisma.productVariant.update({
              where: { id: item.variant_id! },
              data: { stock_quantity: { increment: item.quantity } }
            })
          )
      );
    }

    await prisma.order.delete({ where: { id: orderId } });

    res.json({ success: true, message: 'Order deleted' });
  } catch (error) {
    console.error('DELETE ORDER ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getPendingOrdersCount = async (req: Request, res: Response) => {
  try {
    const count = await prisma.order.count({ where: { status: 'PENDING' } });
    res.json({ success: true, data: { count } });
  } catch (error) {
    console.error('GET PENDING COUNT ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [
      totalOrders,
      totalCustomers,
      totalProducts,
      pendingOrders,
      recentOrders,
      totalRevenueData
    ] = await Promise.all([
      prisma.order.count(),
      prisma.user.count({ where: { is_email_verified: true, is_active: true } }),
      prisma.product.count({ where: { is_active: true } }),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { created_at: 'desc' },
        include: {
          user: { select: { name: true, email: true } },
          items: true
        }
      }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { payment_status: 'PAID' }
      })
    ])

    const totalRevenue = totalRevenueData._sum.total || 0

    res.json({
      success: true,
      data: {
        total_orders: totalOrders,
        total_customers: totalCustomers,
        total_products: totalProducts,
        pending_orders: pendingOrders,
        total_revenue: totalRevenue,
        recent_orders: recentOrders
      }
    })
  } catch (error) {
    console.error('DASHBOARD STATS ERROR:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}