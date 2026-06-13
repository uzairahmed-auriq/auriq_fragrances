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