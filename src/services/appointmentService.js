const { prisma } = require('../config/database');

async function createAppointment(data) {
  return prisma.appointment.create({ data });
}

async function updateAppointment(id, data) {
  return prisma.appointment.update({ where: { id }, data });
}

async function cancelAppointment(id) {
  return prisma.appointment.update({ where: { id }, data: { status: 'cancelled' } });
}

async function findAppointmentById(id) {
  return prisma.appointment.findUnique({ where: { id } });
}

async function listAppointments(filter) {
  return prisma.appointment.findMany({ where: filter, orderBy: { startTime: 'asc' } });
}

async function hasConflict({ doctorId, patientId, startTime, endTime }, excludeId) {
  const overlapFilter = {
    startTime: { lt: endTime },
    endTime: { gt: startTime },
  };
  const where = {
    status: { not: 'cancelled' },
    id: excludeId ? { not: excludeId } : undefined,
    OR: [
      { doctorId, ...overlapFilter },
      { patientId, ...overlapFilter },
    ],
  };
  const conflict = await prisma.appointment.findFirst({ where });
  return !!conflict;
}

module.exports = {
  createAppointment,
  updateAppointment,
  cancelAppointment,
  findAppointmentById,
  listAppointments,
  hasConflict,
};
