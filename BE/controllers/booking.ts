import { PrismaClient } from '@prisma/client';
import { Response } from 'express';
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

    const bookingDateObj = new Date(bookingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to the start of the day

    // Check if the booking date is in the past
    if (bookingDateObj < today) {
      return res.status(400).json({ status: 'error', message: 'Booking date cannot be in the past' });
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

export const bookSeat = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.user;
    const { seatId, bookingDate } = req.body;

    // Validate seatId and bookingDate
    if (!seatId || isNaN(parseInt(seatId, 10))) {
      return res.status(400).json({ status: 'error', message: 'Invalid seat ID' });
    }
    if (!bookingDate || isNaN(Date.parse(bookingDate))) {
      return res.status(400).json({ status: 'error', message: 'Invalid booking date' });
    }

    const bookingDateObj = new Date(bookingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to the start of the day

    // Check if the booking date is in the past
    if (bookingDateObj < today) {
      return res.status(400).json({ status: 'error', message: 'Booking date cannot be in the past' });
    }

    // Check if the user has already checked in on the same day
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const existingCheckin = await prisma.checkin.findFirst({
      where: {
        userId: id,
        time: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    // Determine the booking status
    const bookingStatus = existingCheckin ? 'CHECKED' : 'BOOKED';

    // Check if the seat is already booked for the given date
    const existingBooking = await prisma.userBooking.findFirst({
      where: {
        userId: id,
        status: {
          not: 'CANCELED',
        },
        bookingDate: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });

    if (existingBooking) {
      return res.status(400).json({ status: 'error', message: 'Seat already booked for the given date' });
    }

   // Create the booking
   const booking = await prisma.userBooking.create({
    data: {
      userId: id,
      seatId: seatId,
      bookingDate: new Date(bookingDate),
      status: bookingStatus,
    },
  });

  res.json({ status: 'success', booking });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const cancelBooking = async (req: AuthenticatedRequest, res: Response) => {
  const { bookingId } = req.body;
  const userId = req.user.id;

  try {
    // Check if the booking exists, belongs to the user, and is in BOOKED status
    const existingBooking = await prisma.userBooking.findFirst({
      where: {
        id: bookingId,
        userId: userId,
        status: 'BOOKED',
      },
    });

    if (!existingBooking) {
      return res.status(400).json({ status: 'error', message: 'Booking not found or not in BOOKED status' });
    }

    // Update the booking status to CANCELED
    const booking = await prisma.userBooking.update({
      where: { id: bookingId },
      data: { status: 'CANCELED' },
    });

    res.json({ status: 'success', booking });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};
