import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AdminAuthRequest } from '../middleware/authMiddleware';
import { logAdminAction } from '../utils/auditLog';
import axios from 'axios';
import { ENV } from '../config/env';
import { uploadToCloudinary } from '../utils/cloudinary';

const prisma = new PrismaClient();

const revalidateFrontend = async (tag: string) => {
  try {
    await axios.post('http://localhost:3000/api/revalidate', {
      tag,
      secret: ENV.REVALIDATION_SECRET
    }, { timeout: 5000 });
  } catch (error) {
    console.error('Failed to revalidate frontend cache:', error);
  }
};

export const getSettingsByGroup = async (req: AdminAuthRequest, res: Response) => {
  try {
    const { group } = req.query;
    let whereClause = {};
    if (group && typeof group === 'string') {
      whereClause = { group };
    }

    const settings = await prisma.systemSetting.findMany({
      where: whereClause
    });

    const settingsMap = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);

    res.json({ success: true, data: settingsMap });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateSettings = async (req: AdminAuthRequest, res: Response) => {
  try {
    const { settings, group } = req.body;
    // settings is an object of { key: value }
    const adminId = req.admin!.id;

    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ success: false, message: 'Settings must be an object' });
    }

    const updatedKeys: string[] = [];

    for (const [key, value] of Object.entries(settings)) {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);

      const existing = await prisma.systemSetting.findUnique({ where: { key } });

      await prisma.systemSetting.upsert({
        where: { key },
        update: { value: stringValue },
        create: {
          key,
          value: stringValue,
          group: group || 'GENERAL'
        }
      });

      updatedKeys.push(key);

      // Log action
      await logAdminAction(
        adminId,
        'UPDATE_SETTING',
        'SystemSetting',
        existing?.id,
        existing ? { value: existing.value } : null,
        { value: stringValue }
      );
    }

    // Attempt to revalidate frontends based on updated keys or groups
    if (group) {
      await revalidateFrontend(group.toLowerCase());
    } else {
      await revalidateFrontend('settings');
    }

    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ success: false, message: 'Failed to update settings' });
  }
};

export const uploadGenericImage = async (req: AdminAuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const result = await uploadToCloudinary(req.file.buffer, 'auriq_cms');
    
    await logAdminAction(
      req.admin!.id,
      'UPLOAD_IMAGE',
      'Media',
      undefined,
      undefined,
      { url: result.secure_url }
    );

    res.json({ success: true, url: result.secure_url });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ success: false, message: 'Failed to upload image' });
  }
};
