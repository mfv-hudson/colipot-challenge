import express from 'express';
import { checkinByQRCode } from '../controllers/checkin';

const router = express.Router();

router.post('/checkin-by-qrcode', checkinByQRCode);

export default router;
