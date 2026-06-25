import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB(): Promise<typeof mongoose> {
  if (isConnected) {
    return mongoose;
  }

  const uri = import.meta.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI environment variable is not set');
  }

  try {
    await mongoose.connect(uri);
    isConnected = true;
    console.log('Database connected:', mongoose.connection.host);
    return mongoose;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}

export default mongoose;
