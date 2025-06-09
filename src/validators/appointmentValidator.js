const { z } = require('zod');

const createAppointmentSchema = z.object({
  patientId: z.string().length(24),
  doctorId: z.string().length(24),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  notes: z.string().optional(),
});

const rescheduleAppointmentSchema = z.object({
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
});

module.exports = {
  createAppointmentSchema,
  rescheduleAppointmentSchema,
};
