const AuditLog = require('../models/AuditLog');

class AuditLogRepository {
  async create(logPayload) {
    const newLog = new AuditLog(logPayload);
    return await newLog.save();
  }

  async findLogs(queryFilters = {}, paginationOptions = {}) {
    const pageNumber = parseInt(paginationOptions.page) || 1;
    const itemsLimit = parseInt(paginationOptions.limit) || 20;
    const skipOffset = (pageNumber - 1) * itemsLimit;

    const logsList = await AuditLog.find(queryFilters)
      .sort({ timestamp: -1 })
      .skip(skipOffset)
      .limit(itemsLimit)
      .populate('user', 'name email role')
      .exec();

    const totalLogs = await AuditLog.countDocuments(queryFilters).exec();

    return {
      items: logsList,
      total: totalLogs,
      page: pageNumber,
      limit: itemsLimit,
      totalPages: Math.ceil(totalLogs / itemsLimit),
    };
  }
}

module.exports = new AuditLogRepository();
