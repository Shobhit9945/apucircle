import Notification from '../models/Notification.js';
import { HttpError } from '../utils/httpError.js';

export async function listNotifications(req, res) {
  const [notifications, unreadCount] = await Promise.all([
    Notification.find({ recipientId: req.user._id }).sort({ createdAt: -1 }).limit(40),
    Notification.countDocuments({ recipientId: req.user._id, readAt: null })
  ]);

  res.json({ notifications, unreadCount });
}

export async function markNotificationRead(req, res) {
  const notification = await Notification.findOne({
    _id: req.params.id,
    recipientId: req.user._id
  });
  if (!notification) throw new HttpError(404, 'Notification not found');

  notification.readAt = notification.readAt || new Date();
  await notification.save();
  res.json({ notification });
}

export async function markAllNotificationsRead(req, res) {
  await Notification.updateMany(
    { recipientId: req.user._id, readAt: null },
    { $set: { readAt: new Date() } }
  );
  res.json({ message: 'Notifications marked as read' });
}
