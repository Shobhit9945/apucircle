import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError } from '../utils/httpError.js';
import { verifyAccessToken } from '../utils/tokens.js';
import User from '../models/User.js';
import Club from '../models/Club.js';

function tokenFromRequest(req) {
  const header = req.headers.authorization || '';
  if (header.startsWith('Bearer ')) return header.slice(7);
  return req.cookies?.accessToken;
}

export const requireAuth = asyncHandler(async (req, _res, next) => {
  const token = tokenFromRequest(req);
  if (!token) throw new HttpError(401, 'Authentication required');

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch (_error) {
    throw new HttpError(401, 'Invalid or expired access token');
  }

  const user = await User.findById(payload.userId);
  if (!user) throw new HttpError(401, 'Authenticated user no longer exists');
  if (!user.isVerified) throw new HttpError(403, 'Please verify your email before continuing');

  req.user = user;
  next();
});

export const optionalAuth = asyncHandler(async (req, _res, next) => {
  const token = tokenFromRequest(req);
  if (!token) return next();

  try {
    const payload = verifyAccessToken(token);
    req.user = await User.findById(payload.userId);
  } catch (_error) {
    req.user = null;
  }

  next();
});

export function requireRole(...roles) {
  return (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new HttpError(403, 'You do not have permission to access this resource'));
    }
    next();
  };
}

export function requireStudentLike(req, _res, next) {
  if (!req.user || req.user.role === 'staff') {
    return next(new HttpError(403, 'Only students and club leaders can perform this action'));
  }
  next();
}

export function isClubLeader(user, club) {
  if (!user || !club) return false;
  return club.leaders.some((leader) => leader.userId.toString() === user._id.toString());
}

export function isClubMember(user, club) {
  if (!user || !club) return false;
  const userId = user._id.toString();
  return (
    club.members.some((member) => member.userId.toString() === userId) ||
    club.leaders.some((leader) => leader.userId.toString() === userId)
  );
}

export function requireClubLeaderOrStaff(paramName = 'clubId') {
  return asyncHandler(async (req, _res, next) => {
    const club = await Club.findById(req.params[paramName]);
    if (!club) throw new HttpError(404, 'Club not found');

    if (req.user.role === 'staff' || isClubLeader(req.user, club)) {
      req.club = club;
      return next();
    }

    throw new HttpError(403, 'Club leader access is required for this club');
  });
}

export function requireClubLeader(paramName = 'clubId') {
  return asyncHandler(async (req, _res, next) => {
    const club = await Club.findById(req.params[paramName]);
    if (!club) throw new HttpError(404, 'Club not found');

    if (isClubLeader(req.user, club)) {
      req.club = club;
      return next();
    }

    throw new HttpError(403, 'You must be a leader of this club to perform this action');
  });
}

export function requireClubMemberOrLeader(paramName = 'clubId') {
  return asyncHandler(async (req, _res, next) => {
    const club = await Club.findById(req.params[paramName]);
    if (!club) throw new HttpError(404, 'Club not found');

    if (isClubMember(req.user, club)) {
      req.club = club;
      return next();
    }

    throw new HttpError(403, 'You must be a member of this club to access this resource');
  });
}
