import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import Joi from 'joi';

const prisma = new PrismaClient();

const listSeatsSchema = Joi.object({
  status: Joi.string().valid('available', 'booked').optional(),
  date: Joi.date().optional(),
});

export const listSeats = async (req: Request, res: Response) => {
  try {
    const { status, date } = req.query;

    // Validate query parameters
    const { error } = listSeatsSchema.validate({ status, date });
    if (error) {
      return res.status(400).json({ status: 'error', message: error.details[0].message });
    }

    // Fetch all seats
    const seats = await prisma.seat.findMany({});

    // Build the query for userBookings
    let userBookingsQuery: any = {};
    if (date) {
      const startDate = new Date(date as string);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 1);

      console.log(startDate, endDate)

      userBookingsQuery = {
        where: {
          bookingDate: {
            gte: startDate,
            lt: endDate,
          },
        },
      };
    }

    // Fetch all userBookings
    const userBookings = await prisma.userBooking.findMany(userBookingsQuery);

    // Return both seats and userBookings
    res.json({ seats, userBookings });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

const addBookingSchema = Joi.object({
  userId: Joi.number().integer().required(),
  seatId: Joi.number().integer().required(),
  bookingDate: Joi.date().required(),
});

export const addBooking = async (req: Request, res: Response) => {
  try {
    const { userId, seatId, bookingDate } = req.body;

    // Validate request body
    const { error } = addBookingSchema.validate({ userId, seatId, bookingDate });
    if (error) {
      return res.status(400).json({ status: 'error', message: error.details[0].message });
    }

    // Check if the seat exists
    const seat = await prisma.seat.findUnique({ where: { id: seatId } });
    if (!seat) {
      return res.status(404).json({ status: 'error', message: 'Seat not found' });
    }

    // Check if the user has already booked any seat on the given bookingDate
    const userExistingBooking = await prisma.userBooking.findFirst({
      where: {
        userId,
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
        userId,
        seatId,
        bookingDate: new Date(bookingDate),
      },
    });

    res.status(201).json({ status: 'success', booking });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};
