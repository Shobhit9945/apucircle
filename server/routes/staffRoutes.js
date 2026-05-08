import express from 'express';
import { body, param } from 'express-validator';
import {
  createPlatformAnnouncement,
  getAnalytics,
  listApplications,
  listStaffClubs,
  listUsers,
  reviewApplication,
  suspendClub,
  verifyClub
} from '../controllers/staffController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

router.use(requireAuth, requireRole('staff'));

router.get('/clubs', asyncHandler(listStaffClubs));
router.get('/users', asyncHandler(listUsers));
router.get('/applications', asyncHandler(listApplications));
router.put(
  '/applications/:id',
  [param('id').isMongoId(), body('status').isIn(['approved', 'rejected'])],
  validate,
  asyncHandler(reviewApplication)
);
router.put(
  '/clubs/:id/verify',
  [param('id').isMongoId(), body('isVerifiedByStaff').optional().isBoolean().toBoolean()],
  validate,
  asyncHandler(verifyClub)
);
router.put('/clubs/:id/suspend', [param('id').isMongoId()], validate, asyncHandler(suspendClub));
router.get('/analytics', asyncHandler(getAnalytics));
router.post(
  '/announcements',
  [body('title').trim().isLength({ min: 3, max: 140 }), body('body').trim().isLength({ min: 1, max: 2000 })],
  validate,
  asyncHandler(createPlatformAnnouncement)
);

export default router;
