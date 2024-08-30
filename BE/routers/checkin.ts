import express from 'express';
import { checkinByQRCode, getTodayCheckins, userCheckin } from '../controllers/checkin';
import { authentication } from '../middleware/auth';

const router = express.Router();

router.post('/checkin-by-qrcode', checkinByQRCode);
router.get('/today-checkins', [authentication], getTodayCheckins);
router.post('/', [authentication], userCheckin);

export default router;
