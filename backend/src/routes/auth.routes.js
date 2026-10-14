import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  register,
  login,
  logout,
  getMe,
} from '../controllers/auth.controller.js';
import {
  validateRegisterInput,
  validateLoginInput,
} from '../validators/auth.validator.js';
import { authenticate } from '../middleware/authenticate.js';

const authRouter = Router();

// Rate limiter for authentication endpoints (prevent brute-force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 auth requests per window
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'test',
  message: {
    status: 'fail',
    message: 'Too many authentication attempts. Please try again after 15 minutes.',
  },
});

authRouter.post('/register', authLimiter, validateRegisterInput, register);
authRouter.post('/login', authLimiter, validateLoginInput, login);
authRouter.post('/logout', logout);
authRouter.get('/me', authenticate, getMe);

export default authRouter;
