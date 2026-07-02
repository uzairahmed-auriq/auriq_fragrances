import { Request, Response } from 'express';
import prisma from '../config/database';
import { logAdminAction } from '../utils/auditLog';
import { ENV } from '../config/env';

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
      orderBy: { subscribed_at: 'desc' },
      take: 10000
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

export const sendCampaign = async (req: Request, res: Response) => {
  try {
    const { subject, message } = req.body;
    if (!subject || !message) {
      res.status(400).json({ success: false, message: 'Subject and message are required' });
      return;
    }

    const subscribers = await prisma.newsletterSubscriber.findMany();
    if (subscribers.length === 0) {
      res.status(400).json({ success: false, message: 'No subscribers found' });
      return;
    }

    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    let sent = 0;
    for (const sub of subscribers) {
      try {
        await resend.emails.send({
          from: `Auriq Fragrances <${ENV.MARKETING_EMAIL}>`,
          to: sub.email,
          subject,
          html: `
            <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#f5f0e8;">
              <div style="background:#1a1a1a;padding:40px;text-align:center;border-bottom:2px solid #d4af37;">
                <h1 style="color:#d4af37;font-size:28px;letter-spacing:4px;margin:0;">AURIQ</h1>
                <p style="color:#888;font-size:11px;letter-spacing:3px;margin:8px 0 0;">LUXURY FRAGRANCES</p>
              </div>
              <div style="padding:40px;">
                ${message.replace(/\n/g, '<br/>')}
              </div>
              <div style="background:#1a1a1a;padding:24px;text-align:center;border-top:1px solid #333;">
                <p style="color:#555;font-size:11px;margin:0;">© 2026 Auriq Fragrances. You are receiving this because you subscribed at auriqfragrances.com</p>
              </div>
            </div>
          `
        });
        sent++;
      } catch (err) {
        console.error(`Failed to send to ${sub.email}:`, err);
      }
    }

    await logAdminAction((req as any).admin.id, 'SEND_CAMPAIGN', 'Newsletter', 0, null, { subject, sent });
    res.json({ success: true, message: `Campaign sent to ${sent} subscribers` });
  } catch (error) {
    console.error('SEND CAMPAIGN ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
