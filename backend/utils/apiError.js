/**
 * @file apiError.js
 * @description Custom operational error class extending Node's native Error class.
 * Provides consistent error structure with status codes and operational flags across the SaaS application.
 */
class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP response status code (4xx, 5xx)
   * @param {string} message - Human-readable error description
   * @param {boolean} [isOperational=true] - Operational error flag (true for expected errors, false for bugs)
   * @param {string} [stack=''] - Stack trace string
   */
  constructor(statusCode, message, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = isOperational;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
