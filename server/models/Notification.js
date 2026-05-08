import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
      type: String,
      enum: ['join_approved', 'join_requested', 'announcement_posted', 'leader_application', 'platform'],
      required: true,
      index: true
    },
    title: { type: String, required: true, trim: true, maxlength: 140 },
    body: { type: String, trim: true, maxlength: 500 },
    link: { type: String, trim: true },
    clubId: { type: mongoose.Schema.Types.ObjectId, ref: 'Club' },
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'ClubLeaderApplication' },
    readAt: Date
  },
  { timestamps: true }
);

notificationSchema.index({ recipientId: 1, readAt: 1, createdAt: -1 });

export default mongoose.model('Notification', notificationSchema);
