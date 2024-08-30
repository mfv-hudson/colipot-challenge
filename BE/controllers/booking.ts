import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const book = async (req: Request, res: Response) => {
  const { userId, seat } = req.body;
  const booking = await prisma.booking.create({
    data: { userId, seat },
  });
  res.json(booking);
};

export const checkin = async (req: Request, res: Response) => {
  const { bookingId } = req.body;
  const booking = await prisma.booking.update({
    where: { id: bookingId },
    data: { checkIn: new Date() },
  });
  res.json(booking);
};

export const checkout = async (req: Request, res: Response) => {
  const { bookingId } = req.body;
  const booking = await prisma.booking.update({
    where: { id: bookingId },
    data: { checkOut: new Date() },
  });
  res.json(booking);
};
