import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { registerValidation, loginValidation } from '../middleware/authValidator.js';

/**
 * @file authRoutes.js
 * @description Authentication routes mapping endpoints to controllers and validation middlewares.
 */

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', registerValidation, register);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & return JWT token
 * @access  Public
 */
router.post('/login', loginValidation, login);

/**
 * @route   GET /api/auth/profile
 * @desc    Get authenticated user profile
 * @access  Private (JWT Protected)
 */
router.get('/profile', protect, getProfile);

export default router;
