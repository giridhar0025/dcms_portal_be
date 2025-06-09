const router = require('express').Router();
const authRoutes = require('./auth');
const protectedRoutes = require('./protected');
const patientRoutes = require('./patientRoutes');
const appointmentRoutes = require('./appointmentRoutes');

router.use('/auth', authRoutes);
router.use('/protected', protectedRoutes);
router.use('/patients', patientRoutes);
router.use('/appointments', appointmentRoutes);

module.exports = router;
