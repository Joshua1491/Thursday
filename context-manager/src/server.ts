import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { app } from './app';

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI!;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }); 