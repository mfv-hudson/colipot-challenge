import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import QRCode from 'qrcode';

const prisma = new PrismaClient();

export const checkinByQRCode = async (req: Request, res: Response) => {
  try {
    const { qrCodeData } = req.body;
    const decodedData = await QRCode.toString(qrCodeData, { type: 'utf8' });

    // Assuming the QR code contains the user ID
    const userId = parseInt(decodedData, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ status: 'error', message: 'Invalid QR code data' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    const checkin = await prisma.checkin.create({
      data: {
        userId: user.id,
        seatId: 0, // Assuming seatId is not relevant for this check-in
      },
    });

    res.json({ status: 'success', checkin });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};
