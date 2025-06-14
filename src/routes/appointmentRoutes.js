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

router.post('/', authMiddleware(['admin', 'receptionist']), validate(createAppointmentSchema), book);
router.put('/:id', authMiddleware(['admin', 'receptionist']), validate(rescheduleAppointmentSchema), reschedule);
router.delete('/:id', authMiddleware(['admin', 'receptionist']), cancel);
router.get('/', authMiddleware(['admin', 'receptionist', 'dentist']), list);
router.get('/:id', authMiddleware(['admin', 'receptionist', 'dentist']), getOne);

module.exports = router;
