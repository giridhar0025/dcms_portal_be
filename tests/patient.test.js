const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../src/config/express');
const { prisma } = require('../src/config/database');

let adminToken;
let recToken;
let dentToken;
let patientId;

beforeAll(async () => {
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
  await prisma.patient.deleteMany();

  const adminPass = await bcrypt.hash('admin123', 10);
  await prisma.user.create({ data: { name: 'Admin', email: 'admin@test.com', password: adminPass, role: 'admin' } });
  const recPass = await bcrypt.hash('rec1234', 10);
  await prisma.user.create({ data: { name: 'Rec', email: 'rec@test.com', password: recPass, role: 'receptionist' } });
  const dentPass = await bcrypt.hash('dent1234', 10);
  await prisma.user.create({ data: { name: 'Dent', email: 'dent@test.com', password: dentPass, role: 'dentist' } });

  adminToken = (await request(app).post('/api/auth/login').send({ email: 'admin@test.com', password: 'admin123' })).body.accessToken;
  recToken = (await request(app).post('/api/auth/login').send({ email: 'rec@test.com', password: 'rec1234' })).body.accessToken;
  dentToken = (await request(app).post('/api/auth/login').send({ email: 'dent@test.com', password: 'dent1234' })).body.accessToken;
});

afterAll(async () => {
  await prisma.$disconnect();
});

test('create patient', async () => {
  const res = await request(app)
    .post('/api/patients')
    .set('Authorization', `Bearer ${recToken}`)
    .send({
      firstName: 'John',
      lastName: 'Doe',
      phone: '123',
      gender: 'male',
      dateOfBirth: '1990-01-01',
      address: 'Street 1',
      medicalHistory: 'none',
    });
  expect(res.statusCode).toBe(201);
  expect(res.body.firstName).toBe('John');
  patientId = res.body.id;
});

test('edit patient', async () => {
  const res = await request(app)
    .put(`/api/patients/${patientId}`)
    .set('Authorization', `Bearer ${dentToken}`)
    .send({ address: 'Street 2' });
  expect(res.statusCode).toBe(200);
  expect(res.body.address).toBe('Street 2');
});

test('delete patient', async () => {
  const res = await request(app)
    .delete(`/api/patients/${patientId}`)
    .set('Authorization', `Bearer ${adminToken}`);
  expect(res.statusCode).toBe(200);
});

test('role based delete forbidden', async () => {
  const resCreate = await request(app)
    .post('/api/patients')
    .set('Authorization', `Bearer ${recToken}`)
    .send({
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '555',
      gender: 'female',
      dateOfBirth: '1985-01-01',
      address: 'Street 3',
      medicalHistory: 'none',
    });
  const id = resCreate.body.id;
  const res = await request(app)
    .delete(`/api/patients/${id}`)
    .set('Authorization', `Bearer ${recToken}`);
  expect(res.statusCode).toBe(403);
});
