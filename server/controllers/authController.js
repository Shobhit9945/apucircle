import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { HttpError } from '../utils/httpError.js';
import { sendVerificationEmail } from '../utils/email.js';
import {
  clearAuthCookies,
  refreshTokenMatches,
  setAuthCookies,
  verifyRefreshToken
} from '../utils/tokens.js';

const STUDENT_EMAIL_DOMAIN = '@apu.ac.jp';

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function assertStudentEmail(email) {
  if (!email.endsWith(STUDENT_EMAIL_DOMAIN)) {
    throw new HttpError(422, `Student email must end with ${STUDENT_EMAIL_DOMAIN}`);
  }
}

export async function register(req, res) {
  const email = normalizeEmail(req.body.email);
  assertStudentEmail(email);

  const existing = await User.findOne({ email });
  if (existing && existing.isVerified) {
    throw new HttpError(409, 'An account with this email already exists');
  }

  const verificationToken = crypto.randomBytes(32).toString('hex');
  const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  let user;
  const isNew = !existing;

  if (existing) {
    existing.verificationToken = verificationToken;
    existing.verificationTokenExpires = verificationTokenExpires;
    await existing.save();
    user = existing;
  } else {
    const passwordHash = await bcrypt.hash(req.body.password, 10);
    user = await User.create({
      fullName: req.body.fullName,
      email,
      passwordHash,
      languageBasis: req.body.languageBasis || 'English',
      semester: req.body.semester || 1,
      interests: req.body.interests || [],
      verificationToken,
      verificationTokenExpires,
      isVerified: false,
      role: 'student'
    });
  }

  try {
    await sendVerificationEmail(user, verificationToken);
  } catch (err) {
    console.error('[APUCircle] Failed to send verification email:', err);
    if (isNew) {
      await User.deleteOne({ _id: user._id });
    }
    throw new HttpError(
      502,
      'We could not send your verification email. Please try again in a few minutes or contact support.'
    );
  }

  res.status(isNew ? 201 : 200).json({
    message: 'Registration successful. Please check your email to verify your account.',
    email: user.email
  });
}

export async function resendVerification(req, res) {
  const email = normalizeEmail(req.body.email);
  assertStudentEmail(email);

  const successMessage =
    'If an unverified account exists for that email, a new verification link has been sent.';

  const user = await User.findOne({ email });
  if (!user || user.isVerified) {
    return res.json({ message: successMessage });
  }

  const verificationToken = crypto.randomBytes(32).toString('hex');
  user.verificationToken = verificationToken;
  user.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await user.save();

  try {
    await sendVerificationEmail(user, verificationToken);
  } catch (err) {
    console.error('[APUCircle] Failed to resend verification email:', err);
    throw new HttpError(500, 'Could not send verification email. Please try again later.');
  }

  res.json({ message: successMessage });
}

export async function verifyEmail(req, res) {
  const user = await User.findOne({
    verificationToken: req.params.token,
    verificationTokenExpires: { $gt: new Date() }
  });

  if (!user) throw new HttpError(400, 'Verification link is invalid or expired');

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  await user.save();

  res.json({ message: 'Email verified. You can now log in.' });
}

async function loginUser({ email, password, staffOnly = false }) {
  const user = await User.findOne({ email: normalizeEmail(email) }).select('+passwordHash +refreshTokenHash');
  if (!user) throw new HttpError(401, 'Invalid email or password');

  if (staffOnly && user.role !== 'staff') throw new HttpError(401, 'Invalid staff credentials');
  if (!staffOnly && user.role === 'staff') {
    throw new HttpError(403, 'Staff accounts must use the staff login portal');
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) throw new HttpError(401, 'Invalid email or password');
  if (!user.isVerified) throw new HttpError(403, 'Please verify your email before logging in');

  user.lastLoginAt = new Date();
  return user;
}

export async function login(req, res) {
  const user = await loginUser(req.body);
  await setAuthCookies(res, user);
  res.json({ user: user.toPublicJSON() });
}

export async function staffLogin(req, res) {
  const user = await loginUser({ ...req.body, staffOnly: true });
  await setAuthCookies(res, user);
  res.json({ user: user.toPublicJSON() });
}

export async function logout(req, res) {
  if (req.user) {
    await User.updateOne({ _id: req.user._id }, { $unset: { refreshTokenHash: '' } });
  }

  clearAuthCookies(res);
  res.json({ message: 'Logged out' });
}

export async function refresh(req, res) {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) throw new HttpError(401, 'Refresh token is required');

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (_error) {
    clearAuthCookies(res);
    throw new HttpError(401, 'Invalid refresh token');
  }

  const user = await User.findById(payload.userId).select('+refreshTokenHash');
  if (!user || !user.isVerified) {
    clearAuthCookies(res);
    throw new HttpError(401, 'Invalid refresh token');
  }

  const matches = await refreshTokenMatches(refreshToken, user.refreshTokenHash);
  if (!matches) {
    user.refreshTokenHash = undefined;
    await user.save();
    clearAuthCookies(res);
    throw new HttpError(401, 'Refresh token reuse detected. Please log in again.');
  }

  await setAuthCookies(res, user);
  res.json({ user: user.toPublicJSON() });
}
