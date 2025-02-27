const logger = require('../../../utils/logger');
const ApiError = require('../../../utils/apiError');
const ApiResponse = require('../../../utils/apiResponse');
const config = require('../../../config');

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error(`${err.name}: ${err.message}`, { 
    url: req.originalUrl,
    method: req.method,
    body: req.body,
    stack: err.stack
  });

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ApiError(message.join(', '), 400);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate value for ${field}. Please use another value.`;
    error = new ApiError(message, 400);
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    const message = `Invalid ${err.path}: ${err.value}`;
    error = new ApiError(message, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new ApiError('Invalid token. Please log in again.', 401);
  }

  if (err.name === 'TokenExpiredError') {
    error = new ApiError('Your token has expired. Please log in again.', 401);
  }

  // Default response
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';
  
  // Only show stack trace in development
  const errorResponse = ApiResponse.error(
    statusCode,
    message,
    config.env === 'development' ? { stack: err.stack } : null
  );

  res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;
