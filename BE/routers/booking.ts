import express from 'express';
import { bookByQRCode } from '../controllers/booking';
import { authentication } from '../middleware/auth';

const router = express.Router();

router.post('/book-by-qrcode', [authentication], bookByQRCode);

export default router;
