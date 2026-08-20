import mongoose from 'mongoose';

/**
 * @file db.js
 * @description Production-grade MongoDB connection module using Mongoose.
 * Manages database connection pool, event listeners, and graceful connection handling.
 */
const connectDB = async () => {
  try {
    // Enable strict query filtering to prevent un-indexed / unintended schema bypasses
    mongoose.set('strictQuery', true);

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Production pool and timeout configurations
      maxPoolSize: 10, // Maintain up to 10 socket connections for concurrency
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });

    console.log(`[Database] MongoDB Connected Successfully: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`[Database Error] MongoDB Connection Failed: ${error.message}`);
    // Exit process with failure code so orchestrator (PM2, K8s, Docker) can restart process
    process.exit(1);
  }
};

// Listen for Mongoose disconnection events after initial connection
mongoose.connection.on('disconnected', () => {
  console.warn('[Database Warning] MongoDB connection lost. Attempting reconnect...');
});

// Listen for process termination signals to gracefully close DB connection
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('[Database] MongoDB connection closed due to application termination.');
  process.exit(0);
});

export default connectDB;
