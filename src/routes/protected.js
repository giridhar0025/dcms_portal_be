const router = require('express').Router();
const { authMiddleware } = require('../middlewares/auth');

router.get('/admin', authMiddleware(['admin']), (req, res) => {
  res.json({ message: 'admin access' });
});

module.exports = router;

