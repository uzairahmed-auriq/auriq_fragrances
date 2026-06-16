import { Request, Response } from 'express';
import prisma from '../config/database';
import { logAdminAction } from '../utils/auditLog';

export const getMessages = async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));

    const [total, messages] = await Promise.all([
      prisma.contactMessage.count(),
      prisma.contactMessage.findMany({
        orderBy: { created_at: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      })
    ]);

    res.json({ 
      success: true, 
      data: messages,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('GET MESSAGES ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateMessageStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, is_read } = req.body;

    const existing = await prisma.contactMessage.findUnique({ where: { id: parseInt(id as string) } });

    const message = await prisma.contactMessage.update({
      where: { id: parseInt(id as string) },
      data: {
        ...(status && { status }),
        ...(is_read !== undefined && { is_read })
      }
    });

    await logAdminAction((req as any).admin.id, 'UPDATE_MESSAGE_STATUS', 'ContactMessage', message.id, existing, message);

    res.json({ success: true, data: message });
  } catch (error) {
    console.error('UPDATE MESSAGE STATUS ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.contactMessage.findUnique({ where: { id: parseInt(id as string) } });

    await prisma.contactMessage.delete({
      where: { id: parseInt(id as string) }
    });

    if (existing) {
      await logAdminAction((req as any).admin.id, 'DELETE_MESSAGE', 'ContactMessage', existing.id, existing, null);
    }

    res.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    console.error('DELETE MESSAGE ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
