import express from 'express';
import { generateCheckinQRCode, generateBookingQRCode } from '../controllers/qrcode';
import { authentication } from '../middleware/auth';

const router = express.Router();

router.get('/generate-checkin', [authentication], generateCheckinQRCode); // New route for check-in QR code
router.post('/generate-booking', [authentication], generateBookingQRCode); // New route for booking QR code

export default router;
