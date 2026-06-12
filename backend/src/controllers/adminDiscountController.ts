import { Response } from 'express';
import prisma from '../config/database';
import { AdminAuthRequest } from '../middleware/authMiddleware';

export const getAllDiscounts = async (req: AdminAuthRequest, res: Response): Promise<void> => {
  try {
    const discounts = await prisma.discountCode.findMany({
      orderBy: { created_at: 'desc' }
    });
    res.json({ success: true, data: discounts });
  } catch (error) {
    console.error('Error fetching discounts:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const createDiscount = async (req: AdminAuthRequest, res: Response): Promise<void> => {
  try {
    const { code, type, value, min_order, max_uses, is_active, expires_at } = req.body;

    const existing = await prisma.discountCode.findUnique({ where: { code } });
    if (existing) {
      res.status(400).json({ success: false, message: 'Discount code already exists' });
      return;
    }

    const discount = await prisma.discountCode.create({
      data: {
        code: code.toUpperCase(),
        type,
        value,
        min_order: min_order || 0,
        max_uses: max_uses || null,
        is_active: is_active ?? true,
        expires_at: expires_at ? new Date(expires_at) : null
      }
    });

    res.json({ success: true, data: discount });
  } catch (error) {
    console.error('Error creating discount:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const updateDiscount = async (req: AdminAuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { is_active, max_uses, expires_at } = req.body;

    const discount = await prisma.discountCode.update({
      where: { id: parseInt(id as string) },
      data: {
        is_active,
        max_uses: max_uses === '' ? null : max_uses,
        expires_at: expires_at ? new Date(expires_at) : null
      }
    });

    res.json({ success: true, data: discount });
  } catch (error) {
    console.error('Error updating discount:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const deleteDiscount = async (req: AdminAuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.discountCode.delete({
      where: { id: parseInt(id as string) }
    });
    res.json({ success: true, message: 'Discount deleted' });
  } catch (error) {
    console.error('Error deleting discount:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
