import slugify from 'slugify';
import Announcement from '../models/Announcement.js';
import Club from '../models/Club.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { getActivityStatus } from '../utils/activity.js';
import { HttpError } from '../utils/httpError.js';
import { isClubLeader, isClubMember } from '../middleware/auth.js';

async function uniqueSlug(name, currentClubId = null) {
  const base = slugify(name, { lower: true, strict: true, trim: true }) || 'club';
  let slug = base;
  let counter = 2;

  while (await Club.exists({ slug, ...(currentClubId ? { _id: { $ne: currentClubId } } : {}) })) {
    slug = `${base}-${counter}`;
    counter += 1;
  }

  return slug;
}

async function latestAnnouncementMap(clubIds) {
  const latest = await Announcement.aggregate([
    { $match: { clubId: { $in: clubIds } } },
    { $sort: { createdAt: -1 } },
    { $group: { _id: '$clubId', lastAnnouncementAt: { $first: '$createdAt' } } }
  ]);

  return new Map(latest.map((entry) => [entry._id.toString(), entry.lastAnnouncementAt]));
}

function serializeClub(club, latestMap = new Map(), user = null) {
  const object = club.toObject ? club.toObject() : club;
  const lastAnnouncementAt = latestMap.get(object._id.toString()) || null;
  const member = user ? isClubMember(user, club) : false;
  const leader = user ? isClubLeader(user, club) : false;
  const { joinRequests, members, ...publicClub } = object;

  return {
    ...publicClub,
    members: member || leader ? members : undefined,
    joinRequests: leader ? joinRequests : undefined,
    memberCount: members?.length || 0,
    joinRequestCount: leader ? joinRequests?.length || 0 : undefined,
    lastAnnouncementAt,
    activityStatus: getActivityStatus(lastAnnouncementAt),
    isMember: member,
    isLeader: leader
  };
}

export async function listClubs(req, res) {
  const {
    category,
    language,
    tags,
    q,
    search,
    status = 'active',
    page = 1,
    limit = 12
  } = req.query;

  const query = {};
  if (status === 'active') query.isActive = true;
  if (status === 'verified') {
    query.isActive = true;
    query.isVerifiedByStaff = true;
  }
  if (category) query.category = category;
  if (language) query.languageOfOperation = language;

  if (tags) {
    const tagList = String(tags)
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
    if (tagList.length) query.tags = { $in: tagList };
  }

  const keyword = q || search;
  if (keyword) {
    const regex = new RegExp(String(keyword).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    query.$or = [{ name: regex }, { description: regex }, { tags: regex }, { category: regex }];
  }

  const pageNumber = Math.max(Number(page) || 1, 1);
  const pageSize = Math.min(Math.max(Number(limit) || 12, 1), 50);

  const [clubs, total] = await Promise.all([
    Club.find(query)
      .sort({ isVerifiedByStaff: -1, createdAt: -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize),
    Club.countDocuments(query)
  ]);

  const latestMap = await latestAnnouncementMap(clubs.map((club) => club._id));

  res.json({
    clubs: clubs.map((club) => serializeClub(club, latestMap, req.user)),
    pagination: {
      total,
      page: pageNumber,
      pages: Math.ceil(total / pageSize),
      limit: pageSize
    }
  });
}

export async function getClubBySlug(req, res) {
  const club = await Club.findOne({ slug: req.params.slug })
    .populate('leaders.userId', 'fullName email')
    .populate('members.userId', 'fullName email')
    .populate('joinRequests.userId', 'fullName email');

  if (!club || (!club.isActive && req.user?.role !== 'staff')) throw new HttpError(404, 'Club not found');

  const latestMap = await latestAnnouncementMap([club._id]);
  res.json({ club: serializeClub(club, latestMap, req.user) });
}

export async function createClub(req, res) {
  const slug = await uniqueSlug(req.body.name);
  const club = await Club.create({
    ...req.body,
    slug,
    leaders: req.body.leaders || [],
    members: req.body.members || []
  });

  res.status(201).json({ club: serializeClub(club) });
}

export async function updateClub(req, res) {
  const club = req.club || (await Club.findById(req.params.id));
  if (!club) throw new HttpError(404, 'Club not found');
  const originalName = club.name;

  const editable = [
    'name',
    'description',
    'category',
    'tags',
    'languageOfOperation',
    'meetingSchedule',
    'bannerImage',
    'profileImage',
    'instagramHandle',
    'contactEmail'
  ];

  if (req.user.role === 'staff') {
    editable.push('isActive', 'isVerifiedByStaff', 'leaders');
  }

  for (const field of editable) {
    if (req.body[field] !== undefined) club[field] = req.body[field];
  }

  if (req.body.name && req.body.name !== originalName) {
    club.slug = await uniqueSlug(req.body.name, club._id);
  }

  await club.save();
  const latestMap = await latestAnnouncementMap([club._id]);
  res.json({ club: serializeClub(club, latestMap, req.user) });
}

export async function archiveClub(req, res) {
  const club = await Club.findById(req.params.id);
  if (!club) throw new HttpError(404, 'Club not found');

  club.isActive = false;
  await club.save();
  res.json({ message: 'Club archived', club: serializeClub(club) });
}

export async function requestToJoinClub(req, res) {
  const club = await Club.findById(req.params.id);
  if (!club || !club.isActive) throw new HttpError(404, 'Club not found');

  const userId = req.user._id.toString();
  const joinedCount = req.user.joinedClubs.length;
  if (joinedCount >= 10) throw new HttpError(409, 'You cannot join more than 10 clubs');

  if (club.members.some((member) => member.userId.toString() === userId)) {
    throw new HttpError(409, 'You are already a member of this club');
  }

  if (club.joinRequests.some((request) => request.userId.toString() === userId)) {
    throw new HttpError(409, 'You already requested to join this club');
  }

  club.joinRequests.push({ userId: req.user._id, requestedAt: new Date() });
  await club.save();

  const notifications = club.leaders.map((leader) => ({
      recipientId: leader.userId,
      type: 'join_requested',
      title: 'New join request',
      body: `${req.user.fullName} requested to join ${club.name}.`,
      link: `/clubs/${club.slug}`,
      clubId: club._id,
      actorId: req.user._id
  }));
  if (notifications.length) await Notification.insertMany(notifications);

  res.status(201).json({
    message: 'Join request submitted',
    warning: joinedCount >= 8 ? 'You are close to the 10 club membership limit.' : null,
    club: serializeClub(club, new Map(), req.user)
  });
}

export async function approveJoinRequest(req, res) {
  const club = req.club;
  const user = await User.findById(req.params.userId);
  if (!user) throw new HttpError(404, 'User not found');

  const userId = user._id.toString();
  const requestIndex = club.joinRequests.findIndex((request) => request.userId.toString() === userId);
  if (requestIndex === -1) throw new HttpError(404, 'Join request not found');
  if (user.joinedClubs.length >= 10) throw new HttpError(409, 'This student cannot join more than 10 clubs');

  club.joinRequests.splice(requestIndex, 1);
  if (!club.members.some((member) => member.userId.toString() === userId)) {
    club.members.push({ userId: user._id, joinedAt: new Date() });
  }

  if (!user.joinedClubs.some((entry) => entry.clubId.toString() === club._id.toString())) {
    user.joinedClubs.push({ clubId: club._id, joinedAt: new Date() });
  }

  await Promise.all([
    club.save(),
    user.save(),
    Notification.create({
      recipientId: user._id,
      type: 'join_approved',
      title: 'Join request approved',
      body: `You are now a member of ${club.name}.`,
      link: `/clubs/${club.slug}`,
      clubId: club._id,
      actorId: req.user._id
    })
  ]);

  res.json({ message: 'Join request approved', club: serializeClub(club, new Map(), req.user) });
}

export async function leaveClub(req, res) {
  const club = await Club.findById(req.params.id);
  if (!club) throw new HttpError(404, 'Club not found');

  if (club.leaders.some((leader) => leader.userId.toString() === req.user._id.toString())) {
    throw new HttpError(409, 'Club leaders must transfer leadership before leaving a managed club');
  }

  club.members = club.members.filter((member) => member.userId.toString() !== req.user._id.toString());
  req.user.joinedClubs = req.user.joinedClubs.filter((entry) => entry.clubId.toString() !== club._id.toString());

  await Promise.all([club.save(), req.user.save()]);
  res.json({ message: 'You left the club' });
}
