const { body } = require('express-validator');
const validate = require('../middlewares/validate.middleware');
const { TASK_STATUS, TASK_PRIORITY } = require('../constants');

const createTaskValidator = [
  body('title')
    .notEmpty()
    .withMessage('Task title is required')
    .isString()
    .withMessage('Title must be a string')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters')
    .trim(),
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string')
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters')
    .trim(),
  body('status')
    .optional()
    .isIn(Object.values(TASK_STATUS))
    .withMessage(`Status must be one of: ${Object.values(TASK_STATUS).join(', ')}`),
  body('priority')
    .optional()
    .isIn(Object.values(TASK_PRIORITY))
    .withMessage(`Priority must be one of: ${Object.values(TASK_PRIORITY).join(', ')}`),
  body('dueDate')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Due date must be a valid ISO8601 date string'),
  validate,
];

const updateTaskValidator = [
  body('title')
    .optional()
    .isString()
    .withMessage('Title must be a string')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters')
    .trim(),
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string')
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters')
    .trim(),
  body('status')
    .optional()
    .isIn(Object.values(TASK_STATUS))
    .withMessage(`Status must be one of: ${Object.values(TASK_STATUS).join(', ')}`),
  body('priority')
    .optional()
    .isIn(Object.values(TASK_PRIORITY))
    .withMessage(`Priority must be one of: ${Object.values(TASK_PRIORITY).join(', ')}`),
  body('dueDate')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Due date must be a valid ISO8601 date string'),
  validate,
];

module.exports = {
  createTaskValidator,
  updateTaskValidator,
};
