import { AppEnv } from '@/config/env';
import 'dotenv/config';
import mongoose from 'mongoose'; // Imports Mongoose ORM.

const MONGODB_URI = AppEnv.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('❌ Please define the MONGODB_URI environment variable in your .env.local');
}

// 👇 Tell TypeScript that we're adding a custom global variable
declare global {
  var mongoose:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

// A global cache to prevent and refuse multiple DB connections during hot reload (important in Next.js).
let cached = global.mongoose as {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Connects to MongoDB using Mongoose.
 * Uses a global cached connection in dev mode to prevent multiple instances.
 */
export async function connectDB() {
  if (cached.conn) {
    // ✅ Already connected
    // Returns the existing connection if already open.
    return cached.conn;
  }

  if (!cached.promise) {
    // 🔌 If not connected, Establish new connection
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: 'expense-tracker', // Ensures all collections are created inside your intended database.
      bufferCommands: false, // Prevents Mongoose from queuing commands before the DB connects (helps catch errors early).
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}
