import express from 'express';
import { book, checkin, checkout } from '../controllers/booking';

const router = express.Router();

router.post('/book', book);
router.post('/checkin', checkin);
router.post('/checkout', checkout);

export default router;
