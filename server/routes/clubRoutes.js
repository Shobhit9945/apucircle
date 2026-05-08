import express from 'express';
import { body, param, query } from 'express-validator';
import {
  approveJoinRequest,
  archiveClub,
  createClub,
  getClubBySlug,
  leaveClub,
  listClubs,
  requestToJoinClub,
  updateClub
} from '../controllers/clubController.js';
import {
  optionalAuth,
  requireAuth,
  requireClubLeader,
  requireClubLeaderOrStaff,
  requireRole,
  requireStudentLike
} from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { CLUB_CATEGORIES } from '../models/Club.js';

const router = express.Router();

function maybe(chain, required) {
  return required ? chain : chain.optional({ nullable: true });
}

function clubValidators(required = true) {
  return [
    maybe(body('name'), required).trim().isLength({ min: 3, max: 60 }),
    maybe(body('description'), required).trim().isLength({ min: 20, max: 3000 }),
    maybe(body('category'), required).isIn(CLUB_CATEGORIES),
    body('tags').optional().isArray(),
    body('tags.*').optional().trim().isLength({ min: 1, max: 40 }),
    maybe(body('languageOfOperation'), required).isIn(['English', 'Japanese', 'Bilingual']),
    maybe(body('meetingSchedule'), required).trim().isLength({ min: 3, max: 180 }),
    body('bannerImage').optional({ nullable: true, checkFalsy: true }).isURL(),
    body('profileImage').optional({ nullable: true, checkFalsy: true }).isURL(),
    body('instagramHandle').optional({ nullable: true }).trim().isLength({ max: 80 }),
    maybe(body('contactEmail'), required).isEmail().normalizeEmail()
  ];
}

router.get(
  '/',
  optionalAuth,
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
    query('category').optional().isIn(CLUB_CATEGORIES),
    query('language').optional().isIn(['English', 'Japanese', 'Bilingual'])
  ],
  validate,
  asyncHandler(listClubs)
);

router.post('/', requireAuth, requireRole('staff'), clubValidators(true), validate, asyncHandler(createClub));

router.get('/:slug', optionalAuth, [param('slug').trim().isLength({ min: 1, max: 100 })], validate, asyncHandler(getClubBySlug));

router.put(
  '/:id',
  requireAuth,
  [param('id').isMongoId(), ...clubValidators(false)],
  validate,
  requireClubLeaderOrStaff('id'),
  asyncHandler(updateClub)
);

router.delete(
  '/:id',
  requireAuth,
  requireRole('staff'),
  [param('id').isMongoId()],
  validate,
  asyncHandler(archiveClub)
);

router.post(
  '/:id/join',
  requireAuth,
  requireStudentLike,
  [param('id').isMongoId()],
  validate,
  asyncHandler(requestToJoinClub)
);

router.post(
  '/:id/approve/:userId',
  requireAuth,
  [param('id').isMongoId(), param('userId').isMongoId()],
  validate,
  requireClubLeader('id'),
  asyncHandler(approveJoinRequest)
);

router.post(
  '/:id/leave',
  requireAuth,
  requireStudentLike,
  [param('id').isMongoId()],
  validate,
  asyncHandler(leaveClub)
);

export default router;
