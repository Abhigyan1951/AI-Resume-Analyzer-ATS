import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import connectDB from './config/db.js';

// Load environment variables before initializing app modules
dotenv.config();

// Initialize Database Connection
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// 1. Security Middleware - Helmet HTTP Headers
app.use(helmet());

// 2. CORS Middleware - Restrict origin access to configured client URL
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 3. HTTP Request Logging - Morgan
const logFormat = NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(logFormat));

// 4. Body Parsers - JSON & URL-encoded payloads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 5. Health Check Endpoint
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatusMap = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting',
  };

  res.status(200).json({
    status: 'ok',
    service: 'AI Resume Analyzer & ATS Optimization API',
    environment: NODE_ENV,
    database: dbStatusMap[dbState] || 'Unknown',
    timestamp: new Date().toISOString(),
  });
});

// Start Express Server
const server = app.listen(PORT, () => {
  console.log(`[Server] API running in ${NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections gracefully
process.on('unhandledRejection', (err) => {
  console.error(`[Unhandled Rejection] Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

export default app;
