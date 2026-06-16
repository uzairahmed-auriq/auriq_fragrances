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
      prisma.order.aggregate({ _sum: { total: true }, where: { created_at: { gte: today }, payment_status: 'PAID' } }),
      prisma.order.aggregate({ _sum: { total: true }, where: { created_at: { gte: startOfWeek }, payment_status: 'PAID' } }),
      prisma.order.aggregate({ _sum: { total: true }, where: { created_at: { gte: startOfMonth }, payment_status: 'PAID' } }),
      prisma.order.aggregate({ _sum: { total: true }, where: { created_at: { gte: startOfYear }, payment_status: 'PAID' } }),
      prisma.order.count({ where: { payment_status: 'PAID' } }),
      prisma.order.aggregate({ _sum: { total: true }, where: { payment_status: 'PAID' } }),
      prisma.user.count(),
      prisma.order.groupBy({ by: ['user_id'], _count: { id: true }, having: { id: { _count: { gt: 1 } } } }),
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
    const returningCustomers = returningCustomersData.length;
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
        totalOrders: totalOrdersData,
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
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
