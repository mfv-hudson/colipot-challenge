import express from 'express';
import { generateQRCode } from '../controllers/qrcode';

const router = express.Router();

router.get('/generate', generateQRCode);

export default router;
