import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge.jsx';
import { api, errorMessage } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

const fallbackImage = '/assets/ritsumeikan-apu.jpg';

const reactionEmoji = {
  thumbs_up: '👍',
  heart: '❤️',
  fire: '🔥'
};

function getInitials(name) {
  return (name || '')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function ClubProfilePage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('announcements');
  const [announcementForm, setAnnouncementForm] = useState({ title: '', body: '', isPinned: false });
  const [eventForm, setEventForm] = useState({ title: '', description: '', location: '', eventDate: '' });

  function loadClub() {
    setLoading(true);
    api
      .get(`/clubs/${slug}`)
      .then(({ data }) => setClub(data.club))
      .catch(() => setClub(null))
      .finally(() => setLoading(false));
  }

  function loadPrivateSpace(nextClub = club) {
    if (!nextClub?.isMember && !nextClub?.isLeader) return;
    Promise.all([
      api.get(`/clubs/${nextClub._id}/announcements`).then(({ data }) => data.announcements || []),
      api.get(`/clubs/${nextClub._id}/events`).then(({ data }) => data.events || [])
    ])
      .then(([a, e]) => { setAnnouncements(a); setEvents(e); })
      .catch(() => { setAnnouncements([]); setEvents([]); });
  }

  useEffect(() => { loadClub(); }, [slug]);
  useEffect(() => { if (club) loadPrivateSpace(club); }, [club?._id, club?.isMember, club?.isLeader]);

  async function joinClub() {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/clubs/${slug}` } } });
      return;
    }
    try {
      const { data } = await api.post(`/clubs/${club._id}/join`);
      toast.success(data.warning || 'Join request submitted');
      loadClub();
    } catch (error) {
      toast.error(errorMessage(error, 'Could not request to join'));
    }
  }

  async function approve(userId) {
    try {
      await api.post(`/clubs/${club._id}/approve/${userId}`);
      toast.success('Join request approved');
      loadClub();
    } catch (error) {
      toast.error(errorMessage(error, 'Could not approve request'));
    }
  }

  async function postAnnouncement(event) {
    event.preventDefault();
    try {
      await api.post(`/clubs/${club._id}/announcements`, announcementForm);
      toast.success('Announcement posted');
      setAnnouncementForm({ title: '', body: '', isPinned: false });
      loadPrivateSpace();
      loadClub();
    } catch (error) {
      toast.error(errorMessage(error, 'Could not post announcement'));
    }
  }

  async function postEvent(event) {
    event.preventDefault();
    try {
      await api.post(`/clubs/${club._id}/events`, eventForm);
      toast.success('Event created');
      setEventForm({ title: '', description: '', location: '', eventDate: '' });
      loadPrivateSpace();
    } catch (error) {
      toast.error(errorMessage(error, 'Could not create event'));
    }
  }

  async function react(announcementId, reaction) {
    try {
      const { data } = await api.post(`/clubs/${club._id}/announcements/${announcementId}/reactions`, { reaction });
      setAnnouncements((items) => items.map((item) => (item._id === announcementId ? data.announcement : item)));
    } catch (error) {
      toast.error(errorMessage(error, 'Could not react'));
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="card h-48 animate-pulse bg-surface-container-high" />
        <div className="grid md:grid-cols-12 gap-6">
          <div className="md:col-span-8 card h-64 animate-pulse bg-surface-container-high" />
          <div className="md:col-span-4 card h-64 animate-pulse bg-surface-container-high" />
        </div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="card p-8 text-center">
        <p className="text-body-md text-on-surface-variant">Club not found.</p>
        <Link to="/discover" className="mt-4 inline-flex bg-primary text-on-primary px-5 py-2 rounded-full text-label-lg">
          Back to discovery
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'about', label: 'About' },
    ...(club.isMember || club.isLeader ? [{ id: 'announcements', label: 'Announcements' }, { id: 'events', label: 'Events' }, { id: 'members', label: `Members ${club.memberCount ? `(${club.memberCount})` : ''}` }] : []),
    ...(club.isLeader ? [{ id: 'manage', label: 'Manage' }] : [])
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Back Button */}
      <Link
        to="/discover"
        className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-label-lg w-fit"
      >
        <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        Back to Discovery
      </Link>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Hero Card */}
        <div className="md:col-span-8 card overflow-hidden flex flex-col">
          {/* Cover Image */}
          <div className="h-48 md:h-64 w-full bg-surface-container-high relative">
            <img
              src={club.bannerImage || fallbackImage}
              alt="Club cover"
              className="w-full h-full object-cover"
            />
            {club.activityStatus && (
              <div className="absolute top-4 right-4">
                <StatusBadge status={club.activityStatus} />
              </div>
            )}
          </div>
          {/* Club Info */}
          <div className="p-6 pt-10 relative flex-1">
            {/* Avatar */}
            <div className="absolute -top-8 left-6 w-16 h-16 rounded-full border-4 border-surface-container-lowest bg-primary text-on-primary flex items-center justify-center text-headline-sm font-bold shadow-sm">
              {getInitials(club.name)}
            </div>
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <h1 className="text-headline-lg font-bold text-on-surface">{club.name}</h1>
                <p className="text-body-md text-on-surface-variant mt-2 max-w-xl">{club.description}</p>
              </div>
              {club.isMember || club.isLeader ? (
                <Link
                  to="/my-clubs"
                  className="flex-shrink-0 border border-primary text-primary px-5 py-2.5 rounded-full text-label-lg font-semibold hover:bg-primary-fixed transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                  Member
                </Link>
              ) : (
                <button
                  onClick={joinClub}
                  className="flex-shrink-0 bg-primary text-on-primary px-6 py-2.5 rounded-full text-label-lg font-semibold hover:bg-primary-container transition-colors shadow-sm flex items-center gap-2"
                >
                  Request to Join
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </button>
              )}
            </div>

            {/* Category Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {club.category && (
                <span className="bg-surface-container text-on-surface px-3 py-1 rounded-full text-label-md">
                  {club.category}
                </span>
              )}
              {(club.tags || []).map((tag) => (
                <span key={tag} className="bg-surface-container text-on-surface px-3 py-1 rounded-full text-label-md">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Tab Navigation (for members) */}
          {(club.isMember || club.isLeader) && (
            <div className="border-t border-outline-variant/50 px-6 flex gap-6 overflow-x-auto hide-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 border-b-2 text-label-lg whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary font-semibold'
                      : 'border-transparent text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="md:col-span-4 flex flex-col gap-5">
          {/* Quick Stats */}
          <div className="card p-5 space-y-4">
            <h3 className="text-headline-sm font-bold text-on-surface">Club Overview</h3>
            {[
              { icon: 'group', label: 'Members', value: `${club.memberCount || 0} Active` },
              { icon: 'calendar_today', label: 'Schedule', value: club.meetingSchedule || 'TBD' },
              { icon: 'language', label: 'Language', value: club.languageOfOperation || 'English' }
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 py-2 border-b border-surface-variant last:border-0">
                <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-on-secondary-container text-[20px]">{item.icon}</span>
                </div>
                <div>
                  <p className="text-label-md text-on-surface-variant">{item.label}</p>
                  <p className="text-body-md text-on-surface font-semibold">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="card p-5 space-y-3">
            <h3 className="text-label-lg text-on-surface-variant font-semibold">Contact</h3>
            <div className="flex gap-2">
              {club.contactEmail && (
                <a href={`mailto:${club.contactEmail}`} className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors">
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                </a>
              )}
              {club.instagramHandle && (
                <a href={`https://instagram.com/${club.instagramHandle}`} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors">
                  <span className="material-symbols-outlined text-[20px]">link</span>
                </a>
              )}
            </div>
          </div>

          {/* Leaders */}
          {(club.leaders || []).length > 0 && (
            <div className="card p-5 space-y-3">
              <h3 className="text-label-lg text-on-surface-variant font-semibold">Leaders</h3>
              {club.leaders.map((leader) => (
                <div key={leader.userId?._id || leader.userId} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {getInitials(leader.userId?.fullName || 'L')}
                  </div>
                  <div>
                    <p className="text-label-lg text-on-surface font-semibold">{leader.userId?.fullName || 'Club leader'}</p>
                    <p className="text-label-md text-on-surface-variant">{leader.role}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tab Content (full width) */}
        {activeTab === 'about' && (
          <div className="md:col-span-12 card p-6">
            <h3 className="text-headline-sm font-bold text-on-surface mb-4">About Us</h3>
            <p className="text-body-md text-on-surface-variant">{club.description || 'No description provided.'}</p>
            {club.meetingSchedule && (
              <div className="mt-6 flex items-start gap-3 bg-surface-container rounded-xl p-4">
                <span className="material-symbols-outlined text-primary text-[20px]">schedule</span>
                <div>
                  <p className="text-label-lg text-on-surface font-semibold">Meeting Schedule</p>
                  <p className="text-body-sm text-on-surface-variant mt-0.5">{club.meetingSchedule}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {(club.isMember || club.isLeader) && activeTab === 'announcements' && (
          <div className="md:col-span-12 space-y-4">
            {announcements.length === 0 && (
              <div className="card p-6 text-center text-body-md text-on-surface-variant">No announcements yet.</div>
            )}
            {announcements.map((a) => (
              <div key={a._id} className="card p-5 relative overflow-hidden">
                {a.isPinned && (
                  <div className="absolute top-0 right-0 bg-secondary-container text-on-secondary-container px-3 py-1 rounded-bl-lg text-label-md flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">push_pin</span> Pinned
                  </div>
                )}
                <h3 className="text-label-lg text-on-surface font-semibold pr-20">{a.title}</h3>
                <p className="text-body-md text-on-surface-variant mt-2">{a.body}</p>
                <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-outline-variant/40">
                  {Object.entries(reactionEmoji).map(([key, emoji]) => {
                    const active = a.myReactions?.includes(key);
                    const count = a.reactionSummary?.[key]?.count || 0;
                    return (
                      <button
                        key={key}
                        onClick={() => react(a._id, key)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-label-md border transition-colors ${
                          active
                            ? 'bg-primary-fixed border-primary-fixed-dim text-primary'
                            : 'bg-surface border-outline-variant text-on-surface-variant hover:bg-surface-container-high'
                        }`}
                      >
                        <span>{emoji}</span>
                        {count > 0 && <span>{count}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {(club.isMember || club.isLeader) && activeTab === 'events' && (
          <div className="md:col-span-12 space-y-4">
            {events.length === 0 && (
              <div className="card p-6 text-center text-body-md text-on-surface-variant">No events yet.</div>
            )}
            {events.map((e) => (
              <div key={e._id} className="card p-5 flex gap-4">
                <div className="bg-primary-container text-on-primary-container w-14 h-14 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-label-md uppercase leading-none">
                    {new Date(e.eventDate).toLocaleString('en', { month: 'short' })}
                  </span>
                  <span className="text-headline-sm font-bold leading-none">{new Date(e.eventDate).getDate()}</span>
                </div>
                <div>
                  <p className="text-label-lg text-on-surface font-semibold">{e.title}</p>
                  <p className="text-body-sm text-on-surface-variant mt-1">{e.description}</p>
                  <div className="flex flex-wrap gap-3 mt-2">
                    {e.location && (
                      <span className="flex items-center gap-1 text-body-sm text-on-surface-variant">
                        <span className="material-symbols-outlined text-[14px]">location_on</span>
                        {e.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-body-sm text-primary font-semibold">
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      {new Date(e.eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {(club.isMember || club.isLeader) && activeTab === 'members' && (
          <div className="md:col-span-12 card p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(club.members || []).map((m) => (
                <div key={m.userId?._id || m.userId} className="flex items-center gap-3 bg-surface-container rounded-xl p-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-xs font-bold text-on-surface-variant flex-shrink-0">
                    {getInitials(m.userId?.fullName || 'M')}
                  </div>
                  <p className="text-label-lg text-on-surface font-semibold truncate">{m.userId?.fullName || 'Member'}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {club.isLeader && activeTab === 'manage' && (
          <div className="md:col-span-12 space-y-6">
            {/* Join Requests */}
            {(club.joinRequests || []).length > 0 && (
              <div className="card p-5">
                <h3 className="text-headline-sm font-bold text-on-surface mb-4 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-error text-on-error text-[11px] font-bold flex items-center justify-center">
                    {club.joinRequests.length}
                  </span>
                  Pending Join Requests
                </h3>
                <div className="space-y-3">
                  {club.joinRequests.map((req) => (
                    <div key={req.userId?._id || req.userId} className="flex items-center justify-between p-3 bg-surface-container rounded-xl">
                      <span className="text-label-lg text-on-surface font-semibold">{req.userId?.fullName || req.userId}</span>
                      <button
                        onClick={() => approve(req.userId?._id || req.userId)}
                        className="bg-primary text-on-primary px-4 py-1.5 rounded-full text-label-md font-semibold hover:bg-primary-container transition-colors"
                      >
                        Approve
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Post Announcement */}
            <div className="grid md:grid-cols-2 gap-6">
              <form onSubmit={postAnnouncement} className="card p-5 space-y-3">
                <h3 className="text-headline-sm font-bold text-on-surface">Post Announcement</h3>
                <input
                  required
                  maxLength={100}
                  value={announcementForm.title}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                  placeholder="Title"
                  className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-body-md transition-all"
                />
                <textarea
                  required
                  maxLength={2000}
                  value={announcementForm.body}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, body: e.target.value })}
                  placeholder="Announcement body..."
                  rows={4}
                  className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-body-md transition-all resize-none"
                />
                <label className="flex items-center gap-2 text-label-lg text-on-surface cursor-pointer">
                  <input
                    type="checkbox"
                    checked={announcementForm.isPinned}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, isPinned: e.target.checked })}
                    className="rounded"
                  />
                  Pin announcement
                </label>
                <button className="w-full bg-primary text-on-primary rounded-full py-3 text-label-lg font-semibold hover:bg-primary-container transition-colors flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  Post
                </button>
              </form>

              <form onSubmit={postEvent} className="card p-5 space-y-3">
                <h3 className="text-headline-sm font-bold text-on-surface">Create Event</h3>
                <input
                  required
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  placeholder="Event title"
                  className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-body-md transition-all"
                />
                <input
                  required
                  value={eventForm.location}
                  onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                  placeholder="Location"
                  className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-body-md transition-all"
                />
                <input
                  required
                  type="datetime-local"
                  value={eventForm.eventDate}
                  onChange={(e) => setEventForm({ ...eventForm, eventDate: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-body-md transition-all"
                />
                <textarea
                  required
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  placeholder="Description"
                  rows={3}
                  className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-body-md transition-all resize-none"
                />
                <button className="w-full bg-primary text-on-primary rounded-full py-3 text-label-lg font-semibold hover:bg-primary-container transition-colors flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  Create Event
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Locked member space (for non-members) */}
        {!club.isMember && !club.isLeader && (
          <div className="md:col-span-12 card p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-on-surface-variant text-[28px]">lock</span>
            </div>
            <p className="text-headline-sm font-bold text-on-surface">Member Space</p>
            <p className="text-body-md text-on-surface-variant mt-2 max-w-sm mx-auto">
              Join this club to see announcements, events, and the member list.
            </p>
            <button
              onClick={joinClub}
              className="mt-5 bg-primary text-on-primary px-6 py-3 rounded-full text-label-lg font-semibold hover:bg-primary-container transition-colors"
            >
              Request to Join
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
