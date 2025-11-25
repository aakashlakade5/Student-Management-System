import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = () => {
  mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('✅ Database Connected'))
  .catch((err) => console.error('❌ DB Connection Error:', err.message));
};
