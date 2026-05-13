import express from 'express';
import { body, param } from 'express-validator';
import {
  login,
  logout,
  refresh,
  register,
  resendVerification,
  staffLogin,
  verifyEmail
} from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

const passwordRule = body('password')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters')
  .matches(/[A-Z]/)
  .withMessage('Password must include at least one uppercase letter')
  .matches(/\d/)
  .withMessage('Password must include at least one number');

router.post(
  '/register',
  authLimiter,
  [
    body('fullName').trim().isLength({ min: 2, max: 80 }),
    body('email').isEmail().normalizeEmail().custom((email) => email.endsWith('@apu.ac.jp')),
    passwordRule,
    body('languageBasis').optional().isIn(['English', 'Japanese']),
    body('semester').optional().isInt({ min: 1, max: 12 }).toInt(),
    body('interests').optional().isArray(),
    body('interests.*').optional().trim().isLength({ min: 1, max: 40 })
  ],
  validate,
  asyncHandler(register)
);

router.post(
  '/resend-verification',
  authLimiter,
  [body('email').isEmail().normalizeEmail().custom((email) => email.endsWith('@apu.ac.jp'))],
  validate,
  asyncHandler(resendVerification)
);

router.get(
  '/verify/:token',
  authLimiter,
  [param('token').isLength({ min: 32, max: 128 })],
  validate,
  asyncHandler(verifyEmail)
);

router.post(
  '/login',
  authLimiter,
  [body('email').isEmail().normalizeEmail(), body('password').notEmpty()],
  validate,
  asyncHandler(login)
);

router.post(
  '/staff/login',
  authLimiter,
  [body('email').isEmail().normalizeEmail(), body('password').notEmpty()],
  validate,
  asyncHandler(staffLogin)
);

router.post('/logout', requireAuth, asyncHandler(logout));
router.post('/refresh', authLimiter, asyncHandler(refresh));

export default router;
