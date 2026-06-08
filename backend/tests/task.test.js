const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const TaskRepository = require('../src/repositories/TaskRepository');
const User = require('../src/models/User');

// Mock Repositories & Models
jest.mock('../src/repositories/TaskRepository');
jest.mock('../src/models/User');
jest.mock('../src/services/AuditLogService', () => ({
  logAction: jest.fn().mockResolvedValue(true),
}));

describe('Task Integration Tests', () => {
  const mockUser = {
    _id: 'mock-user-id-123',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    isActive: true,
  };

  const mockTask = {
    _id: 'mock-task-id-789',
    title: 'Write production tests',
    description: 'Create integration tests for auth and tasks',
    status: 'pending',
    priority: 'high',
    createdBy: 'mock-user-id-123',
    isDeleted: false,
  };

  let accessToken;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test_access_secret_key_123';
    
    // Generate valid test JWT
    accessToken = jwt.sign(
      { id: mockUser._id, role: mockUser.role },
      process.env.JWT_SECRET
    );

    // Default User.findById mock to pass protect middleware
    User.findById.mockResolvedValue(mockUser);
  });

  describe('POST /api/v1/tasks', () => {
    it('should create a task successfully', async () => {
      TaskRepository.create.mockResolvedValue(mockTask);

      const res = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Write production tests',
          description: 'Create integration tests for auth and tasks',
          priority: 'high',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.task.title).toBe(mockTask.title);
    });

    it('should fail creation with invalid input validation', async () => {
      const res = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: '', // Empty title is invalid
          priority: 'invalid-priority',
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/v1/tasks', () => {
    it('should fetch list of tasks', async () => {
      const mockResult = {
        items: [mockTask],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };
      TaskRepository.findTasks.mockResolvedValue(mockResult);

      const res = await request(app)
        .get('/api/v1/tasks')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.items.length).toBe(1);
    });
  });

  describe('GET /api/v1/tasks/stats', () => {
    it('should fetch tasks stats summary', async () => {
      const mockStats = {
        total: 1,
        pending: 1,
        in_progress: 0,
        completed: 0,
        lowPriority: 0,
        mediumPriority: 0,
        highPriority: 1,
      };
      TaskRepository.getTaskStats.mockResolvedValue(mockStats);

      const res = await request(app)
        .get('/api/v1/tasks/stats')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.stats.total).toBe(1);
    });
  });

  describe('GET /api/v1/tasks/:id', () => {
    it('should return a specific task by id', async () => {
      TaskRepository.findById.mockResolvedValue(mockTask);

      const res = await request(app)
        .get(`/api/v1/tasks/${mockTask._id}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.task._id).toBe(mockTask._id);
    });

    it('should return 404 if task is not found', async () => {
      TaskRepository.findById.mockResolvedValue(null);

      const res = await request(app)
        .get('/api/v1/tasks/nonexistentid')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/v1/tasks/:id', () => {
    it('should update a task successfully', async () => {
      const updatedTask = { ...mockTask, title: 'Updated Title' };
      TaskRepository.findById.mockResolvedValue(mockTask);
      TaskRepository.update.mockResolvedValue(updatedTask);

      const res = await request(app)
        .put(`/api/v1/tasks/${mockTask._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Updated Title',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.task.title).toBe('Updated Title');
    });
  });

  describe('DELETE /api/v1/tasks/:id', () => {
    it('should soft delete task successfully', async () => {
      TaskRepository.findById.mockResolvedValue(mockTask);
      TaskRepository.softDelete.mockResolvedValue(mockTask);

      const res = await request(app)
        .delete(`/api/v1/tasks/${mockTask._id}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
