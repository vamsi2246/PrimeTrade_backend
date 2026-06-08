const TaskService = require('../services/TaskService');
const { successResponse } = require('../utils/response');

const createTask = async (req, res, next) => {
  try {
    const taskRecord = await TaskService.createTask(req.body, req.user.id, req.ip);
    return successResponse(res, 201, 'Task created successfully', { task: taskRecord });
  } catch (error) {
    next(error);
  }
};

const getTask = async (req, res, next) => {
  try {
    const taskRecord = await TaskService.getTaskById(req.params.id, req.user);
    return successResponse(res, 200, 'Task retrieved successfully', { task: taskRecord });
  } catch (error) {
    next(error);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const paginatedTasks = await TaskService.getAllTasks(req.user, req.query);
    return successResponse(res, 200, 'Tasks retrieved successfully', paginatedTasks);
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const updatedTaskRecord = await TaskService.updateTask(
      req.params.id,
      req.body,
      req.user,
      req.ip
    );
    return successResponse(res, 200, 'Task updated successfully', { task: updatedTaskRecord });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    await TaskService.deleteTask(req.params.id, req.user, req.ip);
    return successResponse(res, 200, 'Task deleted successfully');
  } catch (error) {
    next(error);
  }
};

const getStats = async (req, res, next) => {
  try {
    const tasksStats = await TaskService.getStats(req.user);
    return successResponse(res, 200, 'Task statistics retrieved successfully', { stats: tasksStats });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTask,
  getTasks,
  updateTask,
  deleteTask,
  getStats,
};
