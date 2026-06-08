const logger = require('./logger');

const validateEnv = () => {
  const required = ['MONGO_URI', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];
  const missing = [];

  required.forEach((key) => {
    if (!process.env[key] || process.env[key].trim() === '') {
      missing.push(key);
    }
  });

  if (missing.length > 0) {
    logger.error(`FATAL STARTUP ERROR: Missing required environment variables: ${missing.join(', ')}`);
    logger.error('The application cannot start without these configurations. Please check your environment variables or your .env file.');
    process.exit(1);
  }
};

module.exports = validateEnv;
