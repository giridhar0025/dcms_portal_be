const router = require('express').Router();
const { signup, login, logout, refresh, me } = require('../controllers/authController');
const { validate } = require('../middlewares/validate');
const { loginSchema, signupSchema } = require('../validators/auth');
const { authMiddleware } = require('../middlewares/auth');

router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);
router.post('/refresh', refresh);
router.get('/me', authMiddleware(), me);
router.post('/signup', validate(signupSchema), signup);

module.exports = router;
