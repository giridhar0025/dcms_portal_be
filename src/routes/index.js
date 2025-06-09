const router = require('express').Router();
const authRoutes = require('./auth');
const protectedRoutes = require('./protected');
const patientRoutes = require('./patientRoutes');

router.use('/auth', authRoutes);
router.use('/protected', protectedRoutes);
router.use('/patients', patientRoutes);

module.exports = router;
