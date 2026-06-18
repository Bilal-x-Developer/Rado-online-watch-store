import dotenv from 'dotenv';
import path from 'path';


dotenv.config({ path: path.resolve(process.cwd(), '.env') });
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import orderRoutes from './orderRoutes.js';
import adminRoutes from './adminRoutes.js';
import productRoutes from './productRoutes.js';
import { connectToMongo } from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({ ok: true });
});

app.use('/api', adminRoutes);
app.use('/api', orderRoutes);
app.use('/api', productRoutes);

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

// Start server and connect to MongoDB first
const startServer = async () => {
  await connectToMongo();

  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
    if (mongoose.connection.readyState === 1) {
      console.log('Connected to MongoDB');
    } else {
      console.log('Running without MongoDB - using in-memory storage');
    }
  });
};

startServer();



