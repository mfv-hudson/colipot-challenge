import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Schedule a task to run at 9:00 AM every day
cron.schedule('0 9 * * *', async () => {
  console.log('Running cron job to update userBooking status from BOOKED to CANCELED');

  try {
    const today = new Date();
    const result = await prisma.userBooking.updateMany({
      where: {
        bookingDate: {
          lt: new Date(today.setHours(0, 0, 0, 0)),
        },
        status: 'BOOKED',
      },
      data: {
        status: 'CANCELED',
      },
    });

    console.log(`Updated ${result.count} userBookings to CANCELED`);
  } catch (error) {
    console.error('Error updating userBooking status:', error);
  }
});
