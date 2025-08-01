import mongoose from 'mongoose';
import { ensureIndexes } from '../models/post-model.js';

// Cache the database connection to reuse across function invocations.
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    console.log('=> using cached database connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable Mongoose's buffering so you know right away if you're not connected.
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    };

    mongoose.set('strictQuery', false);
    
    console.log('=> creating new database connection');
    cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then(async (mongooseInstance) => {
      console.log('Database connected successfully');
      await ensureIndexes();
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
