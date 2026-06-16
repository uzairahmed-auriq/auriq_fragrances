import { Request, Response } from 'express';
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

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await prisma.order.update({
      where: { id: parseInt(id as string) },
      data: { status }
    });

    await logAdminAction((req as any).admin.id, 'UPDATE_ORDER_STATUS', 'Order', order.id, null, { status });

    res.json({ success: true, data: order });
  } catch (error) {
    console.error('UPDATE ORDER STATUS ERROR:', error);
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
      prisma.user.count(),
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