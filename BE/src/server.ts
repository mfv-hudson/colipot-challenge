import express from 'express';
import authRoutes from '../routers/auth';
import bookingRoutes from '../routers/booking';
import qrCodeRoutes from '../routers/qrcode';

const app = express();
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/booking', bookingRoutes);
app.use('/qrcode', qrCodeRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
