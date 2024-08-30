import express from 'express';
import { generateCheckinQRCode, generateQRCode } from '../controllers/qrcode';
import { authentication } from '../middleware/auth';

const router = express.Router();

router.get('/generate', generateQRCode);
router.get('/generate-checkin', [authentication], generateCheckinQRCode); // New route for check-in QR code

export default router;
