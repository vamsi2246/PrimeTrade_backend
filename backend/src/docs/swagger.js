const swaggerUi = require('swagger-ui-express');

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'SecureTask Pro API Documentation',
    version: '1.0.0',
    description: 'Production-ready Secure Task Management system built with Node.js, Express, and MongoDB.',
  },
  servers: [
    {
      url: '/api/v1',
      description: 'API version 1 root',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Input your Access Token. Format: Bearer <token>',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string' },
          role: { type: 'string', enum: ['user', 'admin'] },
          isActive: { type: 'boolean' },
          lastLogin: { type: 'string', format: 'date-time' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Task: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          status: { type: 'string', enum: ['pending', 'in_progress', 'completed'] },
          priority: { type: 'string', enum: ['low', 'medium', 'high'] },
          dueDate: { type: 'string', format: 'date-time' },
          createdBy: { type: 'string' },
          updatedBy: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      AuditLog: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          user: { type: 'string' },
          action: { type: 'string' },
          entity: { type: 'string' },
          entityId: { type: 'string' },
          ipAddress: { type: 'string' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
  paths: {
    '/auth/register': {
      post: {
        summary: 'Register user account',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string', example: 'Jane Doe' },
                  email: { type: 'string', example: 'jane@example.com' },
                  password: { type: 'string', example: 'secret123' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Registration successful' },
          400: { description: 'Validation parameters error' },
          409: { description: 'Email address already exists' },
        },
      },
    },
    '/auth/login': {
      post: {
        summary: 'Authenticate credentials and login',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'jane@example.com' },
                  password: { type: 'string', example: 'secret123' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Credentials verified, login success' },
          401: { description: 'Invalid login credentials' },
        },
      },
    },
    '/auth/refresh': {
      post: {
        summary: 'Rotate credentials using refresh token cookie',
        security: [],
        responses: {
          200: { description: 'Rotation successful, new tokens generated' },
          401: { description: 'Refresh token expired or invalid' },
        },
      },
    },
    '/auth/logout': {
      post: {
        summary: 'Deauthenticate session',
        responses: {
          200: { description: 'Session deleted successfully' },
        },
      },
    },
    '/users/profile': {
      get: {
        summary: 'Get authorized user profile details',
        responses: {
          200: { description: 'Profile details retrieved' },
        },
      },
      put: {
        summary: 'Update authorized profile information',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Jane Smith' },
                  email: { type: 'string', example: 'jane.smith@example.com' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Profile updated' },
        },
      },
    },
    '/tasks': {
      get: {
        summary: 'Get list of tasks with search/sort/filter/pagination',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['pending', 'in_progress', 'completed'] } },
          { name: 'priority', in: 'query', schema: { type: 'string', enum: ['low', 'medium', 'high'] } },
          { name: 'sort', in: 'query', schema: { type: 'string', default: '-createdAt' } },
        ],
        responses: {
          200: { description: 'Tasks list retrieved' },
        },
      },
      post: {
        summary: 'Create a task',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title'],
                properties: {
                  title: { type: 'string', example: 'Finish backend coding' },
                  description: { type: 'string', example: 'Implement the controllers and services layer' },
                  status: { type: 'string', enum: ['pending', 'in_progress', 'completed'], default: 'pending' },
                  priority: { type: 'string', enum: ['low', 'medium', 'high'], default: 'medium' },
                  dueDate: { type: 'string', format: 'date-time' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Task created successfully' },
        },
      },
    },
    '/tasks/stats': {
      get: {
        summary: 'Get summary statistics of tasks',
        responses: {
          200: { description: 'Statistics calculated successfully' },
        },
      },
    },
    '/tasks/{id}': {
      get: {
        summary: 'Get details of a single task',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Task details retrieved' },
          404: { description: 'Task not found' },
        },
      },
      put: {
        summary: 'Update details of a task',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  status: { type: 'string', enum: ['pending', 'in_progress', 'completed'] },
                  priority: { type: 'string', enum: ['low', 'medium', 'high'] },
                  dueDate: { type: 'string', format: 'date' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Task updated' },
        },
      },
      delete: {
        summary: 'Soft delete a task',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Task soft deleted successfully' },
        },
      },
    },
    '/users': {
      get: {
        summary: 'Admin: list all user accounts',
        responses: {
          200: { description: 'User accounts list retrieved' },
        },
      },
    },
    '/users/{id}/role': {
      patch: {
        summary: 'Admin: modify a user role',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['role'],
                properties: {
                  role: { type: 'string', enum: ['user', 'admin'] },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Role changed' },
        },
      },
    },
    '/users/{id}': {
      delete: {
        summary: 'Admin: delete a user account',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'User account deleted' },
        },
      },
    },
    '/audit': {
      get: {
        summary: 'Admin: query operations audit log records',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
          { name: 'action', in: 'query', schema: { type: 'string' } },
          { name: 'entity', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Logs retrieved' },
        },
      },
    },
    '/health': {
      get: {
        summary: 'System health check check',
        security: [],
        responses: {
          200: { description: 'System healthy' },
          503: { description: 'System degraded' },
        },
      },
    },
    '/metrics': {
      get: {
        summary: 'System CPU, Memory and performance metrics details',
        responses: {
          200: { description: 'Metrics retrieved' },
        },
      },
    },
  },
};

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};

module.exports = setupSwagger;
