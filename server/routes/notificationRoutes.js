import express from 'express';
import { param } from 'express-validator';
import {
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead
} from '../controllers/notificationController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

router.use(requireAuth);
router.get('/', asyncHandler(listNotifications));
router.put('/read-all', asyncHandler(markAllNotificationsRead));
router.put('/:id/read', [param('id').isMongoId()], validate, asyncHandler(markNotificationRead));

export default router;
