const { z } = require('zod');

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const signupSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  roles: z
    .array(z.enum(['admin', 'receptionist', 'dentist']))
    .min(1)
    .optional(),
});

module.exports = { loginSchema, signupSchema };
