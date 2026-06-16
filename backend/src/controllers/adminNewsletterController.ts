import { Request, Response } from 'express';
import prisma from '../config/database';
import { logAdminAction } from '../utils/auditLog';

export const getSubscribers = async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(500, Math.max(1, Number(req.query.limit) || 50));

    const [total, subscribers] = await Promise.all([
      prisma.newsletterSubscriber.count(),
      prisma.newsletterSubscriber.findMany({
        orderBy: { subscribed_at: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      })
    ]);

    res.json({
      success: true,
      data: subscribers,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('GET SUBSCRIBERS ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteSubscriber = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { id: parseInt(id as string) }
    });

    if (!existing) {
      res.status(404).json({ success: false, message: 'Subscriber not found' });
      return;
    }

    await prisma.newsletterSubscriber.delete({
      where: { id: parseInt(id as string) }
    });

    await logAdminAction((req as any).admin.id, 'DELETE_SUBSCRIBER', 'NewsletterSubscriber', existing.id, existing, null);

    res.json({ success: true, message: 'Subscriber deleted successfully' });
  } catch (error) {
    console.error('DELETE SUBSCRIBER ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const exportSubscribersCSV = async (req: Request, res: Response) => {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { subscribed_at: 'desc' }
    });

    // Create CSV content
    const headers = ['ID', 'Email', 'Discount Sent', 'Subscribed At'];
    const rows = subscribers.map(sub => [
      sub.id,
      sub.email,
      sub.discount_sent ? 'Yes' : 'No',
      sub.subscribed_at.toISOString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="subscribers.csv"');
    
    res.send(csvContent);
  } catch (error) {
    console.error('EXPORT SUBSCRIBERS ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
