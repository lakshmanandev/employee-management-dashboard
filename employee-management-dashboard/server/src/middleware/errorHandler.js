// Catches routes that don't exist and forwards a 404 to the error handler.
export const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found: ${req.method} ${req.originalUrl}`));
};

/**
 * Central error handler. Every controller can simply `throw` or call
 * next(err) and end up here, so we never repeat try/catch response logic.
 */
export const errorHandler = (err, req, res, next) => {
  let status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || 'Server error';

  // Mongoose duplicate key (e.g. email already exists).
  if (err.code === 11000) {
    status = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `A record with that ${field} already exists`;
  }

  // Mongoose validation error -> collect all field messages.
  if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  res.status(status).json({
    message,
    // Only leak the stack trace outside of production.
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};
