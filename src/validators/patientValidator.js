const { z } = require('zod');

const createPatientSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().min(1),
  gender: z.string().min(1),
  dateOfBirth: z.string().min(1),
  address: z.string().min(1),
  medicalHistory: z.string().min(1),
});

const updatePatientSchema = createPatientSchema.partial();

module.exports = {
  createPatientSchema,
  updatePatientSchema,
};
