const router = require('express').Router();
const { validate } = require('../middlewares/validate');
const { authMiddleware } = require('../middlewares/auth');
const {
  book,
  reschedule,
  cancel,
  list,
  getOne,
} = require('../controllers/appointmentController');
const {
  createAppointmentSchema,
  rescheduleAppointmentSchema,
} = require('../validators/appointmentValidator');

router.post('/', authMiddleware(['admin', 'receptionist', 'patient']), validate(createAppointmentSchema), book);
router.put('/:id', authMiddleware(['admin', 'receptionist']), validate(rescheduleAppointmentSchema), reschedule);
router.delete('/:id', authMiddleware(['admin', 'receptionist', 'patient']), cancel);
router.get('/', authMiddleware(['admin', 'receptionist', 'dentist', 'patient']), list);
router.get('/:id', authMiddleware(['admin', 'receptionist', 'dentist', 'patient']), getOne);

module.exports = router;
