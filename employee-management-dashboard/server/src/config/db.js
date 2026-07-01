import mongoose from 'mongoose';

/**
 * Establish a single shared connection to MongoDB.
 * We keep this in its own module so both the server and the seed
 * script can reuse the exact same connection logic.
 */
export const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is not defined. Copy .env.example to .env.');
  }

  // strictQuery avoids deprecation warnings and silently-dropped filters.
  mongoose.set('strictQuery', true);

  const conn = await mongoose.connect(uri);
  console.log(`✅ MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  return conn;
};
