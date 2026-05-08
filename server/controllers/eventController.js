import Event from '../models/Event.js';
import { HttpError } from '../utils/httpError.js';

export async function listEvents(req, res) {
  const events = await Event.find({ clubId: req.params.clubId })
    .populate('authorId', 'fullName')
    .sort({ eventDate: 1 });
  res.json({ events });
}

export async function createEvent(req, res) {
  const event = await Event.create({
    clubId: req.params.clubId,
    authorId: req.user._id,
    title: req.body.title,
    description: req.body.description,
    location: req.body.location,
    eventDate: req.body.eventDate
  });

  res.status(201).json({ event });
}

export async function updateEvent(req, res) {
  const event = await Event.findOne({ _id: req.params.id, clubId: req.params.clubId });
  if (!event) throw new HttpError(404, 'Event not found');

  for (const field of ['title', 'description', 'location', 'eventDate']) {
    if (req.body[field] !== undefined) event[field] = req.body[field];
  }

  await event.save();
  res.json({ event });
}

export async function deleteEvent(req, res) {
  const result = await Event.deleteOne({ _id: req.params.id, clubId: req.params.clubId });
  if (!result.deletedCount) throw new HttpError(404, 'Event not found');
  res.json({ message: 'Event deleted' });
}
