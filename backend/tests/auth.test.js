const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const UserRepository = require('../src/repositories/UserRepository');
const User = require('../src/models/User');

// Mock Repositories & Models
jest.mock('../src/repositories/UserRepository');
jest.mock('../src/models/User');
jest.mock('../src/services/AuditLogService', () => ({
  logAction: jest.fn().mockResolvedValue(true),
}));

describe('Auth Integration Tests', () => {
  const mockUser = {
    _id: 'mock-user-id-123',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    isActive: true,
    comparePassword: jest.fn().mockResolvedValue(true),
    save: jest.fn().mockResolvedValue(true),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test_access_secret_key_123';
    process.env.JWT_REFRESH_SECRET = 'test_refresh_secret_key_456';
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully', async () => {
      UserRepository.findByEmail.mockResolvedValue(null);
      UserRepository.create.mockResolvedValue(mockUser);

      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'Password123!',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('accessToken');
      expect(res.body.data.user.email).toBe('john@example.com');
    });

    it('should fail registration if email is already registered', async () => {
      UserRepository.findByEmail.mockResolvedValue(mockUser);

      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'Password123!',
        });

      expect(res.statusCode).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Email already registered');
    });

    it('should fail registration with invalid input validation', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: '',
          email: 'not-an-email',
          password: 'short',
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login user successfully', async () => {
      UserRepository.findByEmail.mockResolvedValue(mockUser);
      mockUser.comparePassword.mockResolvedValue(true);

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'john@example.com',
          password: 'Password123!',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('accessToken');
    });

    it('should fail login with invalid credentials', async () => {
      UserRepository.findByEmail.mockResolvedValue(mockUser);
      mockUser.comparePassword.mockResolvedValue(false);

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'john@example.com',
          password: 'WrongPassword!',
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Invalid credentials');
    });
  });

  describe('POST /api/v1/auth/refresh', () => {
    it('should refresh access token', async () => {
      UserRepository.findById.mockResolvedValue(mockUser);
      const refreshToken = jwt.sign(
        { id: mockUser._id },
        process.env.JWT_REFRESH_SECRET
      );

      const res = await request(app)
        .post('/api/v1/auth/refresh')
        .set('Cookie', [`refresh_token=${refreshToken}`]);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('accessToken');
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('should logout user successfully and clear cookie', async () => {
      User.findById.mockResolvedValue(mockUser);
      const accessToken = jwt.sign(
        { id: mockUser._id, role: mockUser.role },
        process.env.JWT_SECRET
      );

      const res = await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.headers['set-cookie'][0]).toContain('refresh_token=;');
    });
  });
});
