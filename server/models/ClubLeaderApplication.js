import mongoose from 'mongoose';

const clubLeaderApplicationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    clubId: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true, index: true },
    reason: { type: String, required: true, trim: true, minlength: 50, maxlength: 500 },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true
    },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: Date
  },
  { timestamps: true }
);

clubLeaderApplicationSchema.index({ userId: 1, clubId: 1, status: 1 });

export default mongoose.model('ClubLeaderApplication', clubLeaderApplicationSchema);
