import ApiError from '../utils/apiError.js';

/**
 * @file errorMiddleware.js
 * @description Centralized global error handling middleware for Express.
 * Sanitizes errors, maps database & JWT exceptions to operational ApiErrors,
 * and formats responses consistently across Development and Production environments.
 */

// Helper: Handle Mongoose Invalid ObjectId (CastError)
const handleCastErrorDB = (err) => {
  const message = `Resource not found. Invalid ${err.path}: ${err.value}`;
  return new ApiError(400, message);
};

// Helper: Handle Mongoose Duplicate Key Error (Code 11000)
const handleDuplicateFieldsDB = (err) => {
  const key = Object.keys(err.keyValue || {})[0] || 'field';
  const value = err.keyValue ? err.keyValue[key] : '';
  const message = `Duplicate field value entered: ${key} '${value}'. Please use another value.`;
  return new ApiError(400, message);
};

// Helper: Handle Mongoose Schema Validation Errors
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new ApiError(400, message);
};

// Helper: Handle JWT Signature / Altered Token Errors
const handleJWTError = () =>
  new ApiError(401, 'Invalid authentication token. Please log in again.');

// Helper: Handle Expired JWT Tokens
const handleJWTExpiredError = () =>
  new ApiError(401, 'Your session has expired. Please log in again.');

// Development Response: Verbose debugging output with full stack trace
const sendErrorDev = (err, res) => {
  res.status(err.statusCode || 500).json({
    success: false,
    statusCode: err.statusCode || 500,
    message: err.message,
    stack: err.stack,
  });
};

// Production Response: Sanitized operational messages for users
const sendErrorProd = (err, res) => {
  // Trusted Operational Error: Send clear message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message,
    });
  }

  // Unknown Programming or System Error: Don't leak details to client
  console.error(`[${new Date().toISOString()}] CRITICAL ERROR`, err);
  return res.status(500).json({
    success: false,
    statusCode: 500,
    message: 'Internal server error. Please try again later.',
  });
};

/**
 * 404 Not Found Middleware - Catches requests to unmapped endpoints
 */
export const notFoundHandler = (req, res, next) => {
  const error = new ApiError(404, `Route not found: ${req.originalUrl}`);
  next(error);
};

/**
 * Global Centralized Error Handling Middleware
 */
export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  const env = process.env.NODE_ENV || 'development';

  if (env === 'development') {
    let error = err;

    if (err.name === 'CastError') error = handleCastErrorDB(err);
    if (err.code === 11000) error = handleDuplicateFieldsDB(err);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(err);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorDev(error, res);
  } else {
    let error = { ...err };
    error.message = err.message;
    error.name = err.name;

    if (err.name === 'CastError') error = handleCastErrorDB(err);
    if (err.code === 11000) error = handleDuplicateFieldsDB(err);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(err);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};
