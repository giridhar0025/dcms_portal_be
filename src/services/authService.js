const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { prisma } = require('../config/database');

async function createUser(data) {
  const hashed = await bcrypt.hash(data.password, 10);
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashed,
      role: data.role || 'receptionist',
    },
  });
}

function generateAccessToken(user) {
  return jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
}

async function getUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

async function validatePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

async function createRefreshToken(userId) {
  const token = crypto.randomBytes(40).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const newToken = await prisma.refreshToken.create({
    data: { token, userId, expiresAt },
  });
  return newToken;
}

async function deleteRefreshToken(token) {
  await prisma.refreshToken.deleteMany({ where: { token } });
}

async function rotateRefreshToken(token) {
  const stored = await prisma.refreshToken.findUnique({
    where: { token },
    include: { user: true },
  });
  if (!stored || stored.expiresAt < new Date()) {
    if (stored) await prisma.refreshToken.delete({ where: { token } });
    return null;
  }
  await prisma.refreshToken.delete({ where: { token } });
  const newToken = await createRefreshToken(stored.userId);
  return { user: stored.user, newToken };
}

module.exports = {
  createUser,
  generateAccessToken,
  getUserByEmail,
  validatePassword,
  createRefreshToken,
  deleteRefreshToken,
  rotateRefreshToken,
};

