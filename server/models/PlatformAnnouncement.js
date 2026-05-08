import mongoose from 'mongoose';

const platformAnnouncementSchema = new mongoose.Schema(
  {
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true, maxlength: 140 },
    body: { type: String, required: true, trim: true, maxlength: 2000 },
    isPublished: { type: Boolean, default: true, index: true }
  },
  { timestamps: true }
);

platformAnnouncementSchema.index({ createdAt: -1 });

export default mongoose.model('PlatformAnnouncement', platformAnnouncementSchema);
