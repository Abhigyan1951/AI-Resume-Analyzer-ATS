import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import ApiError from '../utils/apiError.js';

/**
 * @file authService.js
 * @description Encapsulates core authentication business logic for the AI Resume Analyzer SaaS.
 * Handles user registration, credentials verification, JWT token issuance, and user profile formatting.
 */

/**
 * Helper: Sign a JSON Web Token for authenticated sessions
 * @param {string} userId - MongoDB ObjectId string
 * @returns {string} Signed JWT Bearer token
 */
/**
 * Helper: Sign a JSON Web Token for authenticated sessions
 * @param {string} userId - MongoDB ObjectId string
 * @returns {string} Signed JWT Bearer token
 */
const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new ApiError(500, 'JWT secret is not configured');
  }

  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

/**
 * Helper: Format user object for safe public HTTP response payloads
 * Strips password digests, version keys, and internal implementation details.
 * 
 * @param {Object} user - Mongoose User document
 * @returns {Object} Clean user profile object
 */
const formatUserResponse = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

/**
 * Service: Register a new user
 * 
 * @param {Object} userData - User registration payload { name, email, password, role }
 * @returns {Promise<Object>} Object containing authenticated user data and access token
 */
export const registerUser = async ({ name, email, password, role }) => {
  // 1. Check if user email already exists in MongoDB
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, 'User with this email address already exists');
  }

  // 2. Create new User document (pre-save hook automatically hashes password)
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'user',
  });

  // 3. Generate JWT access token
  const token = generateToken(user._id);

  return {
    user: formatUserResponse(user),
    token,
  };
};

/**
 * Service: Authenticate existing user login credentials
 * 
 * @param {Object} credentials - Login payload { email, password }
 * @returns {Promise<Object>} Object containing user profile and access token
 */
export const loginUser = async ({ email, password }) => {
  // 1. Query user and explicitly select password hash (since select: false is set on schema)
  const user = await User.findOne({ email }).select('+password');

  // 2. Generic unified error message prevents user enumeration security attacks
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // 3. Verify plain text password against stored bcrypt hash using instance method
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // 4. Generate JWT access token
  const token = generateToken(user._id);

  return {
    user: formatUserResponse(user),
    token,
  };
};

/**
 * Service: Fetch current user profile by ID
 * 
 * @param {string} userId - Authenticated user ID from JWT payload
 * @returns {Promise<Object>} User profile object
 */
export const getUserProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User profile not found');
  }
  return formatUserResponse(user);
};
