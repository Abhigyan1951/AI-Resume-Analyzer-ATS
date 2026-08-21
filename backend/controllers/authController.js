import asyncHandler from '../utils/asyncHandler.js';
import { registerUser, loginUser, getUserProfile } from '../services/authService.js';

/**
 * @file authController.js
 * @description Controllers for handling user authentication operations (registration, login, profile).
 */

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const result = await registerUser({ name, email, password, role });

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await loginUser({ email, password });

  res.status(200).json({
    success: true,
    message: 'User authenticated successfully',
    data: result,
  });
});

/**
 * @desc    Get current authenticated user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
export const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const user = await getUserProfile(userId);

  res.status(200).json({
    success: true,
    message: 'User profile retrieved successfully',
    data: {
      user,
    },
  });
});
