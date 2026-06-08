const Redis = require('ioredis');
const logger = require('./logger');

let redisClient = null;
let isRedisConnected = false;

const initRedis = () => {
  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    logger.warn('REDIS_URL is not defined. Caching and rate limiting will fall back to in-memory store.');
    return null;
  }

  try {
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        if (times > 3) {
          logger.warn(`Redis connection failed after ${times} retries. Disabling Redis operations.`);
          isRedisConnected = false;
          return null; // stop retrying
        }
        return Math.min(times * 100, 2000);
      },
    });

    redisClient.on('connect', () => {
      logger.info('Redis client connecting...');
    });

    redisClient.on('ready', () => {
      isRedisConnected = true;
      logger.info('Redis client connected and ready.');
    });

    redisClient.on('error', (err) => {
      logger.error(`Redis Error: ${err.message}`);
      isRedisConnected = false;
    });

    redisClient.on('end', () => {
      isRedisConnected = false;
      logger.warn('Redis connection closed.');
    });
  } catch (error) {
    logger.error(`Redis Initialization Error: ${error.message}`);
    isRedisConnected = false;
    redisClient = null;
  }

  return redisClient;
};

const getRedisClient = () => redisClient;
const checkRedisStatus = () => isRedisConnected;

module.exports = {
  initRedis,
  getRedisClient,
  checkRedisStatus,
};
