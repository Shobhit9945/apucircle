import bcrypt from 'bcryptjs';
import Club from '../models/Club.js';
import ClubLeaderApplication from '../models/ClubLeaderApplication.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { HttpError } from '../utils/httpError.js';

export async function getMe(req, res) {
  res.json({ user: req.user.toPublicJSON() });
}

export async function updateMe(req, res) {
  const allowed = ['fullName', 'languageBasis', 'semester', 'interests'];
  for (const field of allowed) {
    if (req.body[field] !== undefined) req.user[field] = req.body[field];
  }

  await req.user.save();
  res.json({ user: req.user.toPublicJSON() });
}

export async function changePassword(req, res) {
  const user = await User.findById(req.user._id).select('+passwordHash +refreshTokenHash');
  const matches = await bcrypt.compare(req.body.currentPassword, user.passwordHash);
  if (!matches) throw new HttpError(401, 'Current password is incorrect');

  user.passwordHash = await bcrypt.hash(req.body.newPassword, 12);
  user.refreshTokenHash = undefined;
  await user.save();

  res.json({ message: 'Password changed. Please log in again on other devices.' });
}

export async function getMyClubs(req, res) {
  const clubIds = req.user.joinedClubs.map((entry) => entry.clubId);
  const clubs = await Club.find({ _id: { $in: clubIds }, isActive: true }).sort({ name: 1 });
  res.json({ clubs });
}

export async function applyForClubLeader(req, res) {
  const club = await Club.findById(req.body.clubId);
  if (!club || !club.isActive) throw new HttpError(404, 'Club not found');

  const alreadyLeader = club.leaders.some((leader) => leader.userId.toString() === req.user._id.toString());
  if (alreadyLeader) throw new HttpError(409, 'You are already a leader of this club');

  const existingPending = await ClubLeaderApplication.findOne({
    userId: req.user._id,
    clubId: club._id,
    status: 'pending'
  });
  if (existingPending) throw new HttpError(409, 'You already have a pending application for this club');

  const application = await ClubLeaderApplication.create({
    userId: req.user._id,
    clubId: club._id,
    reason: req.body.reason
  });

  const staff = await User.find({ role: 'staff', isVerified: true }).select('_id');
  const notifications = staff.map((staffUser) => ({
      recipientId: staffUser._id,
      type: 'leader_application',
      title: 'New club leader application',
      body: `${req.user.fullName} applied to lead ${club.name}.`,
      link: '/staff/applications',
      actorId: req.user._id,
      clubId: club._id,
      applicationId: application._id
  }));
  if (notifications.length) await Notification.insertMany(notifications);

  res.status(201).json({ application });
}
