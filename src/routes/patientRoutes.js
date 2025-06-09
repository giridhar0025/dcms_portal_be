const router = require('express').Router();
const { create, update, remove } = require('../controllers/patientController');
const { validate } = require('../middlewares/validate');
const { authMiddleware } = require('../middlewares/auth');
const { createPatientSchema, updatePatientSchema } = require('../validators/patientValidator');

router.post('/', authMiddleware(['admin', 'receptionist']), validate(createPatientSchema), create);
router.put('/:id', authMiddleware(['admin', 'receptionist', 'dentist']), validate(updatePatientSchema), update);
router.delete('/:id', authMiddleware(['admin']), remove);

module.exports = router;
