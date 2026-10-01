import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import { globalErrorHandler, notFoundHandler } from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import atsRoutes from './routes/atsRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import roadmapRoutes from './routes/roadmapRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import versionRoutes from './routes/versionRoutes.js';

// Load environment variables before initializing app modules
dotenv.config();

// Initialize Database Connection
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// 1. Security Middleware - Helmet HTTP Headers
app.use(helmet());

// 2. CORS Middleware - Dynamic origin resolution for local dev & Vercel deployment
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((url) => url.trim().replace(/\/$/, ''))
  : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, server-to-server)
      if (!origin) return callback(null, true);
      const normalizedOrigin = origin.replace(/\/$/, '');
      if (
        allowedOrigins.includes(normalizedOrigin) ||
        allowedOrigins.includes('*') ||
        NODE_ENV !== 'production'
      ) {
        return callback(null, true);
      }
      // Allow Vercel preview domains if matches vercel.app
      if (normalizedOrigin.endsWith('.vercel.app')) {
        return callback(null, true);
      }
      return callback(null, true);
    },
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

// 6. API Routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/ats', atsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/versions', versionRoutes);

// 7. Handle 404 Unmapped Routes
app.use(notFoundHandler);

// 7. Centralized Global Error Handling Middleware (must be registered last)
app.use(globalErrorHandler);

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
