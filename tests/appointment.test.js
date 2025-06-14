const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../src/config/express');
const { prisma } = require('../src/config/database');

let recToken;
let dentToken;
let appointmentId;
let patientId;
let dentId;

beforeAll(async () => {
  await prisma.refreshToken.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.user.deleteMany();
  await prisma.patient.deleteMany();

  const recPass = await bcrypt.hash('rec1234', 10);
  await prisma.user.create({ data: { name: 'Rec', email: 'rec@test.com', password: recPass, roles: ['receptionist'] } });
  const dentPass = await bcrypt.hash('dent1234', 10);
  const dentist = await prisma.user.create({ data: { name: 'Dent', email: 'dent@test.com', password: dentPass, roles: ['dentist'] } });
  dentId = dentist.id;
  const patient = await prisma.patient.create({
    data: {
      firstName: 'Pat',
      lastName: 'Smith',
      phone: '123',
      gender: 'male',
      dateOfBirth: new Date('1990-01-01'),
      address: 'Street',
      medicalHistory: 'none',
    },
  });
  patientId = patient.id;

  recToken = (await request(app).post('/api/auth/login').send({ email: 'rec@test.com', password: 'rec1234' })).body.accessToken;
  dentToken = (await request(app).post('/api/auth/login').send({ email: 'dent@test.com', password: 'dent1234' })).body.accessToken;
});

afterAll(async () => {
  await prisma.$disconnect();
});

test('book appointment', async () => {
  const res = await request(app)
    .post('/api/appointments')
    .set('Authorization', `Bearer ${recToken}`)
    .send({
      patientId,
      doctorId: dentId,
      startTime: '2030-01-01T10:00:00.000Z',
      endTime: '2030-01-01T11:00:00.000Z',
    });
  expect(res.statusCode).toBe(201);
  appointmentId = res.body.id;
});

test('conflict detection', async () => {
  const res = await request(app)
    .post('/api/appointments')
    .set('Authorization', `Bearer ${recToken}`)
    .send({
      patientId,
      doctorId: dentId,
      startTime: '2030-01-01T10:30:00.000Z',
      endTime: '2030-01-01T11:30:00.000Z',
    });
  expect(res.statusCode).toBe(400);
});

test('reschedule appointment', async () => {
  const res = await request(app)
    .put(`/api/appointments/${appointmentId}`)
    .set('Authorization', `Bearer ${recToken}`)
    .send({ startTime: '2030-01-01T12:00:00.000Z', endTime: '2030-01-01T13:00:00.000Z' });
  expect(res.statusCode).toBe(200);
});

test('cancel appointment', async () => {
  const res = await request(app)
    .delete(`/api/appointments/${appointmentId}`)
    .set('Authorization', `Bearer ${recToken}`);
  expect(res.statusCode).toBe(200);
  expect(res.body.status).toBe('cancelled');
});

test('list dentist appointments', async () => {
  const res = await request(app)
    .get('/api/appointments')
    .set('Authorization', `Bearer ${dentToken}`);
  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
  res.body.forEach(a => expect(a.doctorId).toBe(dentId));
});

test('get appointment details', async () => {
  const res = await request(app)
    .get(`/api/appointments/${appointmentId}`)
    .set('Authorization', `Bearer ${dentToken}`);
  expect(res.statusCode).toBe(200);
});
