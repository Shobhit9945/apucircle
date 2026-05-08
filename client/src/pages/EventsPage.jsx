import SectionHeader from '../components/SectionHeader.jsx';
import { api } from '../api/client.js';
import { useFetch } from '../hooks/useFetch.js';

export default function EventsPage() {
  const { data, loading } = useFetch(() => api.get('/dashboard').then((res) => res.data), []);
  const events = data?.upcomingEvents || [];

  return (
    <section>
      <SectionHeader title="Upcoming events" eyebrow="Joined clubs" />
      <div className="card divide-y divide-slate-100">
        {loading ? <p className="p-5 text-slate-600">Loading events...</p> : null}
        {!loading && events.length === 0 ? <p className="p-5 text-slate-600">No upcoming events from joined clubs.</p> : null}
        {events.map((event) => (
          <article key={event._id} className="grid gap-2 p-5 md:grid-cols-[1fr_220px] md:items-center">
            <div>
              <h2 className="font-heading text-lg font-semibold text-navy">{event.title}</h2>
              <p className="text-sm text-slate-600">{event.description}</p>
              <p className="mt-2 text-sm font-semibold text-slate-700">{event.location}</p>
            </div>
            <time className="border-l-4 border-apu-crimson bg-mist px-4 py-3 text-sm font-bold text-apu-crimson">
              {new Date(event.eventDate).toLocaleString()}
            </time>
          </article>
        ))}
      </div>
    </section>
  );
}
