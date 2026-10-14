import {
  registerUser,
  loginUser,
  getCookieOptions,
} from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const { user, token } = await registerUser({ name, email, password });

  res.cookie('token', token, getCookieOptions());

  res.status(201).json({
    status: 'success',
    message: 'Account registered successfully.',
    data: {
      user,
      token,
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await loginUser({ email, password });

  res.cookie('token', token, getCookieOptions());

  res.status(200).json({
    status: 'success',
    message: 'Logged in successfully.',
    data: {
      user,
      token,
    },
  });
});

export const logout = asyncHandler(async (req, res) => {
  const cookieOptions = getCookieOptions();
  res.clearCookie('token', {
    httpOnly: cookieOptions.httpOnly,
    secure: cookieOptions.secure,
    sameSite: cookieOptions.sameSite,
    path: '/',
  });

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully.',
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        createdAt: req.user.createdAt,
      },
    },
  });
});
