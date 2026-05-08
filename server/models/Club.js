import mongoose from 'mongoose';

export const CLUB_CATEGORIES = [
  'Sports',
  'Culture',
  'Music',
  'Arts',
  'Academic',
  'Community Service',
  'Language',
  'Technology',
  'Entrepreneurship',
  'Other'
];

const clubUserSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, trim: true, default: 'Member' },
    joinedAt: { type: Date, default: Date.now },
    requestedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const clubSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true, minlength: 3, maxlength: 60 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    description: { type: String, required: true, trim: true, maxlength: 3000 },
    category: { type: String, required: true, enum: CLUB_CATEGORIES, index: true },
    tags: [{ type: String, trim: true, index: true }],
    languageOfOperation: {
      type: String,
      enum: ['English', 'Japanese', 'Bilingual'],
      required: true,
      index: true
    },
    meetingSchedule: { type: String, trim: true, required: true },
    bannerImage: String,
    profileImage: String,
    leaders: [clubUserSchema],
    members: [clubUserSchema],
    joinRequests: [clubUserSchema],
    instagramHandle: { type: String, trim: true },
    contactEmail: { type: String, required: true, trim: true, lowercase: true },
    isActive: { type: Boolean, default: true, index: true },
    isVerifiedByStaff: { type: Boolean, default: false, index: true }
  },
  { timestamps: true }
);

clubSchema.index({ name: 'text', description: 'text', tags: 'text', category: 'text' });
clubSchema.index({ 'leaders.userId': 1 });
clubSchema.index({ 'members.userId': 1 });
clubSchema.index({ 'joinRequests.userId': 1 });

export default mongoose.model('Club', clubSchema);
