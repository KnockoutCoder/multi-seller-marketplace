/**
 * Centralized Error Handler Middleware
 * Handles all errors and returns appropriate HTTP responses
 */
const errorHandler = (err, req, res, next) => {
  // log the error for debugging
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);

  // if error has a statusCode, use it; otherwise default to 500
  const statusCode = err.statusCode || 500;

  // if it's a validation error from Mongoose, return 400
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: err.message || 'Validation error',
    });
  }

  // if it's a CastError (invalid ObjectId), return 404
  if (err.name === 'CastError') {
    return res.status(404).json({
      message: 'Resource not found',
    });
  }

  // return error response
  res.status(statusCode).json({
    message: err.message || 'Internal server error',
  });
};

export default errorHandler;