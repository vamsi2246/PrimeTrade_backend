const express = require('express');
const {
  createTask,
  getTask,
  getTasks,
  updateTask,
  deleteTask,
  getStats,
} = require('../controllers/TaskController');
const {
  createTaskValidator,
  updateTaskValidator,
} = require('../validators/task.validator');
const protect = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(protect); // All task routes require authentication

router.post('/', createTaskValidator, createTask);
router.get('/', getTasks);
router.get('/stats', getStats);
router.get('/:id', getTask);
router.put('/:id', updateTaskValidator, updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
