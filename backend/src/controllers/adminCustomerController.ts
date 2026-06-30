import { Request, Response } from 'express';
import prisma from '../config/database';

export const getAllCustomers = async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const search = req.query.search as string || '';

    const where = {
      is_email_verified: true,
      ...(search ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } }
        ]
      } : {})
    };

    const [total, customers] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          is_active: true,
          created_at: true,
          _count: { select: { orders: true } },
          orders: { select: { total: true } }
        }
      })
    ]);

    const mapped = customers.map(c => ({
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      is_active: c.is_active,
      created_at: c.created_at,
      total_orders: c._count.orders,
      total_spent: c.orders.reduce((sum, o) => sum + Number(o.total || 0), 0)
    }));

    res.json({ success: true, data: mapped, pagination: { total, page, limit, pages: Math.ceil(total / limit) } });
  } catch (error) {
    console.error('GET CUSTOMERS ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
