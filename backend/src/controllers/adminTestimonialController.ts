import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AdminAuthRequest } from '../middleware/authMiddleware';
import { logAdminAction } from '../utils/auditLog';

const prisma = new PrismaClient();

export const getAllTestimonials = async (req: AdminAuthRequest, res: Response) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { created_at: 'desc' }
    });
    res.json({ success: true, data: testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createTestimonial = async (req: AdminAuthRequest, res: Response) => {
  try {
    const { customer_name, content, rating, is_featured, is_approved } = req.body;
    const adminId = req.admin!.id;

    const ratingNum = Number(rating);
    if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      res.status(400).json({ success: false, message: 'Rating must be a whole number between 1 and 5' });
      return;
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        customer_name,
        content,
        rating: Number(rating),
        is_featured: is_featured === true || is_featured === 'true',
        is_approved: is_approved === true || is_approved === 'true'
      }
    });

    await logAdminAction(adminId, 'CREATE_TESTIMONIAL', 'Testimonial', testimonial.id, null, testimonial);

    res.json({ success: true, data: testimonial, message: 'Testimonial created' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create testimonial' });
  }
};

export const updateTestimonial = async (req: AdminAuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { customer_name, content, rating, is_featured, is_approved } = req.body;
    const adminId = req.admin!.id;

    if (rating !== undefined) {
      const ratingNum = Number(rating);
      if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        res.status(400).json({ success: false, message: 'Rating must be a whole number between 1 and 5' });
        return;
      }
    }

    const existing = await prisma.testimonial.findUnique({ where: { id: parseInt(id as string) } });

    const testimonial = await prisma.testimonial.update({
      where: { id: parseInt(id as string) },
      data: {
        customer_name,
        content,
        rating: rating !== undefined ? Number(rating) : undefined,
        is_featured: is_featured !== undefined ? (is_featured === true || is_featured === 'true') : undefined,
        is_approved: is_approved !== undefined ? (is_approved === true || is_approved === 'true') : undefined
      }
    });

    await logAdminAction(adminId, 'UPDATE_TESTIMONIAL', 'Testimonial', testimonial.id, existing, testimonial);

    res.json({ success: true, data: testimonial, message: 'Testimonial updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update testimonial' });
  }
};

export const deleteTestimonial = async (req: AdminAuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const adminId = req.admin!.id;

    const existing = await prisma.testimonial.findUnique({ where: { id: parseInt(id as string) } });
    await prisma.testimonial.delete({ where: { id: parseInt(id as string) } });

    await logAdminAction(adminId, 'DELETE_TESTIMONIAL', 'Testimonial', parseInt(id as string), existing, null);

    res.json({ success: true, message: 'Testimonial deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete testimonial' });
  }
};
