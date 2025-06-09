const { createUser, generateToken } = require('../services/authService');

async function signup(req, res, next) {
  try {
    const user = await createUser(req.body);
    const token = generateToken(user);
    res.status(201).json({ token });
  } catch (err) {
    if (err.code === 'P2002') {
      err.status = 400;
      err.message = 'Email already exists';
    }
    next(err);
  }
}

module.exports = { signup };
