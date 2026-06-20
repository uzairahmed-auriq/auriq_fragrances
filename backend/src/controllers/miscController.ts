import { Request, Response } from 'express'
import prisma from '../config/database'
import { UserAuthRequest } from '../middleware/authMiddleware'

export const subscribeNewsletter = async (req: Request, res: Response) => {
  try {
    const { email } = req.body
    if (!email) {
      res.status(400).json({ success: false, message: 'Email required' })
      return
    }
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: {},
      create: { email }
    })
    res.json({ success: true, message: 'Subscribed successfully' })
  } catch (error) {
    console.error('NEWSLETTER ERROR:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}
export const getShippingConfig = async (req: Request, res: Response) => {
  try {
    const config = await prisma.shippingConfig.findFirst()
    res.json({
      success: true,
      data: config || { flat_fee: 250, free_shipping_above: 5000 }
    })
  } catch (error) {
    console.error('GET SHIPPING CONFIG ERROR:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

export const submitContact = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, subject, message } = req.body
    if (!name || !email || !message) {
      res.status(400).json({ success: false, message: 'Name, email and message required' })
      return
    }
    await prisma.contactMessage.create({
      data: { name, email, phone, subject, message }
    })
    res.json({ success: true, message: 'Message sent successfully' })
  } catch (error) {
    console.error('CONTACT ERROR:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

export const cancelOrder = async (req: UserAuthRequest, res: Response) => {
  try {
    const orderId = parseInt(req.params.id as string)
    const userId = req.user?.id

    const order = await prisma.order.findFirst({
      where: { id: orderId, user_id: userId }
    })

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' })
      return
    }

    if (!['PENDING', 'CONFIRMED'].includes(order.status)) {
      res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      })
      return
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' }
    })

    res.json({ success: true, message: 'Order cancelled successfully' })
  } catch (error) {
    console.error('CANCEL ORDER ERROR:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

export const getPublicSettings = async (req: Request, res: Response) => {
  try {
    const { group } = req.query;
    
    let whereClause = {};
    if (group && typeof group === 'string') {
      whereClause = { group };
    }

    const settings = await prisma.systemSetting.findMany({
      where: whereClause
    });

    const settingsMap: Record<string, string> = {};
    settings.forEach(s => {
      settingsMap[s.key] = s.value;
    });

    res.json({ success: true, data: settingsMap });
  } catch (error) {
    console.error('PUBLIC SETTINGS ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}
export const getAdminShippingConfig = async (req: Request, res: Response) => {
  try {
    const config = await prisma.shippingConfig.findFirst();
    res.json({ success: true, data: config || { flat_fee: 250, free_shipping_above: 5000, karachi_fee: 200, city_to_city_fee: 500 } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateShippingConfig = async (req: Request, res: Response) => {
  try {
    const { karachi_fee, city_to_city_fee, free_shipping_above } = req.body;
    const existing = await prisma.shippingConfig.findFirst();
    let config;
    if (existing) {
      config = await prisma.shippingConfig.update({
        where: { id: existing.id },
        data: {
          ...(karachi_fee !== undefined && { karachi_fee: Number(karachi_fee) }),
          ...(city_to_city_fee !== undefined && { city_to_city_fee: Number(city_to_city_fee) }),
          ...(free_shipping_above !== undefined && { free_shipping_above: Number(free_shipping_above) }),
          flat_fee: Number(city_to_city_fee) || existing.flat_fee
        }
      });
    } else {
      config = await prisma.shippingConfig.create({
        data: {
          flat_fee: Number(city_to_city_fee) || 500,
          free_shipping_above: Number(free_shipping_above) || 5000,
          karachi_fee: Number(karachi_fee) || 200,
          city_to_city_fee: Number(city_to_city_fee) || 500
        }
      });
    }
    res.json({ success: true, data: config });
  } catch (error) {
    console.error('UPDATE SHIPPING ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
