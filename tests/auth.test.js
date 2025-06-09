const request = require('supertest');
const app = require('../src/config/express');
const { prisma } = require('../src/config/database');

describe('POST /api/auth/signup', () => {
  beforeAll(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should signup user and return token', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ name: 'Test', email: 'test@example.com', password: 'secret123' });
    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
  });
});
