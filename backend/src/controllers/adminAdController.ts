import { Request, Response } from 'express';
import prisma from '../config/database';
import { uploadToCloudinary } from '../utils/cloudinary';
import axios from 'axios';
import { ENV } from '../config/env';
import { logAdminAction } from '../utils/auditLog';

const revalidateFrontend = async (tag: string) => {
  try {
    await axios.post(`${ENV.FRONTEND_URL}/api/revalidate`, {
      tag,
      secret: ENV.REVALIDATION_SECRET
    });
  } catch (error) {
    console.error('Failed to revalidate frontend cache:', error);
  }
};

export const createAd = async (req: Request, res: Response) => {
  try {
    const { title, link_url, position, is_active, button_text, sort_order, starts_at, ends_at } = req.body;
    
    // Using upload.fields() means req.files is a dictionary
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    
    const imageFile = files?.['image']?.[0];
    const mobileImageFile = files?.['mobile_image']?.[0];

    if (!imageFile && position !== 'ANNOUNCEMENT_BAR') {
      res.status(400).json({ success: false, message: 'Image is required for Hero ads' });
      return;
    }

    let secure_url = "";
    if (imageFile) {
      const uploadResult = await uploadToCloudinary(imageFile.buffer, 'auriq_ads');
      secure_url = uploadResult.secure_url;
    }

    let mobile_secure_url = null;
    if (mobileImageFile) {
      const uploadResult = await uploadToCloudinary(mobileImageFile.buffer, 'auriq_ads');
      mobile_secure_url = uploadResult.secure_url;
    }

    const ad = await prisma.ad.create({
      data: {
        title,
        link_url: link_url || null,
        position,
        is_active: is_active === 'true' || is_active === true,
        image_url: secure_url,
        mobile_image_url: mobile_secure_url,
        button_text: button_text || null,
        sort_order: sort_order ? parseInt(sort_order) : 0,
        starts_at: starts_at ? new Date(starts_at) : null,
        ends_at: ends_at ? new Date(ends_at) : null,
      }
    });

    await revalidateFrontend('ads');

    await logAdminAction((req as any).admin.id, 'CREATE_AD', 'Ad', ad.id, null, { title: ad.title });

    res.json({ success: true, data: ad });
  } catch (error) {
    console.error('CREATE AD ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getAllAds = async (req: Request, res: Response) => {
  try {
    const ads = await prisma.ad.findMany({
      orderBy: { created_at: 'desc' }
    });
    res.json({ success: true, data: ads });
  } catch (error) {
    console.error('GET ALL ADS ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteAd = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await prisma.ad.findUnique({ where: { id: parseInt(id as string) } });
    await prisma.ad.delete({ where: { id: parseInt(id as string) } });
    await revalidateFrontend('ads');
    await logAdminAction((req as any).admin.id, 'DELETE_AD', 'Ad', parseInt(id as string), existing, null);
    res.json({ success: true, message: 'Ad deleted' });
  } catch (error) {
    console.error('DELETE AD ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const toggleAdStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;
    const ad = await prisma.ad.update({
      where: { id: parseInt(id as string) },
      data: { is_active: is_active === 'true' || is_active === true }
    });
    await revalidateFrontend('ads');
    await logAdminAction((req as any).admin.id, 'TOGGLE_AD_STATUS', 'Ad', ad.id, null, { is_active: ad.is_active });
    res.json({ success: true, data: ad });
  } catch (error) {
    console.error('TOGGLE AD ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
