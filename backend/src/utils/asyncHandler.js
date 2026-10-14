/**
 * Async handler wrapper to forward errors in async route handlers to next()
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
