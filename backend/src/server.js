const dotenv = require('dotenv');
// Load environment variables first
dotenv.config();

const validateEnv = require('./config/validateEnv');
// Validate required environment configuration
validateEnv();

const app = require('./app');
const connectDB = require('./config/db');
const { initRedis } = require('./config/redis');
const logger = require('./config/logger');

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Initialize Redis Cache
initRedis();

const server = app.listen(PORT, () => {
  logger.info(`SecureTask Pro server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Graceful shutdowns on system signals
const shutdown = (signal) => {
  logger.warn(`Received ${signal}. Shutting down server gracefully.`);
  server.close(async () => {
    try {
      const mongoose = require('mongoose');
      await mongoose.connection.close();
      logger.info('Mongoose connections closed.');

      const { getRedisClient } = require('./config/redis');
      const redisClient = getRedisClient();
      if (redisClient) {
        await redisClient.quit();
        logger.info('Redis connections closed.');
      }

      logger.info('Graceful shutdown completed. Exiting process.');
      process.exit(0);
    } catch (err) {
      logger.error(`Error during graceful shutdown: ${err.message}`);
      process.exit(1);
    }
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
