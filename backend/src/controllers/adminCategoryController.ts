import { Request, Response } from 'express';
import prisma from '../config/database';
import { logAdminAction } from '../utils/auditLog';

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, is_active } = req.body;
    
    const category = await prisma.category.create({
      data: {
        name,
        slug: name.toLowerCase().replace(/ /g, '-'),
        is_active: is_active ?? true
      }
    });

    await logAdminAction((req as any).admin.id, 'CREATE_CATEGORY', 'Category', category.id, null, { name: category.name });

    res.json({ success: true, data: category });
  } catch (error) {
    console.error('CREATE CATEGORY ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, is_active } = req.body;
    
    const category = await prisma.category.update({
      where: { id: parseInt(id as string) },
      data: {
        name,
        slug: name ? name.toLowerCase().replace(/ /g, '-') : undefined,
        is_active
      }
    });

    await logAdminAction((req as any).admin.id, 'UPDATE_CATEGORY', 'Category', category.id, null, category);

    res.json({ success: true, data: category });
  } catch (error) {
    console.error('UPDATE CATEGORY ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
