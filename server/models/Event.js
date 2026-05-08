import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    clubId: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true, index: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    location: { type: String, required: true, trim: true, maxlength: 160 },
    eventDate: { type: Date, required: true, index: true }
  },
  { timestamps: true }
);

eventSchema.index({ clubId: 1, eventDate: 1 });

export default mongoose.model('Event', eventSchema);
