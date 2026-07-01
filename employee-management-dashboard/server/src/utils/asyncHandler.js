/**
 * Wraps an async route handler so any rejected promise / thrown error is
 * forwarded to Express's error handler instead of crashing the process.
 * Lets controllers use clean async/await without repetitive try/catch.
 */
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
