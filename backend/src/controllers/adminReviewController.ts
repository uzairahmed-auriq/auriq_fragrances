import { Request, Response } from 'express';
import prisma from '../config/database';
import { logAdminAction } from '../utils/auditLog';

export const getAllReviews = async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));

    const [total, reviews] = await Promise.all([
      prisma.review.count(),
      prisma.review.findMany({
        include: {
          product: { select: { name: true } },
          user: { select: { name: true, email: true } }
        },
        orderBy: { created_at: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      })
    ]);

    res.json({ 
      success: true, 
      data: reviews,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('GET ALL REVIEWS ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateReviewStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { is_active, is_featured } = req.body;

    const existing = await prisma.review.findUnique({ where: { id: parseInt(id as string) } });

    const review = await prisma.review.update({
      where: { id: parseInt(id as string) },
      data: {
        ...(is_active !== undefined && { is_active }),
        ...(is_featured !== undefined && { is_featured })
      }
    });

    await logAdminAction((req as any).admin.id, 'UPDATE_REVIEW_STATUS', 'Review', review.id, existing, review);

    res.json({ success: true, data: review, message: 'Review updated successfully' });
  } catch (error) {
    console.error('UPDATE REVIEW STATUS ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
