import mongoose, { Mongoose } from "mongoose";

/**
 * Global interface to extend NodeJS global type
 * Used to store the cached mongoose connection in development
 */
declare global {
  // eslint-disable-next-line no-var
  var mongoose:
    | {
        conn: Mongoose | null;
        promise: Promise<Mongoose> | null;
      }
    | undefined;
}

/**
 * MongoDB connection string
 * Falls back to a local MongoDB connection if MONGODB_URI is not provided
 */
const MONGODB_URI: string =
  process.env.MONGODB_URI || "mongodb://localhost:27017/dev_evens_app";

/**
 * Cached connection object
 * In development, Next.js can trigger multiple module reloads, which would
 * create multiple database connections. This caching mechanism prevents that.
 */
let cached: {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
} = global.mongoose || { conn: null, promise: null };

/**
 * Establishes a connection to MongoDB using Mongoose
 *
 * This function implements connection caching to prevent multiple connections
 * during development hot-reloads. It reuses existing connections when available.
 *
 * @returns {Promise<Mongoose>} The Mongoose connection instance
 * @throws {Error} If MONGODB_URI is missing or connection fails
 */
async function connectDB(): Promise<Mongoose> {
  // If already connected, return the cached connection
  if (cached.conn) {
    return cached.conn;
  }

  // If no connection promise exists, create a new one
  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false, // Disable mongoose buffering
      maxPoolSize: 10, // Maintain up to 10 socket connections
    };

    // Create connection promise
    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance: Mongoose) => {
        console.log("✅ MongoDB connected successfully");
        return mongooseInstance;
      })
      .catch((error: Error) => {
        // Clear the promise on error to allow retry
        cached.promise = null;
        console.error("❌ MongoDB connection error:", error);
        throw error;
      });
  }

  try {
    // Wait for the connection promise to resolve
    cached.conn = await cached.promise;
  } catch (error) {
    // If connection fails, clear cached promise
    cached.promise = null;
    throw error;
  }

  // In development, store cached connection in global to persist across hot-reloads
  if (!global.mongoose) {
    global.mongoose = cached;
  }

  return cached.conn;
}

/**
 * Closes the MongoDB connection gracefully
 * Useful for cleanup in testing or application shutdown
 *
 * @returns {Promise<void>}
 */
export async function disconnectDB(): Promise<void> {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
    console.log("✅ MongoDB disconnected");
  }
}

// Export the connection function as default
export default connectDB;
