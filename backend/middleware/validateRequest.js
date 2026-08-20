import { validationResult } from 'express-validator';
import ApiError from '../utils/apiError.js';

/**
 * @file validateRequest.js
 * @description Generic input validation result handler for Express middleware pipelines.
 * Evaluates express-validator results and passes formatted ApiError to global error handling middleware.
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Join multiple validation error messages into a clear formatted response
    const errorMessages = errors.array().map((err) => err.msg).join('. ');
    return next(new ApiError(400, errorMessages));
  }

  next();
};

export default validateRequest;
