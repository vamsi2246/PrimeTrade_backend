const TaskRepository = require('../repositories/TaskRepository');
const { NotFoundError, ForbiddenError } = require('../utils/errors');
const AuditLogService = require('./AuditLogService');
const { ROLES } = require('../constants');

class TaskService {
  async createTask(taskPayload, userId, ipAddress) {
    const newTask = await TaskRepository.create({
      ...taskPayload,
      createdBy: userId,
    });

    await AuditLogService.logAction({
      userId,
      action: 'TASK_CREATE',
      entity: 'Task',
      entityId: newTask._id,
      ipAddress,
    });

    return newTask;
  }

  async getTaskById(taskId, userSession) {
    const activeTask = await TaskRepository.findById(taskId);
    if (!activeTask || activeTask.isDeleted) {
      throw new NotFoundError('Task not found');
    }

    if (userSession.role !== ROLES.ADMIN && activeTask.createdBy.toString() !== userSession.id) {
      throw new ForbiddenError('Access denied. You do not own this task');
    }

    return activeTask;
  }

  async getAllTasks(userSession, queryParams = {}) {
    const taskQueryFilters = {};

    if (userSession.role !== ROLES.ADMIN) {
      taskQueryFilters.createdBy = userSession.id;
    } else if (queryParams.userId) {
      taskQueryFilters.createdBy = queryParams.userId;
    }

    if (queryParams.status) {
      taskQueryFilters.status = queryParams.status;
    }

    if (queryParams.priority) {
      taskQueryFilters.priority = queryParams.priority;
    }

    const queryOptions = {
      page: queryParams.page,
      limit: queryParams.limit,
      sort: queryParams.sort,
      search: queryParams.search,
    };

    return await TaskRepository.findTasks(taskQueryFilters, queryOptions);
  }

  async updateTask(taskId, updateFieldsPayload, userSession, ipAddress) {
    const activeTask = await TaskRepository.findById(taskId);
    if (!activeTask || activeTask.isDeleted) {
      throw new NotFoundError('Task not found');
    }

    if (userSession.role !== ROLES.ADMIN && activeTask.createdBy.toString() !== userSession.id) {
      throw new ForbiddenError('Access denied. You cannot modify this task');
    }

    const updatedTask = await TaskRepository.update(taskId, {
      ...updateFieldsPayload,
      updatedBy: userSession.id,
    });

    await AuditLogService.logAction({
      userId: userSession.id,
      action: 'TASK_UPDATE',
      entity: 'Task',
      entityId: taskId,
      ipAddress,
    });

    return updatedTask;
  }

  async deleteTask(taskId, userSession, ipAddress) {
    const activeTask = await TaskRepository.findById(taskId);
    if (!activeTask || activeTask.isDeleted) {
      throw new NotFoundError('Task not found');
    }

    if (userSession.role !== ROLES.ADMIN && activeTask.createdBy.toString() !== userSession.id) {
      throw new ForbiddenError('Access denied. You cannot delete this task');
    }

    await TaskRepository.softDelete(taskId, userSession.id);

    await AuditLogService.logAction({
      userId: userSession.id,
      action: 'TASK_DELETE',
      entity: 'Task',
      entityId: taskId,
      ipAddress,
    });

    return true;
  }

  async getStats(userSession) {
    const statsFilters = {};
    if (userSession.role !== ROLES.ADMIN) {
      statsFilters.createdBy = userSession.id;
    }
    return await TaskRepository.getTaskStats(statsFilters);
  }
}

module.exports = new TaskService();
