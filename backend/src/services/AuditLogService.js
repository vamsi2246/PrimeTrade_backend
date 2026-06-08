const AuditLogRepository = require('../repositories/AuditLogRepository');
const logger = require('../config/logger');

class AuditLogService {
  async logAction({ userId, action, entity, entityId, ipAddress }) {
    try {
      AuditLogRepository.create({
        user: userId,
        action,
        entity,
        entityId,
        ipAddress,
        timestamp: new Date(),
      }).catch((dbError) => {
        logger.error(`Audit log insert failed: ${dbError.message}`);
      });

      logger.info(`Audit Log: [${action}] by User: ${userId || 'ANONYMOUS'} on ${entity} (${entityId || 'N/A'})`);
    } catch (logError) {
      logger.error(`AuditLogService internal error: ${logError.message}`);
    }
  }

  async getLogs(queryFilters = {}, paginationOptions = {}) {
    return await AuditLogRepository.findLogs(queryFilters, paginationOptions);
  }
}

module.exports = new AuditLogService();
