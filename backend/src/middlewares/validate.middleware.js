const { validationResult } = require('express-validator');
const { ValidationError } = require('../utils/errors');

const validate = (req, res, next) => {
  const validationErrorsResult = validationResult(req);
  if (validationErrorsResult.isEmpty()) {
    return next();
  }

  const formattedErrors = validationErrorsResult.array().map((validationError) => ({
    field: validationError.path,
    message: validationError.msg,
  }));

  return next(new ValidationError(formattedErrors));
};

module.exports = validate;
