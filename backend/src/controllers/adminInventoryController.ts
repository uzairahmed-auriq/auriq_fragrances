import { Request, Response } from 'express';
import prisma from '../config/database';

export const getInventory = async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const filter = req.query.filter as string; // 'LOW_STOCK' or 'OUT_OF_STOCK'

    const baseWhere: any = {
      is_active: true,
      product: { is_active: true }
    };

    if (filter === 'OUT_OF_STOCK') {
      baseWhere.stock_quantity = 0;
    }

    // For LOW_STOCK, Prisma can't do column-to-column comparison (stock_quantity <= low_stock_alert),
    // so fetch all active variants and filter in memory using the per-variant threshold.
    if (filter === 'LOW_STOCK') {
      const all = await prisma.productVariant.findMany({
        where: { ...baseWhere, stock_quantity: { gt: 0 } },
        include: { product: { select: { name: true, brand: true, is_active: true } } },
        orderBy: { stock_quantity: 'asc' },
        take: 1000
      });

      const lowStock = all.filter(v => v.stock_quantity <= v.low_stock_alert);
      const paginated = lowStock.slice((page - 1) * limit, page * limit);

      return res.json({
        success: true,
        data: paginated.map(v => ({
          id: v.id,
          productName: v.product.name,
          brand: v.product.brand,
          size: v.size_ml,
          sku: v.sku,
          price: v.price,
          stock: v.stock_quantity,
          lowStockAlert: v.low_stock_alert,
          isActive: v.is_active && v.product.is_active,
          status: 'Low Stock'
        })),
        pagination: { total: lowStock.length, page, limit, pages: Math.ceil(lowStock.length / limit) }
      });
    }

    const [total, variants] = await Promise.all([
      prisma.productVariant.count({ where: baseWhere }),
      prisma.productVariant.findMany({
        where: baseWhere,
        include: { product: { select: { name: true, brand: true, is_active: true } } },
        orderBy: { stock_quantity: 'asc' },
        skip: (page - 1) * limit,
        take: limit
      })
    ]);

    const inventory = variants.map(v => ({
      id: v.id,
      productName: v.product.name,
      brand: v.product.brand,
      size: v.size_ml,
      sku: v.sku,
      price: v.price,
      stock: v.stock_quantity,
      lowStockAlert: v.low_stock_alert,
      isActive: v.is_active && v.product.is_active,
      status: v.stock_quantity === 0 ? 'Out of Stock' : (v.stock_quantity <= v.low_stock_alert ? 'Low Stock' : 'In Stock')
    }));

    res.json({
      success: true,
      data: inventory,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('INVENTORY ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
