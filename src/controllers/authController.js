const {
  getUserByEmail,
  validatePassword,
  generateAccessToken,
  createRefreshToken,
  deleteRefreshToken,
  rotateRefreshToken,
  createUser,
} = require('../services/authService');

function getCookieOptions() {
  return {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };
}

async function signup(req, res, next) {
  try {
    const user = await createUser(req.body);
    const accessToken = generateAccessToken(user);
    const refreshToken = await createRefreshToken(user.id);
    res.cookie('refreshToken', refreshToken.token, getCookieOptions());
    res.status(201).json({ accessToken });
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await validatePassword(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const accessToken = generateAccessToken(user);
    const refreshToken = await createRefreshToken(user.id);
    res.cookie('refreshToken', refreshToken.token, getCookieOptions());
    res.json({ accessToken });
  } catch (err) {
    next(err);
  }
}

async function logout(req, res, next) {
  try {
    const token = req.cookies.refreshToken;
    if (token) await deleteRefreshToken(token);
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out' });
  } catch (err) {
    next(err);
  }
}

async function refresh(req, res, next) {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const data = await rotateRefreshToken(token);
    if (!data) return res.status(401).json({ error: 'Unauthorized' });

    const accessToken = generateAccessToken(data.user);
    res.cookie('refreshToken', data.newToken.token, getCookieOptions());
    res.json({ accessToken });
  } catch (err) {
    next(err);
  }
}

function me(req, res) {
  const { user } = req;
  res.json({ id: user.userId, role: user.role });
}

module.exports = { signup, login, logout, refresh, me };
