import mongoose from 'mongoose';

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.8.2';

let isConnecting = false;

export async function connectToMongo() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (isConnecting) {

    while (isConnecting && mongoose.connection.readyState !== 1) {
      await new Promise((r) => setTimeout(r, 100));
    }
    return mongoose.connection;
  }

  isConnecting = true;
  try {
    await mongoose.connect(MONGODB_URI, {
    });
    console.log('Connected to MongoDB');
    return mongoose.connection;
  } catch (err) {
    console.warn('MongoDB connection failed:', err.message);
    console.log('Continuing without MongoDB - using in-memory storage');
    // Don't throw, allow app to run without DB for now
    return null;
  } finally {
    isConnecting = false;
  }
}


