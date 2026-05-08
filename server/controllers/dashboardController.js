import Announcement from '../models/Announcement.js';
import Club from '../models/Club.js';
import Event from '../models/Event.js';
import { getActivityStatus } from '../utils/activity.js';

async function latestAnnouncementMap(clubIds) {
  const latest = await Announcement.aggregate([
    { $match: { clubId: { $in: clubIds } } },
    { $sort: { createdAt: -1 } },
    { $group: { _id: '$clubId', lastAnnouncementAt: { $first: '$createdAt' } } }
  ]);
  return new Map(latest.map((entry) => [entry._id.toString(), entry.lastAnnouncementAt]));
}

function scoreClub(club, interests) {
  const interestSet = new Set(interests.map((item) => item.toLowerCase()));
  const overlap = club.tags.filter((tag) => interestSet.has(tag.toLowerCase())).length;
  return { overlap, memberCount: club.members.length };
}

function serializeClub(club, latestMap) {
  const object = club.toObject();
  const lastAnnouncementAt = latestMap.get(club._id.toString()) || null;
  return {
    ...object,
    memberCount: club.members.length,
    activityStatus: getActivityStatus(lastAnnouncementAt)
  };
}

export async function getDashboard(req, res) {
  const interests = req.user.interests || [];

  const [recommendationCandidates, newActiveClubs, allTrending, joinedEvents] = await Promise.all([
    Club.find({
      isActive: true,
      isVerifiedByStaff: true,
      ...(interests.length ? { tags: { $in: interests } } : {})
    }).limit(30),
    Club.find({ isActive: true, isVerifiedByStaff: true }).sort({ createdAt: -1 }).limit(6),
    Club.find({ isActive: true, isVerifiedByStaff: true }).limit(50),
    Event.find({
      clubId: { $in: req.user.joinedClubs.map((entry) => entry.clubId) },
      eventDate: { $gte: new Date() }
    })
      .populate('clubId', 'name slug')
      .sort({ eventDate: 1 })
      .limit(8)
  ]);

  const recommendations = recommendationCandidates
    .map((club) => ({ club, score: scoreClub(club, interests) }))
    .sort((a, b) => b.score.overlap - a.score.overlap || b.score.memberCount - a.score.memberCount)
    .slice(0, 6)
    .map((entry) => entry.club);

  const trendingClubs = allTrending
    .sort((a, b) => b.members.length - a.members.length)
    .slice(0, 6);

  const clubIds = [...recommendations, ...newActiveClubs, ...trendingClubs].map((club) => club._id);
  const latestMap = await latestAnnouncementMap(clubIds);

  res.json({
    recommendations: recommendations.map((club) => serializeClub(club, latestMap)),
    newActiveClubs: newActiveClubs.map((club) => serializeClub(club, latestMap)),
    trendingClubs: trendingClubs.map((club) => serializeClub(club, latestMap)),
    upcomingEvents: joinedEvents
  });
}
