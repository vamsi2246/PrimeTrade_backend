class ApiError extends Error {
  constructor(message = 'Internal Server Error', statusCode = 500, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends ApiError {
  constructor(errors = [], message = 'Validation Failed') {
    super(message, 400, errors);
  }
}

class AuthenticationError extends ApiError {
  constructor(message = 'Authentication Failed') {
    super(message, 401);
  }
}

class ForbiddenError extends ApiError {
  constructor(message = 'Access Denied') {
    super(message, 403);
  }
}

class NotFoundError extends ApiError {
  constructor(message = 'Resource Not Found') {
    super(message, 404);
  }
}

module.exports = {
  ApiError,
  ValidationError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
};
