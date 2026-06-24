import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error('MONGO_URI environment variable is not set');
}

let isConnected = false;

export async function connectDB(): Promise<typeof mongoose> {
  if (isConnected) {
    return mongoose;
  }

  try {
    await mongoose.connect(MONGO_URI);
    isConnected = true;
    console.log('Database connected:', mongoose.connection.host);
    return mongoose;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}

export default mongoose;
