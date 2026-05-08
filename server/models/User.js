import mongoose from 'mongoose';

const joinedClubSchema = new mongoose.Schema(
  {
    clubId: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true },
    joinedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ['student', 'club_leader', 'staff'],
      default: 'student',
      index: true
    },
    languageBasis: {
      type: String,
      enum: ['English', 'Japanese'],
      default: 'English'
    },
    semester: { type: Number, min: 1, max: 12, default: 1 },
    interests: [{ type: String, trim: true }],
    joinedClubs: [joinedClubSchema],
    isVerified: { type: Boolean, default: false, index: true },
    verificationToken: { type: String, index: true },
    verificationTokenExpires: Date,
    refreshTokenHash: { type: String, select: false },
    lastLoginAt: Date
  },
  { timestamps: true }
);

userSchema.index({ 'joinedClubs.clubId': 1 });
userSchema.index({ interests: 1 });

userSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    _id: this._id,
    fullName: this.fullName,
    email: this.email,
    role: this.role,
    languageBasis: this.languageBasis,
    semester: this.semester,
    interests: this.interests,
    joinedClubs: this.joinedClubs,
    isVerified: this.isVerified,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

export default mongoose.model('User', userSchema);
