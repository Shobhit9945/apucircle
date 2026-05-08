import express from 'express';
import { body, param } from 'express-validator';
import {
  createAnnouncement,
  deleteAnnouncement,
  listAnnouncements,
  toggleReaction,
  updateAnnouncement
} from '../controllers/announcementController.js';
import { requireAuth, requireClubLeader, requireClubMemberOrLeader } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router({ mergeParams: true });

router.use(requireAuth);
router.use([param('clubId').isMongoId()], validate);

router.get('/', requireClubMemberOrLeader('clubId'), asyncHandler(listAnnouncements));

router.post(
  '/',
  [body('title').trim().isLength({ min: 3, max: 100 }), body('body').trim().isLength({ min: 1, max: 2000 }), body('isPinned').optional().isBoolean().toBoolean()],
  validate,
  requireClubLeader('clubId'),
  asyncHandler(createAnnouncement)
);

router.put(
  '/:id',
  [
    param('id').isMongoId(),
    body('title').optional().trim().isLength({ min: 3, max: 100 }),
    body('body').optional().trim().isLength({ min: 1, max: 2000 }),
    body('isPinned').optional().isBoolean().toBoolean()
  ],
  validate,
  requireClubLeader('clubId'),
  asyncHandler(updateAnnouncement)
);

router.delete('/:id', [param('id').isMongoId()], validate, requireClubLeader('clubId'), asyncHandler(deleteAnnouncement));

router.post(
  '/:id/reactions',
  [param('id').isMongoId(), body('reaction').isIn(['thumbs_up', 'heart', 'fire'])],
  validate,
  requireClubMemberOrLeader('clubId'),
  asyncHandler(toggleReaction)
);

export default router;
