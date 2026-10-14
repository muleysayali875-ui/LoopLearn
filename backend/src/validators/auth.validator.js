import { ApiError } from '../utils/apiError.js';

export const validateRegisterInput = (req, res, next) => {
  const { name, email, password } = req.body || {};
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters long.' });
  } else if (name.trim().length > 60) {
    errors.push({ field: 'name', message: 'Name cannot exceed 60 characters.' });
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    errors.push({ field: 'email', message: 'Please provide a valid email address.' });
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters long.' });
  } else if (password.length > 128) {
    errors.push({ field: 'password', message: 'Password cannot exceed 128 characters.' });
  }

  if (errors.length > 0) {
    return next(ApiError.unprocessable('Registration validation failed', errors));
  }

  // Normalize inputs
  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();
  next();
};

export const validateLoginInput = (req, res, next) => {
  const { email, password } = req.body || {};
  const errors = [];

  if (!email || typeof email !== 'string' || !email.trim()) {
    errors.push({ field: 'email', message: 'Email is required.' });
  }

  if (!password || typeof password !== 'string' || !password) {
    errors.push({ field: 'password', message: 'Password is required.' });
  }

  if (errors.length > 0) {
    return next(ApiError.badRequest('Email and password are required', errors));
  }

  req.body.email = email.trim().toLowerCase();
  next();
};
