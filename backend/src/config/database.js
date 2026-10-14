import mongoose from 'mongoose';
import { env } from './env.js';

let isConnected = false;

export const connectDatabase = async () => {
  if (isConnected) {
    return mongoose.connection;
  }

  try {
    const options = {
      autoIndex: true,
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000,
    };

    mongoose.connection.on('connected', () => {
      isConnected = true;
      console.log('MongoDB connection established successfully.');
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      isConnected = false;
      console.warn('MongoDB disconnected.');
    });

    await mongoose.connect(env.MONGODB_URI, options);
    return mongoose.connection;
  } catch (error) {
    console.error(`Failed to connect to MongoDB: ${error.message}`);
    // If not in test environment, exit gracefully
    if (env.NODE_ENV !== 'test') {
      process.exit(1);
    }
    throw error;
  }
};

export const disconnectDatabase = async () => {
  if (isConnected || mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    isConnected = false;
  }
};
