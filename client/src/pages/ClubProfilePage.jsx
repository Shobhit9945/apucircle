import { Calendar, Heart, Flame, ThumbsUp, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router-dom';
import LanguageBadge from '../components/LanguageBadge.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { api, errorMessage } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

const fallbackImage =
  '/assets/ritsumeikan-apu.jpg';

const reactionIcons = {
  thumbs_up: ThumbsUp,
  heart: Heart,
  fire: Flame
};

export default function ClubProfilePage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
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
      .then(([announcementData, eventData]) => {
        setAnnouncements(announcementData);
        setEvents(eventData);
      })
      .catch(() => {
        setAnnouncements([]);
        setEvents([]);
      });
  }

  useEffect(() => {
    loadClub();
  }, [slug]);

  useEffect(() => {
    if (club) loadPrivateSpace(club);
  }, [club?._id, club?.isMember, club?.isLeader]);

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

  if (loading) return <main className="page-shell text-slate-600">Loading club...</main>;
  if (!club) return <main className="page-shell text-slate-600">Club not found.</main>;

  return (
    <main className="bg-mist">
      <section className="relative min-h-[360px] overflow-hidden bg-black text-white">
        <img src={club.bannerImage || fallbackImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/20" />
        <div className="absolute inset-x-0 top-0 h-2 bg-apu-crimson" />
        <div className="relative mx-auto flex min-h-[360px] max-w-7xl flex-col justify-end px-4 py-10 sm:px-6 lg:px-8">
          <div className="max-w-3xl border-l-4 border-apu-crimson pl-6">
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="bg-white px-3 py-1 text-sm font-black uppercase tracking-wide text-black">{club.category}</span>
              <LanguageBadge language={club.languageOfOperation} />
              <StatusBadge status={club.activityStatus} />
            </div>
            <h1 className="font-heading text-4xl font-black sm:text-5xl">{club.name}</h1>
            <p className="mt-4 max-w-2xl text-white">{club.description}</p>
          </div>
        </div>
      </section>

      <section className="page-shell grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <article className="card p-5">
            <h2 className="font-heading text-xl font-semibold text-navy">Club profile</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <p className="text-sm text-slate-600"><span className="font-bold text-slate-800">Schedule:</span> {club.meetingSchedule}</p>
              <p className="text-sm text-slate-600"><span className="font-bold text-slate-800">Contact:</span> {club.contactEmail}</p>
              <p className="text-sm text-slate-600"><span className="font-bold text-slate-800">Members:</span> {club.memberCount}</p>
              <p className="text-sm text-slate-600"><span className="font-bold text-slate-800">Instagram:</span> {club.instagramHandle || 'Not listed'}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {(club.tags || []).map((tag) => (
                <span key={tag} className="border border-line bg-mist px-3 py-1 text-sm font-bold text-graphite">
                  {tag}
                </span>
              ))}
            </div>
          </article>

          {club.isMember || club.isLeader ? (
            <MemberSpace
              announcements={announcements}
              events={events}
              members={club.members || []}
              onReact={react}
            />
          ) : (
            <article className="card p-5">
              <h2 className="font-heading text-xl font-semibold text-navy">Member space</h2>
              <p className="mt-2 text-slate-600">Join this club to see announcements, events, and the member list.</p>
            </article>
          )}

          {club.isLeader ? (
            <LeaderTools
              club={club}
              announcementForm={announcementForm}
              setAnnouncementForm={setAnnouncementForm}
              eventForm={eventForm}
              setEventForm={setEventForm}
              postAnnouncement={postAnnouncement}
              postEvent={postEvent}
              approve={approve}
            />
          ) : null}
        </div>

        <aside className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center border border-line bg-mist text-apu-crimson">
                <Users />
              </div>
              <div>
                <p className="font-heading text-xl font-semibold text-navy">{club.memberCount} members</p>
                <p className="text-sm text-slate-600">{club.languageOfOperation} operation</p>
              </div>
            </div>
            {club.isMember || club.isLeader ? (
              <Link to="/my-clubs" className="mt-5 inline-flex w-full justify-center rounded-lg bg-navy px-4 py-3 font-bold text-white">
                Open my clubs
              </Link>
            ) : (
              <button onClick={joinClub} className="mt-5 w-full bg-apu-crimson px-4 py-3 font-bold text-white hover:bg-crimson-dark">
                Request to join
              </button>
            )}
          </div>
          <div className="card p-5">
            <h2 className="font-heading text-lg font-semibold text-navy">Leaders</h2>
            <div className="mt-3 grid gap-3">
              {(club.leaders || []).length === 0 ? <p className="text-sm text-slate-600">No leaders listed.</p> : null}
              {(club.leaders || []).map((leader) => (
                <div key={leader.userId?._id || leader.userId} className="rounded-lg bg-mist p-3">
                  <p className="font-semibold text-navy">{leader.userId?.fullName || 'Club leader'}</p>
                  <p className="text-sm text-slate-600">{leader.role}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

function MemberSpace({ announcements, events, members, onReact }) {
  return (
    <section className="grid gap-6">
      <article className="card p-5">
        <h2 className="font-heading text-xl font-semibold text-navy">Announcements</h2>
        <div className="mt-4 grid gap-3">
          {announcements.length === 0 ? <p className="text-sm text-slate-600">No announcements yet.</p> : null}
          {announcements.map((announcement) => (
            <div key={announcement._id} className="rounded-lg border border-slate-100 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-heading font-semibold text-navy">{announcement.title}</h3>
                {announcement.isPinned ? <span className="bg-apu-crimson px-2 py-1 text-xs font-bold text-white">Pinned</span> : null}
              </div>
              <p className="mt-2 text-sm text-slate-600">{announcement.body}</p>
              <div className="mt-3 flex gap-2">
                {Object.entries(reactionIcons).map(([key, Icon]) => {
                  const active = announcement.myReactions?.includes(key);
                  const count = announcement.reactionSummary?.[key]?.count || 0;
                  return (
                    <button
                      key={key}
                      onClick={() => onReact(announcement._id, key)}
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold ring-1 ${
                        active ? 'bg-apuBlue text-white ring-apuBlue' : 'bg-white text-slate-600 ring-slate-200'
                      }`}
                    >
                      <Icon size={15} />
                      {count}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </article>
      <article className="card p-5">
        <h2 className="font-heading text-xl font-semibold text-navy">Events</h2>
        <div className="mt-4 grid gap-3">
          {events.length === 0 ? <p className="text-sm text-slate-600">No events yet.</p> : null}
          {events.map((event) => (
            <div key={event._id} className="rounded-lg bg-mist p-4">
              <p className="font-heading font-semibold text-navy">{event.title}</p>
              <p className="mt-1 text-sm text-slate-600">{event.description}</p>
              <p className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-apu-crimson">
                <Calendar size={16} /> {new Date(event.eventDate).toLocaleString()} · {event.location}
              </p>
            </div>
          ))}
        </div>
      </article>
      <article className="card p-5">
        <h2 className="font-heading text-xl font-semibold text-navy">Members</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {members.map((member) => (
            <div key={member.userId?._id || member.userId} className="rounded-lg bg-mist p-3 text-sm font-semibold text-navy">
              {member.userId?.fullName || 'Member'}
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}

function LeaderTools({ club, announcementForm, setAnnouncementForm, eventForm, setEventForm, postAnnouncement, postEvent, approve }) {
  return (
    <section className="grid gap-6">
      <article className="card p-5">
        <h2 className="font-heading text-xl font-semibold text-navy">Leader tools</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <form onSubmit={postAnnouncement} className="grid gap-3 border-l-4 border-apu-crimson bg-mist p-4">
            <h3 className="font-heading font-semibold text-navy">Post announcement</h3>
            <input required maxLength={100} value={announcementForm.title} onChange={(event) => setAnnouncementForm({ ...announcementForm, title: event.target.value })} placeholder="Title" className="focus-ring rounded-lg border border-slate-200 px-3 py-2" />
            <textarea required maxLength={2000} value={announcementForm.body} onChange={(event) => setAnnouncementForm({ ...announcementForm, body: event.target.value })} placeholder="Body" rows={5} className="focus-ring rounded-lg border border-slate-200 px-3 py-2" />
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <input type="checkbox" checked={announcementForm.isPinned} onChange={(event) => setAnnouncementForm({ ...announcementForm, isPinned: event.target.checked })} />
              Pin announcement
            </label>
            <button className="bg-black px-4 py-2 font-bold text-white hover:bg-apu-crimson">Post</button>
          </form>
          <form onSubmit={postEvent} className="grid gap-3 border-l-4 border-apu-crimson bg-mist p-4">
            <h3 className="font-heading font-semibold text-navy">Create event</h3>
            <input required value={eventForm.title} onChange={(event) => setEventForm({ ...eventForm, title: event.target.value })} placeholder="Title" className="focus-ring rounded-lg border border-slate-200 px-3 py-2" />
            <input required value={eventForm.location} onChange={(event) => setEventForm({ ...eventForm, location: event.target.value })} placeholder="Location" className="focus-ring rounded-lg border border-slate-200 px-3 py-2" />
            <input required type="datetime-local" value={eventForm.eventDate} onChange={(event) => setEventForm({ ...eventForm, eventDate: event.target.value })} className="focus-ring rounded-lg border border-slate-200 px-3 py-2" />
            <textarea required value={eventForm.description} onChange={(event) => setEventForm({ ...eventForm, description: event.target.value })} placeholder="Description" rows={4} className="focus-ring rounded-lg border border-slate-200 px-3 py-2" />
            <button className="bg-black px-4 py-2 font-bold text-white hover:bg-apu-crimson">Create</button>
          </form>
        </div>
      </article>
      <article className="card p-5">
        <h2 className="font-heading text-xl font-semibold text-navy">Join requests</h2>
        <div className="mt-4 grid gap-3">
          {(club.joinRequests || []).length === 0 ? <p className="text-sm text-slate-600">No pending join requests.</p> : null}
          {(club.joinRequests || []).map((request) => (
            <div key={request.userId?._id || request.userId} className="flex items-center justify-between rounded-lg bg-mist p-3">
              <span className="font-semibold text-navy">{request.userId?.fullName || request.userId}</span>
              <button onClick={() => approve(request.userId?._id || request.userId)} className="bg-apu-crimson px-3 py-2 text-sm font-bold text-white hover:bg-crimson-dark">
                Approve
              </button>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
