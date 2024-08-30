import { PrismaClient } from '@prisma/client';
import { Response } from 'express';
import QRCode from 'qrcode';
import { AuthenticatedRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const getTodayCheckins = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.user;
    const { date } = req.query;

    // Parse the date from the query string or use the current date
    const queryDate = date ? new Date(date as string) : new Date();
    if (isNaN(queryDate.getTime())) {
      return res.status(400).json({ status: 'error', message: 'Invalid date format' });
    }

    // Get the start and end of the specified day
    const startDate = new Date(queryDate);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1);

    // Fetch check-ins for the specified day
    const checkins = await prisma.checkin.findMany({
      where: {
        userId: id,
        time: {
          gte: startDate,
          lt: endDate,
        },
      },
    });

    res.json({ status: 'success', checkins });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const checkinByQRCode = async (req: AuthenticatedRequest, res: Response) => {
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
      },
    });

    res.json({ status: 'success', checkin });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const userCheckin = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.user;

    // Create a new checkin record
    const checkin = await prisma.checkin.create({
      data: {
        userId: id,
        time: new Date(),
      },
    });

    // Find the user's booking for the current date
    const today = new Date();
    const booking = await prisma.userBooking.findFirst({
      where: {
        userId: id,
        bookingDate: {
          gte: new Date(today.setHours(0, 0, 0, 0)),
          lte: new Date(today.setHours(23, 59, 59, 999)),
        },
        status: 'BOOKED',
      },
    });

    // If a booking is found, update its status to CHECKED
    if (booking) {
      await prisma.userBooking.update({
        where: {
          id: booking.id,
        },
        data: {
          status: 'CHECKED',
        },
      });
    }

    res.json({ status: 'success', checkin });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};
