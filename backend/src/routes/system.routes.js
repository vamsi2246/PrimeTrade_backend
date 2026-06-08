const express = require('express');
const mongoose = require('mongoose');
const { checkRedisStatus } = require('../config/redis');
const { successResponse } = require('../utils/response');
const protect = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');
const { ROLES } = require('../constants');

const router = express.Router();

router.get('/health', (req, res) => {
  const mongoStatus = mongoose.connection.readyState === 1 ? 'UP' : 'DOWN';
  const redisConnected = checkRedisStatus();
  const redisStatus = redisConnected ? 'UP' : 'DOWN';

  const healthStatus = {
    status: mongoStatus === 'UP' ? 'healthy' : 'degraded',
    timestamp: new Date(),
    uptime: process.uptime(),
    services: {
      database: mongoStatus,
      redis: redisStatus,
    },
  };

  const statusCode = mongoStatus === 'UP' ? 200 : 503;
  return res.status(statusCode).json({
    success: mongoStatus === 'UP',
    message: mongoStatus === 'UP' ? 'System is healthy' : 'Database connection error',
    data: healthStatus,
  });
});

router.get('/metrics', protect, authorize(ROLES.ADMIN), (req, res) => {
  const memoryUsage = process.memoryUsage();
  
  const metrics = {
    uptime: process.uptime(),
    memory: {
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024 * 100) / 100} MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024 * 100) / 100} MB`,
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024 * 100) / 100} MB`,
      external: `${Math.round(memoryUsage.external / 1024 / 1024 * 100) / 100} MB`,
    },
    cpu: process.cpuUsage(),
    nodeVersion: process.version,
    platform: process.platform,
  };

  return successResponse(res, 200, 'Metrics retrieved successfully', metrics);
});

module.exports = router;
