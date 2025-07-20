import mongoose from 'mongoose'
import { ensureIndexes } from '../models/post-model.js'

const connectDB = async () => {
  try {
    console.log('Connecting to database...')

    // Set mongoose options for better performance
    mongoose.set('strictQuery', false)

    // More optimized connection options
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // These options improve performance
      connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
      socketTimeoutMS: 45000,  // Close sockets after 45 seconds of inactivity
      maxPoolSize: 50,         // Maintain up to 50 socket connections
      minPoolSize: 10,         // Maintain at least 10 socket connections
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      heartbeatFrequencyMS: 10000     // How often to check if we're connected
    })

    console.log(`Database connected: ${conn.connection.host}`)

    // Create indexes for better query performance
    await ensureIndexes()

    // Handle connection errors after initial connection
    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err)
    })

    // Log when disconnected
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected')
    })

    // Handle process termination - close connection gracefully
    process.on('SIGINT', async () => {
      await mongoose.connection.close()
      console.log('MongoDB connection closed due to app termination')
      process.exit(0)
    })

  } catch (err) {
    console.error('Database connection error:', err)
    // Retry logic - wait 5 seconds before exiting
    console.log('Retrying connection in 5 seconds...')
    setTimeout(() => {
      process.exit(1)
    }, 5000)
  }
}

export default connectDB
