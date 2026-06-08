const AuditLogService = require('../services/AuditLogService');
const { successResponse } = require('../utils/response');

const getLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, action, entity, user } = req.query;
    const queryFilters = {};

    if (action) {
      queryFilters.action = action;
    }
    if (entity) {
      queryFilters.entity = entity;
    }
    if (user) {
      queryFilters.user = user;
    }

    const paginatedLogs = await AuditLogService.getLogs(queryFilters, { page, limit });
    return successResponse(res, 200, 'Audit logs retrieved successfully', paginatedLogs);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLogs,
};
