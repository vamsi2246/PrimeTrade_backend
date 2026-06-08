const successResponse = (res, statusCode = 200, message = 'Success', payload = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data: payload,
  });
};

const errorResponse = (res, statusCode = 500, message = 'Error', errors = []) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

module.exports = {
  successResponse,
  errorResponse,
};
