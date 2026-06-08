const { body, param } = require('express-validator');
const validate = require('../middlewares/validate.middleware');
const { ROLES } = require('../constants');

const updateProfileValidator = [
  body('name')
    .optional()
    .isString()
    .withMessage('Name must be a string')
    .isLength({ max: 50 })
    .withMessage('Name cannot exceed 50 characters')
    .trim(),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  validate,
];

const changeRoleValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid User ID'),
  body('role')
    .notEmpty()
    .withMessage('Role is required')
    .isIn(Object.values(ROLES))
    .withMessage(`Role must be one of: ${Object.values(ROLES).join(', ')}`),
  validate,
];

const userIdParamValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid User ID'),
  validate,
];

module.exports = {
  updateProfileValidator,
  changeRoleValidator,
  userIdParamValidator,
};
