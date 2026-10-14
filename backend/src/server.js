import http from 'http';
import app from './app.js';
import { env } from './config/env.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';

let server;

const startServer = async () => {
  try {
    // 1. Connect to MongoDB
    await connectDatabase();

    // 2. Start HTTP server
    server = http.createServer(app);
    server.listen(env.PORT, () => {
      console.log(`[LoopLearn API] Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
      console.log(`[LoopLearn API] Health check available at http://localhost:${env.PORT}/api/health`);
    });
  } catch (error) {
    console.error('[LoopLearn API] Failed to start server:', error.message);
    process.exit(1);
  }
};

// Graceful shutdown handling
const shutdown = async (signal) => {
  console.log(`\n[LoopLearn API] Received ${signal}. Starting graceful shutdown...`);

  if (server) {
    server.close(async () => {
      console.log('[LoopLearn API] HTTP server closed.');
      try {
        await disconnectDatabase();
        console.log('[LoopLearn API] MongoDB connection closed.');
        process.exit(0);
      } catch (err) {
        console.error('[LoopLearn API] Error during database disconnect:', err.message);
        process.exit(1);
      }
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

startServer();
