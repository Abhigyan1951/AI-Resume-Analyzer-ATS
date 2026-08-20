/**
 * @file asyncHandler.js
 * @description Higher-order utility function to wrap asynchronous controller route handlers.
 * Eliminates repetitive try-catch blocks by forwarding rejected promises to Express next() error middleware.
 *
 * @param {Function} fn - Async Express middleware/controller function (req, res, next)
 * @returns {Function} Express handler passing errors to next()
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
