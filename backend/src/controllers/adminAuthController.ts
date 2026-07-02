import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import { ENV } from '../config/env';

export const refreshAdminToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).json({ success: false, message: 'Refresh token required' });
      return;
    }

    let decoded: any;
    try {
      decoded = jwt.verify(refreshToken, ENV.JWT_REFRESH_SECRET);
    } catch {
      res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
      return;
    }

    const storedToken = await prisma.adminRefreshToken.findFirst({
      where: { token: refreshToken, admin_id: decoded.id, expires_at: { gt: new Date() } }
    });

    if (!storedToken) {
      res.status(401).json({ success: false, message: 'Refresh token revoked or expired' });
      return;
    }

    const admin = await prisma.admin.findUnique({ where: { id: decoded.id } });
    if (!admin) {
      res.status(401).json({ success: false, message: 'Admin not found' });
      return;
    }

    const accessToken = jwt.sign(
      { id: admin.id, email: admin.email, role: 'ADMIN' },
      ENV.JWT_ACCESS_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ success: true, data: { accessToken } });
  } catch (error) {
    console.error('ADMIN REFRESH TOKEN ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Retry on DB cold-start — Neon free tier takes ~10s to wake from sleep
    let admin;
    const maxAttempts = 6;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        admin = await prisma.admin.findUnique({ where: { email } });
        break;
      } catch (dbErr: any) {
        const isConnectionError = dbErr?.code === 'P1001' ||
          dbErr?.message?.includes("Can't reach database server") ||
          dbErr?.constructor?.name === 'PrismaClientInitializationError';
        if (isConnectionError && attempt < maxAttempts) {
          await new Promise(r => setTimeout(r, 2500));
        } else {
          throw dbErr;
        }
      }
    }
    if (!admin) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const accessToken = jwt.sign(
      { id: admin.id, email: admin.email, role: 'ADMIN' },
      ENV.JWT_ACCESS_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: admin.id, role: 'ADMIN' },
      ENV.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // Extract device/browser/IP info
    const userAgent = req.headers['user-agent'] || 'Unknown Device';
    let browser = 'Unknown Browser';
    if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';

    const ipAddress = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown IP') as string;

    try {
      await prisma.adminRefreshToken.create({
        data: {
          token: refreshToken,
          admin_id: admin.id,
          device_info: userAgent.substring(0, 255),
          browser,
          ip_address: ipAddress,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
      });

      // Update last login
      await prisma.admin.update({
        where: { id: admin.id },
        data: { last_login: new Date() }
      });
    } catch (dbError) {
      console.warn('Could not save refresh token to DB or update last_login, skipping:', dbError);
    }

    res.json({
      success: true,
      data: {
        admin: { 
          id: admin.id, 
          first_name: admin.first_name, 
          last_name: admin.last_name, 
          email: admin.email,
          profile_image_url: admin.profile_image_url
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('ADMIN LOGIN ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
