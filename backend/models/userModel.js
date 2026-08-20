import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * @file userModel.js
 * @description Mongoose User Schema and Model for the AI Resume Analyzer & ATS Platform.
 * Features strict data validation, automatic bcrypt password hashing, and instance methods.
 */

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false, // Do not return password by default in queries
    },
    role: {
      type: String,
      enum: {
        values: ['user', 'admin', 'recruiter'],
        message: 'Role must be either user, admin, or recruiter',
      },
      default: 'user',
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt fields
  }
);

/**
 * Mongoose Pre-Save Hook for Automatic Password Hashing
 * Runs before any document is saved to MongoDB.
 */
userSchema.pre('save', async function (next) {
  // Only hash password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate salt with cost factor of 12
    const salt = await bcrypt.genSalt(12);
    // Hash password using generated salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Schema Instance Method: Compare Candidate Password
 * Verifies plain text input password against stored bcrypt hash.
 * 
 * @param {string} candidatePassword - Plain text password from request body
 * @returns {Promise<boolean>} True if match, false otherwise
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
