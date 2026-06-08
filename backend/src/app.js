const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

dotenv.config();

const logger = require('./config/logger');
const { apiLimiter } = require('./middlewares/rateLimiter.middleware');
const router = require('./routes');
const setupSwagger = require('./docs/swagger');
const errorHandler = require('./middlewares/error.middleware');
const { NotFoundError } = require('./utils/errors');

const app = express();

// Set secure HTTP headers
app.use(helmet());

// Enable CORS
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Compress response bodies
app.use(compression());

// Parse cookies
app.use(cookieParser());

// Parse incoming request JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom morgan logging stream to write through Winston
const morganStream = {
  write: (message) => logger.http(message.trim()),
};
app.use(
  morgan(
    ':remote-addr - :method :url :status :res[content-length] - :response-time ms',
    { stream: morganStream }
  )
);

// Apply rate limiting to all requests
app.use('/api', apiLimiter);

// API Documentation
setupSwagger(app);

// Mount main routing
app.use('/api/v1', router);

// Catch all unmatched routes
app.use('*', (req, res, next) => {
  next(new NotFoundError(`Route ${req.originalUrl} not found`));
});

// Centralized error handling
app.use(errorHandler);

module.exports = app;
