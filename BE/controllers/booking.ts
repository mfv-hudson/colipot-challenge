// import { PrismaClient } from '@prisma/client';
// import { Request, Response } from 'express';
// import { body, validationResult } from 'express-validator';

// const prisma = new PrismaClient();

// export const book = [
//   body('userId').isInt().withMessage('User ID must be an integer'),
//   body('seatId').isInt().withMessage('Seat ID must be an integer'),
//   async (req: Request, res: Response) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { userId, seatId } = req.body;
//     const booking = await prisma.userBooking.create({
//       data: {
//         user: { connect: { id: userId } },
//         seat: { connect: { id: seatId } },
//       },
//     });
//     res.json(booking);
//   }
// ];

// export const checkin = [
//   body('bookingId').isInt().withMessage('Booking ID must be an integer'),
//   async (req: Request, res: Response) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { bookingId } = req.body;
//     const booking = await prisma.userBooking.update({
//       where: { id: bookingId },
//       data: { checkIn: new Date() },
//     });
//     res.json(booking);
//   }
// ];

// export const checkout = [
//   body('bookingId').isInt().withMessage('Booking ID must be an integer'),
//   async (req: Request, res: Response) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { bookingId } = req.body;
//     const booking = await prisma.userBooking.update({
//       where: { id: bookingId },
//       data: { checkOut: new Date() },
//     });
//     res.json(booking);
//   }
// ];
