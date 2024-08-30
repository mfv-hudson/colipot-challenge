import express from 'express';
import { bookByQRCode, bookSeat, cancelBooking } from '../controllers/booking';
import { authentication } from '../middleware/auth';

const router = express.Router();

router.post('/book-by-qrcode', [authentication], bookByQRCode);
router.post('/', [authentication], bookSeat);
router.post('/cancel', [authentication], cancelBooking);

export default router;
