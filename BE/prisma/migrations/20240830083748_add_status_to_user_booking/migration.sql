-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('BOOKED', 'CANCELED', 'CHECKED');

-- AlterTable
ALTER TABLE "UserBooking" ADD COLUMN     "status" "BookingStatus" NOT NULL DEFAULT 'BOOKED';
