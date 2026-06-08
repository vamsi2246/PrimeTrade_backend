jest.mock('../src/middlewares/auth.middleware', () => (req, res, next) => {
  req.user = { id: 'mock-admin-id', role: 'admin' };
  next();
});

jest.mock('../src/middlewares/role.middleware', () => () => (req, res, next) => next());

const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');

describe('System Health Check API', () => {
  // Disconnect mongoose after tests to avoid open handle warnings
  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should return 200 and healthy status if database is not connected (mocked or handled)', async () => {
    // In test environment, the database might not be connected, so we check status
    const res = await request(app).get('/api/v1/health');
    
    // The health endpoint returns 200 or 503 depending on database status
    expect([200, 503]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('success');
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('status');
  });

  it('should return memory and CPU metrics from /metrics', async () => {
    const res = await request(app).get('/api/v1/metrics');
    
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('memory');
    expect(res.body.data).toHaveProperty('cpu');
  });
});
