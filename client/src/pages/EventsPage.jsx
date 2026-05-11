import SectionHeader from '../components/SectionHeader.jsx';
import { api } from '../api/client.js';
import { useFetch } from '../hooks/useFetch.js';

export default function EventsPage() {
  const { data, loading } = useFetch(() => api.get('/dashboard').then((res) => res.data), []);
  const events = data?.upcomingEvents || [];

  return (
    <section>
      <SectionHeader title="Upcoming Events" eyebrow="Joined Clubs" />

      {loading && (
        <div className="card p-6 text-body-md text-on-surface-variant">Loading events...</div>
      )}

      {!loading && events.length === 0 && (
        <div className="card p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-on-surface-variant text-[32px]">event_busy</span>
          </div>
          <p className="text-headline-sm font-semibold text-on-surface">No upcoming events</p>
          <p className="text-body-md text-on-surface-variant mt-2">Events from clubs you join will appear here.</p>
        </div>
      )}

      <div className="card overflow-hidden divide-y divide-outline-variant/40">
        {events.map((event) => (
          <article key={event._id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-5">
            <div className="flex-shrink-0 bg-primary-container text-on-primary-container w-14 h-14 rounded-xl flex flex-col items-center justify-center">
              <span className="text-label-md uppercase leading-none">
                {new Date(event.eventDate).toLocaleString('en', { month: 'short' })}
              </span>
              <span className="text-headline-sm font-bold leading-none">
                {new Date(event.eventDate).getDate()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-label-lg text-on-surface font-semibold">{event.title}</h2>
              <p className="text-body-sm text-on-surface-variant mt-1 line-clamp-2">{event.description}</p>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                {event.location && (
                  <span className="flex items-center gap-1 text-body-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    {event.location}
                  </span>
                )}
                <span className="flex items-center gap-1 text-body-sm text-primary font-semibold">
                  <span className="material-symbols-outlined text-[14px]">schedule</span>
                  {new Date(event.eventDate).toLocaleString([], {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
