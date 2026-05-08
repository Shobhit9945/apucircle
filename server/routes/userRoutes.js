import express from 'express';
import { body } from 'express-validator';
import { applyForClubLeader, changePassword, getMe, getMyClubs, updateMe } from '../controllers/userController.js';
import { requireAuth, requireStudentLike } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

router.use(requireAuth);

router.get('/me', asyncHandler(getMe));

router.put(
  '/me',
  [
    body('fullName').optional().trim().isLength({ min: 2, max: 80 }),
    body('languageBasis').optional().isIn(['English', 'Japanese']),
    body('semester').optional().isInt({ min: 1, max: 12 }).toInt(),
    body('interests').optional().isArray(),
    body('interests.*').optional().trim().isLength({ min: 1, max: 40 })
  ],
  validate,
  asyncHandler(updateMe)
);

router.get('/me/clubs', asyncHandler(getMyClubs));

router.put(
  '/me/password',
  [
    body('currentPassword').notEmpty(),
    body('newPassword')
      .isLength({ min: 8 })
      .matches(/[A-Z]/)
      .matches(/\d/)
  ],
  validate,
  asyncHandler(changePassword)
);

router.post(
  '/applications',
  requireStudentLike,
  [
    body('clubId').isMongoId(),
    body('reason').trim().isLength({ min: 50, max: 500 })
  ],
  validate,
  asyncHandler(applyForClubLeader)
);

export default router;
