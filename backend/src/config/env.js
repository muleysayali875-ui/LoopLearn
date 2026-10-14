import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env only if file exists (for local dev)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';

// In production, ensure critical environment variables are strictly defined
if (isProduction) {
  const missing = [];
  if (!process.env.MONGODB_URI) missing.push('MONGODB_URI');
  if (!process.env.JWT_SECRET) missing.push('JWT_SECRET');

  if (missing.length > 0) {
    throw new Error(
      `[FATAL] Missing required production environment variables: ${missing.join(', ')}`
    );
  }
}

export const env = {
  NODE_ENV,
  isProduction,
  PORT: parseInt(process.env.PORT, 10) || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/looplearnDB',
  JWT_SECRET: process.env.JWT_SECRET || 'dev_jwt_secret_key_change_in_production_32chars!',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  COOKIE_SECURE: process.env.COOKIE_SECURE === 'true' || isProduction,
};
