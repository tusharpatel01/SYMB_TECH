import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './DB/db.js';
import orderRoutes from './routes/orderRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';


dotenv.config();

// Connect to Mongo
connectDB();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/orders', orderRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ success: true, status: 'API is running', timestamp: new Date() });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});