import express from 'express';
import { listSeats, addBooking } from '../controllers/seat';
import { authentication } from '../middleware/auth';

const router = express.Router();

router.get('/list', [authentication], listSeats);
router.post('/add-booking', [authentication], addBooking);

export default router;
