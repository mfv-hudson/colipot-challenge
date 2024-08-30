import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import Joi from 'joi';
import QRCode from 'qrcode';
import { AuthenticatedRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const bookByQRCode = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { qrCodeData } = req.body;

    // Decode the QR code data
    const decodedData = JSON.parse(await QRCode.toString(qrCodeData, { type: 'utf8' }));

    const { seatId, bookingDate } = decodedData;

    if (!seatId || !bookingDate) {
      return res.status(400).json({ status: 'error', message: 'seatId and bookingDate are required' });
    }

    // Check if the seat exists
    const seat = await prisma.seat.findUnique({ where: { id: seatId } });
    if (!seat) {
      return res.status(404).json({ status: 'error', message: 'Seat not found' });
    }

    const userExistingBooking = await prisma.userBooking.findFirst({
      where: {
        userId: req.user.id,
        bookingDate: new Date(bookingDate),
      },
    });

    if (userExistingBooking) {
      return res.status(400).json({ status: 'error', message: 'User has already booked a seat on the given date' });
    }

    // Check if the seat is available for the given bookingDate
    const existingBooking = await prisma.userBooking.findFirst({
      where: {
        seatId,
        bookingDate: new Date(bookingDate),
      },
    });

    if (existingBooking) {
      return res.status(400).json({ status: 'error', message: 'Seat is already booked for the given date' });
    }

    // Create the booking
    const booking = await prisma.userBooking.create({
      data: {
        userId: req.user.id, // Assuming user ID is available in the request object
        seatId,
        bookingDate: new Date(bookingDate),
      },
    });

    res.status(201).json({ status: 'success', booking });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};
