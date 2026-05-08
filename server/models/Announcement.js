import mongoose from 'mongoose';

const reactionsSchema = new mongoose.Schema(
  {
    thumbs_up: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    heart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    fire: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  { _id: false }
);

const announcementSchema = new mongoose.Schema(
  {
    clubId: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true, index: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true, maxlength: 100 },
    body: { type: String, required: true, trim: true, maxlength: 2000 },
    isPinned: { type: Boolean, default: false },
    reactions: {
      type: reactionsSchema,
      default: () => ({ thumbs_up: [], heart: [], fire: [] })
    }
  },
  { timestamps: true }
);

announcementSchema.index({ clubId: 1, createdAt: -1 });
announcementSchema.index({ clubId: 1, isPinned: -1, createdAt: -1 });

export default mongoose.model('Announcement', announcementSchema);
