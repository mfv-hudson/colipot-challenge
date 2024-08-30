import QRCode from 'qrcode';
import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const generateQRCode = async (text: string) => {
  return await QRCode.toDataURL(text);
};

export const generateCheckinQRCode = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ status: 'error', message: 'User ID is required' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    const qrCodeData = await QRCode.toDataURL(userId.toString());
    res.status(201).json({ status: 'success', qrCodeData });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};
