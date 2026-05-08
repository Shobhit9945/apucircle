import Announcement from '../models/Announcement.js';
import Club from '../models/Club.js';
import ClubLeaderApplication from '../models/ClubLeaderApplication.js';
import Notification from '../models/Notification.js';
import PlatformAnnouncement from '../models/PlatformAnnouncement.js';
import User from '../models/User.js';
import { HttpError } from '../utils/httpError.js';

export async function listStaffClubs(req, res) {
  const query = {};
  if (req.query.status === 'active') query.isActive = true;
  if (req.query.status === 'suspended') query.isActive = false;
  if (req.query.verified === 'true') query.isVerifiedByStaff = true;
  if (req.query.verified === 'false') query.isVerifiedByStaff = false;

  const clubs = await Club.find(query)
    .populate('leaders.userId', 'fullName email')
    .sort({ createdAt: -1 });

  res.json({ clubs });
}

export async function listUsers(req, res) {
  const users = await User.find({})
    .select('-verificationToken -refreshTokenHash')
    .sort({ createdAt: -1 })
    .limit(200);
  res.json({ users });
}

export async function listApplications(req, res) {
  const query = req.query.status ? { status: req.query.status } : {};
  const applications = await ClubLeaderApplication.find(query)
    .populate('userId', 'fullName email semester languageBasis')
    .populate('clubId', 'name slug category')
    .populate('reviewedBy', 'fullName email')
    .sort({ createdAt: -1 });
  res.json({ applications });
}

export async function reviewApplication(req, res) {
  const application = await ClubLeaderApplication.findById(req.params.id);
  if (!application) throw new HttpError(404, 'Application not found');
  if (application.status !== 'pending') throw new HttpError(409, 'Application has already been reviewed');

  const { status } = req.body;
  if (!['approved', 'rejected'].includes(status)) throw new HttpError(422, 'Status must be approved or rejected');

  const [user, club] = await Promise.all([
    User.findById(application.userId),
    Club.findById(application.clubId)
  ]);
  if (!user || !club) throw new HttpError(404, 'Application user or club no longer exists');

  application.status = status;
  application.reviewedBy = req.user._id;
  application.reviewedAt = new Date();

  if (status === 'approved') {
    user.role = 'club_leader';
    if (!club.leaders.some((leader) => leader.userId.toString() === user._id.toString())) {
      club.leaders.push({ userId: user._id, role: 'Club Leader', joinedAt: new Date() });
    }
    if (!club.members.some((member) => member.userId.toString() === user._id.toString())) {
      club.members.push({ userId: user._id, joinedAt: new Date() });
    }
    if (!user.joinedClubs.some((entry) => entry.clubId.toString() === club._id.toString())) {
      user.joinedClubs.push({ clubId: club._id, joinedAt: new Date() });
    }
  }

  await Promise.all([
    application.save(),
    user.save(),
    club.save(),
    Notification.create({
      recipientId: user._id,
      type: 'leader_application',
      title: status === 'approved' ? 'Leader application approved' : 'Leader application reviewed',
      body:
        status === 'approved'
          ? `You can now manage ${club.name}.`
          : `Your application to manage ${club.name} was not approved.`,
      link: `/clubs/${club.slug}`,
      clubId: club._id,
      actorId: req.user._id,
      applicationId: application._id
    })
  ]);

  res.json({ application, user: user.toPublicJSON(), club });
}

export async function verifyClub(req, res) {
  const club = await Club.findById(req.params.id);
  if (!club) throw new HttpError(404, 'Club not found');

  club.isVerifiedByStaff = req.body.isVerifiedByStaff ?? true;
  await club.save();
  res.json({ club });
}

export async function suspendClub(req, res) {
  const club = await Club.findById(req.params.id);
  if (!club) throw new HttpError(404, 'Club not found');

  club.isActive = false;
  await club.save();
  res.json({ club });
}

export async function getAnalytics(req, res) {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [totalUsers, activeClubs, pendingApplications, clubs, recentJoins, recentAnnouncements] =
    await Promise.all([
      User.countDocuments({ role: { $ne: 'staff' } }),
      Club.countDocuments({ isActive: true }),
      ClubLeaderApplication.countDocuments({ status: 'pending' }),
      Club.find({}).select('name slug members isActive category'),
      Club.aggregate([
        { $unwind: '$members' },
        { $match: { 'members.joinedAt': { $gte: thirtyDaysAgo } } },
        { $count: 'count' }
      ]),
      Announcement.countDocuments({ createdAt: { $gte: thirtyDaysAgo } })
    ]);

  res.json({
    totalUsers,
    activeClubs,
    pendingApplications,
    recentJoins: recentJoins[0]?.count || 0,
    recentAnnouncements,
    joinRates: clubs.map((club) => ({
      clubId: club._id,
      name: club.name,
      slug: club.slug,
      category: club.category,
      isActive: club.isActive,
      members: club.members.length
    }))
  });
}

export async function createPlatformAnnouncement(req, res) {
  const announcement = await PlatformAnnouncement.create({
    authorId: req.user._id,
    title: req.body.title,
    body: req.body.body,
    isPublished: true
  });

  const recipients = await User.find({ role: { $ne: 'staff' }, isVerified: true }).select('_id');
  const notifications = recipients.map((recipient) => ({
      recipientId: recipient._id,
      type: 'platform',
      title: req.body.title,
      body: req.body.body.slice(0, 300),
      link: '/dashboard',
      actorId: req.user._id
  }));
  if (notifications.length) await Notification.insertMany(notifications);

  res.status(201).json({ announcement });
}
