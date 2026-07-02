import { Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../config/database';
import { UserAuthRequest } from '../middleware/authMiddleware';

export const getProfile = async (req: UserAuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        is_active: true,
        created_at: true,
      }
    });

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error('GET PROFILE ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateProfile = async (req: UserAuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { name, phone } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { name, phone },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      }
    });

    res.json({ success: true, data: user, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('UPDATE PROFILE ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updatePassword = async (req: UserAuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 8) {
      res.status(400).json({ success: false, message: 'New password must be at least 8 characters long' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.password) {
      res.status(400).json({ success: false, message: 'Password update not available' });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      res.status(400).json({ success: false, message: 'Incorrect current password' });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    // Invalidate all other sessions so a stolen/old refresh token can't survive the change
    await prisma.refreshToken.deleteMany({ where: { user_id: userId } });

    res.json({ success: true, message: 'Password updated successfully. Please sign in again.' });
  } catch (error) {
    console.error('UPDATE PASSWORD ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getAddresses = async (req: UserAuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const addresses = await prisma.address.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' }
    });

    res.json({ success: true, data: addresses });
  } catch (error) {
    console.error('GET ADDRESSES ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createAddress = async (req: UserAuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { label, full_name, phone, street, city, province, postal_code, is_default } = req.body;

    if (is_default) {
      // Unset other defaults if this one is set to default
      await prisma.address.updateMany({
        where: { user_id: userId, is_default: true },
        data: { is_default: false }
      });
    }

    const address = await prisma.address.create({
      data: {
        user_id: userId,
        label: label || 'Home',
        full_name,
        phone,
        street,
        city,
        province,
        postal_code,
        is_default: is_default || false
      }
    });

    res.json({ success: true, data: address, message: 'Address created successfully' });
  } catch (error) {
    console.error('CREATE ADDRESS ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateAddress = async (req: UserAuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const addressId = parseInt(req.params.id as string);
    const { label, full_name, phone, street, city, province, postal_code, is_default } = req.body;

    const existing = await prisma.address.findUnique({ where: { id: addressId } });
    if (!existing || existing.user_id !== userId) {
      res.status(404).json({ success: false, message: 'Address not found' });
      return;
    }

    if (is_default && !existing.is_default) {
      await prisma.address.updateMany({
        where: { user_id: userId, is_default: true },
        data: { is_default: false }
      });
    }

    const address = await prisma.address.update({
      where: { id: addressId },
      data: { label, full_name, phone, street, city, province, postal_code, is_default }
    });

    res.json({ success: true, data: address, message: 'Address updated successfully' });
  } catch (error) {
    console.error('UPDATE ADDRESS ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteAddress = async (req: UserAuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const addressId = parseInt(req.params.id as string);

    const existing = await prisma.address.findUnique({ where: { id: addressId } });
    if (!existing || existing.user_id !== userId) {
      res.status(404).json({ success: false, message: 'Address not found' });
      return;
    }

    await prisma.address.delete({ where: { id: addressId } });

    res.json({ success: true, message: 'Address deleted successfully' });
  } catch (error) {
    console.error('DELETE ADDRESS ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
