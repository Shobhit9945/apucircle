import mongoose from 'mongoose';

export async function connectDB() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is required. APUCircle uses MongoDB Atlas and does not include a local database fallback.');
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.MONGODB_DB_NAME || undefined,
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000
  });
}
