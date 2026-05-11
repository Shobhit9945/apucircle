import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const isProduction = process.env.NODE_ENV === 'production';

function requireSecret(name) {
  if (!process.env[name]) {
    throw new Error(`${name} is required`);
  }
  return process.env[name];
}

export function signAccessToken(user) {
  return jwt.sign(
    { userId: user._id.toString(), role: user.role },
    requireSecret('JWT_ACCESS_SECRET'),
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m' }
  );
}

export function signRefreshToken(user) {
  return jwt.sign(
    { userId: user._id.toString(), nonce: crypto.randomBytes(16).toString('hex') },
    requireSecret('JWT_REFRESH_SECRET'),
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d' }
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(token, requireSecret('JWT_ACCESS_SECRET'));
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, requireSecret('JWT_REFRESH_SECRET'));
}

export async function hashRefreshToken(refreshToken) {
  return bcrypt.hash(refreshToken, 12);
}

export async function refreshTokenMatches(refreshToken, hash) {
  if (!refreshToken || !hash) return false;
  return bcrypt.compare(refreshToken, hash);
}

export function authCookieOptions(maxAgeMs) {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: maxAgeMs,
    path: '/'
  };
}

export async function setAuthCookies(res, user) {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  user.refreshTokenHash = await hashRefreshToken(refreshToken);
  await user.save();

  res.cookie('accessToken', accessToken, authCookieOptions(15 * 60 * 1000));
  res.cookie('refreshToken', refreshToken, authCookieOptions(7 * 24 * 60 * 60 * 1000));
}

export function clearAuthCookies(res) {
  res.clearCookie('accessToken', { path: '/' });
  res.clearCookie('refreshToken', { path: '/' });
}
