const { prisma } = require('../config/database');

async function createPatient(data) {
  return prisma.patient.create({ data });
}

async function updatePatient(id, data) {
  return prisma.patient.update({ where: { id }, data });
}

async function deletePatient(id) {
  return prisma.patient.delete({ where: { id } });
}

async function findPatientById(id) {
  return prisma.patient.findUnique({ where: { id } });
}

module.exports = {
  createPatient,
  updatePatient,
  deletePatient,
  findPatientById,
};
