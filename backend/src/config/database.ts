import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not defined');
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
    });
    isConnected = conn.connections[0].readyState === 1;
    console.log('\u2705 MongoDB connected successfully');
  } catch (error) {
    isConnected = false;
    console.error('\u274c MongoDB connection failed:', error);
    throw error;
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log('\u2705 MongoDB disconnected');
  } catch (error) {
    console.error('\u274c MongoDB disconnect failed:', error);
  }
};
