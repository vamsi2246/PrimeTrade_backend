const { errorResponse } = require('../utils/response');
const logger = require('../config/logger');

const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const errors = err.errors || [];

  logger.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  if (statusCode === 500) {
    logger.error(err.stack);
  }

  if (err.name === 'CastError') {
    return errorResponse(res, 400, `Invalid ${err.path}`, [
      { message: `Invalid ID format for value "${err.value}"` }
    ]);
  }

  if (err.code === 11000) {
    const key = Object.keys(err.keyValue)[0];
    return errorResponse(res, 409, `${key.charAt(0).toUpperCase() + key.slice(1)} already exists`, [
      { message: `The value for "${key}" is already registered` }
    ]);
  }

  if (err.name === 'ValidationError') {
    const validationErrors = Object.values(err.errors).map((validationError) => ({
      field: validationError.path,
      message: validationError.message,
    }));
    return errorResponse(res, 422, 'Validation Error', validationErrors);
  }

  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, 401, 'Invalid authentication token', [
      { message: 'JWT signature verification failed' }
    ]);
  }

  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, 401, 'Authentication token expired', [
      { message: 'Session expired. Please log in again' }
    ]);
  }

  return errorResponse(res, statusCode, message, errors);
};

module.exports = errorHandler;
