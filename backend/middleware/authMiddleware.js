import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import ApiError from '../utils/apiError.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @file authMiddleware.js
 * @description JWT Protected Authentication Middleware for Express.
 * Extracts, verifies Authorization Bearer tokens and attaches authenticated user context to req.user.
 */

/**
 * Protect routes - Verifies JWT token and attaches user to request object
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Check if Authorization header exists and follows Bearer scheme
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 2. Reject if no token is provided
  if (!token) {
    throw new ApiError(401, 'Authentication token is required');
  }

  // 3. Verify JWT secret configuration
  if (!process.env.JWT_SECRET) {
    throw new ApiError(500, 'JWT secret is not configured');
  }

  // 4. Verify token validity and expiration
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Fetch user from MongoDB by ID in token payload
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new ApiError(401, 'User belonging to this token no longer exists.');
    }

    // 6. Attach authenticated user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error.name === 'JsonWebTokenError') {
      throw new ApiError(401, 'Invalid authentication token');
    }
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Session expired. Please log in again.');
    }
    throw new ApiError(401, 'Not authorized to access this resource');
  }
});

export default protect;
