import express from 'express';
import { bookByQRCode, bookSeat } from '../controllers/booking';
import { authentication } from '../middleware/auth';

const router = express.Router();

router.post('/book-by-qrcode', [authentication], bookByQRCode);
router.post('/book', [authentication], bookSeat);

export default router;
