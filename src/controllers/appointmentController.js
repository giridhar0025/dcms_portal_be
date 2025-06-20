const {
  createAppointment,
  updateAppointment,
  cancelAppointment,
  findAppointmentById,
  listAppointments,
  hasConflict,
} = require('../services/appointmentService');
const { isValidObjectId } = require('../utils/objectId');

async function book(req, res, next) {
  try {
    const { patientId, doctorId, startTime, endTime, notes } = req.body;
    if (!isValidObjectId(patientId) || !isValidObjectId(doctorId)) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    if (new Date(startTime) >= new Date(endTime)) {
      return res.status(400).json({ error: 'Invalid time range' });
    }
    const conflict = await hasConflict({ doctorId, patientId, startTime, endTime });
    if (conflict) return res.status(400).json({ error: 'Time slot unavailable' });
    const appointment = await createAppointment({ patientId, doctorId, startTime: new Date(startTime), endTime: new Date(endTime), notes });
    res.status(201).json(appointment);
  } catch (err) {
    next(err);
  }
}

async function reschedule(req, res, next) {
  try {
    const { id } = req.params;
    const { startTime, endTime } = req.body;
    if (!isValidObjectId(id)) return res.status(400).json({ error: 'Invalid id' });
    const appointment = await findAppointmentById(id);
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    if (new Date(startTime) >= new Date(endTime)) {
      return res.status(400).json({ error: 'Invalid time range' });
    }
    const conflict = await hasConflict({ doctorId: appointment.doctorId, patientId: appointment.patientId, startTime, endTime }, id);
    if (conflict) return res.status(400).json({ error: 'Time slot unavailable' });
    const updated = await updateAppointment(id, { startTime: new Date(startTime), endTime: new Date(endTime) });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function cancel(req, res, next) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: 'Invalid id' });
    const appointment = await findAppointmentById(id);
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    const updated = await cancelAppointment(id);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const { doctorId, patientId, startDate, endDate, status } = req.query;
    const filter = {};
    if (doctorId) filter.doctorId = doctorId;
    if (patientId) filter.patientId = patientId;
    if (status) filter.status = status;
    if (startDate || endDate) {
      filter.startTime = {};
      if (startDate) filter.startTime.gte = new Date(startDate);
      if (endDate) filter.startTime.lte = new Date(endDate);
    }
    const roles = req.user.roles || [];
    if (roles.includes('dentist')) filter.doctorId = req.user.userId;
    const appointments = await listAppointments(filter);
    res.json(appointments);
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: 'Invalid id' });
    const appointment = await findAppointmentById(id);
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    const roles = req.user.roles || [];
    if (roles.includes('dentist') && appointment.doctorId !== req.user.userId)
      return res.status(403).json({ error: 'Forbidden' });
    res.json(appointment);
  } catch (err) {
    next(err);
  }
}

module.exports = { book, reschedule, cancel, list, getOne };
