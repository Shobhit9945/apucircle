import Announcement from '../models/Announcement.js';
import Notification from '../models/Notification.js';
import { HttpError } from '../utils/httpError.js';

const REACTION_KEYS = ['thumbs_up', 'heart', 'fire'];

function reactionSummary(announcement) {
  const reactions = announcement.reactions || {};
  return Object.fromEntries(
    REACTION_KEYS.map((key) => [
      key,
      {
        count: reactions[key]?.length || 0,
        users: reactions[key] || []
      }
    ])
  );
}

function serializeAnnouncement(announcement, currentUserId = null) {
  const object = announcement.toObject ? announcement.toObject() : announcement;
  const userId = currentUserId?.toString();
  return {
    ...object,
    reactionSummary: reactionSummary(object),
    myReactions: userId
      ? REACTION_KEYS.filter((key) => (object.reactions?.[key] || []).some((id) => id.toString() === userId))
      : []
  };
}

export async function listAnnouncements(req, res) {
  const announcements = await Announcement.find({ clubId: req.params.clubId })
    .populate('authorId', 'fullName')
    .sort({ isPinned: -1, createdAt: -1 });

  res.json({
    announcements: announcements.map((announcement) => serializeAnnouncement(announcement, req.user._id))
  });
}

export async function createAnnouncement(req, res) {
  const announcement = await Announcement.create({
    clubId: req.params.clubId,
    authorId: req.user._id,
    title: req.body.title,
    body: req.body.body,
    isPinned: Boolean(req.body.isPinned)
  });

  const recipients = new Set([
    ...req.club.members.map((member) => member.userId.toString()),
    ...req.club.leaders.map((leader) => leader.userId.toString())
  ]);
  recipients.delete(req.user._id.toString());

  const notifications = Array.from(recipients).map((recipientId) => ({
      recipientId,
      type: 'announcement_posted',
      title: `New announcement in ${req.club.name}`,
      body: req.body.title,
      link: `/clubs/${req.club.slug}`,
      clubId: req.club._id,
      actorId: req.user._id
  }));
  if (notifications.length) await Notification.insertMany(notifications);

  res.status(201).json({ announcement: serializeAnnouncement(announcement, req.user._id) });
}

export async function updateAnnouncement(req, res) {
  const announcement = await Announcement.findOne({
    _id: req.params.id,
    clubId: req.params.clubId
  });
  if (!announcement) throw new HttpError(404, 'Announcement not found');

  for (const field of ['title', 'body', 'isPinned']) {
    if (req.body[field] !== undefined) announcement[field] = req.body[field];
  }

  await announcement.save();
  res.json({ announcement: serializeAnnouncement(announcement, req.user._id) });
}

export async function deleteAnnouncement(req, res) {
  const result = await Announcement.deleteOne({ _id: req.params.id, clubId: req.params.clubId });
  if (!result.deletedCount) throw new HttpError(404, 'Announcement not found');
  res.json({ message: 'Announcement deleted' });
}

export async function toggleReaction(req, res) {
  const { reaction } = req.body;
  if (!REACTION_KEYS.includes(reaction)) throw new HttpError(422, 'Unsupported reaction');

  const announcement = await Announcement.findOne({
    _id: req.params.id,
    clubId: req.params.clubId
  });
  if (!announcement) throw new HttpError(404, 'Announcement not found');

  const reactions = announcement.reactions?.[reaction] || [];
  const userId = req.user._id.toString();
  const existingIndex = reactions.findIndex((id) => id.toString() === userId);

  if (existingIndex >= 0) {
    reactions.splice(existingIndex, 1);
  } else {
    reactions.push(req.user._id);
  }

  announcement.reactions[reaction] = reactions;
  announcement.markModified('reactions');
  await announcement.save();

  res.json({ announcement: serializeAnnouncement(announcement, req.user._id) });
}
