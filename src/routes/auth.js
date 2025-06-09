const router = require('express').Router();
const { signup } = require('../controllers/authController');
const { validate } = require('../middlewares/validate');
const { signupSchema } = require('../validators/auth');

router.post('/signup', validate(signupSchema), signup);

module.exports = router;
