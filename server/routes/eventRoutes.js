import express from 'express';
import { body, param } from 'express-validator';
import { createEvent, deleteEvent, listEvents, updateEvent } from '../controllers/eventController.js';
import { requireAuth, requireClubLeader, requireClubMemberOrLeader } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router({ mergeParams: true });

router.use(requireAuth);
router.use([param('clubId').isMongoId()], validate);

function maybe(chain, required) {
  return required ? chain : chain.optional({ nullable: true });
}

function eventValidators(required = true) {
  return [
    maybe(body('title'), required).trim().isLength({ min: 3, max: 120 }),
    maybe(body('description'), required).trim().isLength({ min: 1, max: 2000 }),
    maybe(body('location'), required).trim().isLength({ min: 2, max: 160 }),
    maybe(body('eventDate'), required).isISO8601().toDate()
  ];
}

router.get('/', requireClubMemberOrLeader('clubId'), asyncHandler(listEvents));
router.post('/', eventValidators(true), validate, requireClubLeader('clubId'), asyncHandler(createEvent));
router.put(
  '/:id',
  [param('id').isMongoId(), ...eventValidators(false)],
  validate,
  requireClubLeader('clubId'),
  asyncHandler(updateEvent)
);
router.delete('/:id', [param('id').isMongoId()], validate, requireClubLeader('clubId'), asyncHandler(deleteEvent));

export default router;
