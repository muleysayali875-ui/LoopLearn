import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import authRouter from './routes/auth.routes.js';
import resourceRouter from './routes/resource.routes.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Security headers
app.use(helmet());

// CORS configuration
const allowedOrigins = [
  env.FRONTEND_URL,
  'https://loop-learn-tan.vercel.app',
  'https://looplear.netlify.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (such as mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        // Also allow Netlify preview deploys or any custom subdomains if configured
        (env.NODE_ENV !== 'production' && origin.startsWith('http://localhost:'))
      ) {
        return callback(null, true);
      }

      // In production, strictly match origin or explicit frontend domain
      if (allowedOrigins.some((allowed) => origin === allowed)) {
        return callback(null, true);
      }

      callback(new Error(`CORS policy: Origin ${origin} not allowed.`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Global general rate limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'test',
  message: {
    status: 'fail',
    message: 'Too many requests from this IP. Please try again later.',
  },
});
app.use('/api', generalLimiter);

// Body parsers with safe size limits
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'LoopLearn API is operational',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    uptime: Math.floor(process.uptime()),
  });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/resources', resourceRouter);

// 404 and Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
