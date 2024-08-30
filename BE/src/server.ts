import express from 'express';
import cors from 'cors';
import authRoutes from '../routers/auth';
import bookingRoutes from '../routers/booking';
import qrCodeRoutes from '../routers/qrcode';
import departmentRouter from '../routers/department';
import checkinRoutes from '../routers/checkin';
import seatRoutes from '../routers/seat';

const app = express();
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// Routes
app.use('/auth', authRoutes);
app.use('/booking', bookingRoutes);
app.use('/qrcode', qrCodeRoutes);
app.use('/department', departmentRouter);
app.use('/checkin', checkinRoutes);
app.use('/seat', seatRoutes);

const HOST = '0.0.0.0'; // Bind to all network interfaces
app.listen(3000, HOST, () => {
  console.log(`Server is running on port 3000`);
});
