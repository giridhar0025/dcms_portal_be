const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../src/config/express');
const { prisma } = require('../src/config/database');

let accessToken;
let refreshCookie;

beforeAll(async () => {
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
  const password = await bcrypt.hash('secret123', 10);
  await prisma.user.create({
    data: { name: 'Admin', email: 'admin@test.com', password, role: 'admin' },
  });
  const password2 = await bcrypt.hash('pass1234', 10);
  await prisma.user.create({
    data: { name: 'Rec', email: 'rec@test.com', password: password2, role: 'receptionist' },
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});

test('signup creates user and returns token', async () => {
  const res = await request(app)
    .post('/api/auth/signup')
    .send({ name: 'Dent', email: 'dent@test.com', password: 'teeth123', role: 'dentist' });
  expect(res.statusCode).toBe(201);
  expect(res.body.accessToken).toBeDefined();
});

test('login returns tokens', async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@test.com', password: 'secret123' });
  expect(res.statusCode).toBe(200);
  expect(res.body.accessToken).toBeDefined();
  expect(res.headers['set-cookie']).toBeDefined();
  refreshCookie = res.headers['set-cookie'][0];
  accessToken = res.body.accessToken;
});

test('me returns user info', async () => {
  const res = await request(app)
    .get('/api/auth/me')
    .set('Authorization', `Bearer ${accessToken}`);
  expect(res.statusCode).toBe(200);
  expect(res.body.role).toBe('admin');
});

test('refresh rotates token', async () => {
  const res = await request(app)
    .post('/api/auth/refresh')
    .set('Cookie', refreshCookie);
  expect(res.statusCode).toBe(200);
  expect(res.body.accessToken).toBeDefined();
});

test('logout clears cookie', async () => {
  const res = await request(app)
    .post('/api/auth/logout')
    .set('Cookie', refreshCookie);
  expect(res.statusCode).toBe(200);
});

test('role based access forbidden', async () => {
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'rec@test.com', password: 'pass1234' });
  const token = loginRes.body.accessToken;
  const res = await request(app)
    .get('/api/protected/admin')
    .set('Authorization', `Bearer ${token}`);
  expect(res.statusCode).toBe(403);
});

