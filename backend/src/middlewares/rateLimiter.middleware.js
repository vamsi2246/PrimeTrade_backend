const rateLimit = require('express-rate-limit');
const { errorResponse } = require('../utils/response');

const apiLimiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW_MINS || 15) * 60 * 1000,
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return errorResponse(res, 429, 'Too many requests. Please try again later.', [
      { message: 'Rate limit exceeded for this IP address' }
    ]);
  },
});

module.exports = {
  apiLimiter,
};
