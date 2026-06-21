import { Request, Response } from 'express';
import prisma from '../config/database';

export const getAnalytics = async (req: Request, res: Response) => {
  try {

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    // Sales Trends: Last 7 days
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      return d;
    }).reverse();

    const [
      revenueTodayData,
      revenueWeekData,
      revenueMonthData,
      revenueYearData,
      totalOrdersData,
      totalRevenueData,
      totalCustomersData,
      returningCustomersData,
      recentOrdersData
    ] = await Promise.all([
      prisma.order.aggregate({ _sum: { total: true }, where: { created_at: { gte: today } } }),
      prisma.order.aggregate({ _sum: { total: true }, where: { created_at: { gte: startOfWeek } } }),
      prisma.order.aggregate({ _sum: { total: true }, where: { created_at: { gte: startOfMonth } } }),
      prisma.order.aggregate({ _sum: { total: true }, where: { created_at: { gte: startOfYear } } }),
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.user.count(),
      prisma.order.groupBy({ by: ['user_id'], _count: { id: true } }),
      prisma.order.findMany({
        take: 10,
        orderBy: { created_at: 'desc' },
        include: { user: { select: { name: true, email: true } }, items: true }
      })
    ]);

    // Compute sales trends manually since prisma doesn't have native day-by-day grouping easily without raw query
    const trendDataPromises = last7Days.map(async (date) => {
      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);
      
      const res = await prisma.order.aggregate({
        _sum: { total: true },
        where: { created_at: { gte: date, lt: nextDate }, payment_status: 'PAID' }
      });
      return {
        date: date.toISOString().split('T')[0],
        revenue: res._sum.total || 0
      };
    });
    
    const salesTrends = await Promise.all(trendDataPromises);

    const revenueToday = revenueTodayData._sum.total || 0;
    const revenueWeek = revenueWeekData._sum.total || 0;
    const revenueMonth = revenueMonthData._sum.total || 0;
    const revenueYear = revenueYearData._sum.total || 0;
    const totalRevenue = totalRevenueData._sum.total || 0;
    const aov = totalOrdersData > 0 ? (Number(totalRevenue) / totalOrdersData).toFixed(2) : 0;
    const returningCustomers = returningCustomersData.filter(g => g._count.id > 1).length;
    const pendingOrders = await prisma.order.count({ where: { status: "PENDING" } });
    const totalCustomers = totalCustomersData;

    // Top Selling Products
    const orderItems = await prisma.orderItem.groupBy({
      by: ['variant_id'],
      _sum: { quantity: true, total_price: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5
    });

    const topProducts = await Promise.all(
      orderItems.map(async (item) => {
        if (!item.variant_id) return null;
        const variant = await prisma.productVariant.findUnique({
          where: { id: item.variant_id },
          include: { product: true }
        });
        return {
          name: variant?.product.name,
          size: variant?.size_ml,
          sold: item._sum.quantity,
          revenue: item._sum.total_price
        };
      })
    );

    res.json({
      success: true,
      data: {
        revenueToday,
        revenueWeek,
        revenueMonth,
        revenueYear,
        totalRevenue,
        totalOrders: totalOrdersData,
        pendingOrders,
        totalCustomers,
        averageOrderValue: Number(aov),
        returningCustomers,
        topProducts: topProducts.filter(Boolean),
        recentOrders: recentOrdersData,
        salesTrends
      }
    });
  } catch (error) {
    console.error('ANALYTICS ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + (error instanceof Error ? error.message : String(error)) });
  }
};

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const [pendingOrders, unreadMessages, lowStockVariants] = await Promise.all([
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.contactMessage.count({ where: { is_read: false } }),
      prisma.productVariant.findMany({
        where: {
          is_active: true,
        },
        select: {
          id: true,
          stock_quantity: true,
          low_stock_alert: true,
          sku: true,
          product: { select: { name: true } }
        }
      })
    ]);

    const lowStockItems = lowStockVariants.filter(v => v.stock_quantity <= v.low_stock_alert);

    const notifications = [
      ...(pendingOrders > 0 ? [{
        id: 'pending-orders',
        type: 'order',
        message: `${pendingOrders} order${pendingOrders > 1 ? 's' : ''} pending fulfillment`,
        link: '/admin/orders'
      }] : []),
      ...(unreadMessages > 0 ? [{
        id: 'unread-messages',
        type: 'message',
        message: `${unreadMessages} unread message${unreadMessages > 1 ? 's' : ''}`,
        link: '/admin/messages'
      }] : []),
      ...lowStockItems.slice(0, 5).map(v => ({
        id: `low-stock-${v.id}`,
        type: 'stock',
        message: `${v.product.name} (${v.sku}) is low on stock (${v.stock_quantity} left)`,
        link: '/admin/inventory'
      }))
    ];

    res.json({
      success: true,
      data: {
        count: notifications.length,
        notifications
      }
    });
  } catch (error) {
    console.error('GET NOTIFICATIONS ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getAuditLogs = async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 50));

    const [total, logs] = await Promise.all([
      prisma.auditLog.count(),
      prisma.auditLog.findMany({
        orderBy: { created_at: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          admin: { select: { first_name: true, last_name: true, email: true } }
        }
      })
    ]);

    res.json({
      success: true,
      data: logs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('GET AUDIT LOGS ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
