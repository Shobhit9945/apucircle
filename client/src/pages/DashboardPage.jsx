import { Link } from 'react-router-dom';
import ClubCard from '../components/ClubCard.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import { SkeletonCard } from '../components/Skeleton.jsx';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useFetch } from '../hooks/useFetch.js';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, loading } = useFetch(() => api.get('/dashboard').then((res) => res.data), []);

  return (
    <div className="space-y-8">
      {(!user?.interests || user.interests.length === 0) ? (
        <section className="border-l-4 border-apu-crimson bg-black p-5 text-white">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/60">Personalize APUCircle</p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="font-heading text-2xl font-semibold">Select interests to improve recommendations.</h1>
            <Link to="/profile" className="bg-apu-crimson px-4 py-3 text-center font-bold text-white hover:bg-crimson-dark">
              Update profile
            </Link>
          </div>
        </section>
      ) : null}

      <section>
        <SectionHeader
          eyebrow="Matched to your interests"
          title="Recommended clubs"
          action={<Link to="/discover" className="font-bold text-apu-crimson">Browse all</Link>}
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {loading
            ? [0, 1, 2].map((item) => <SkeletonCard key={item} />)
            : (data?.recommendations || []).map((club) => <ClubCard key={club._id} club={club} />)}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <SectionHeader title="New & active clubs" />
          <div className="grid gap-4">
            {loading
              ? [0, 1, 2].map((item) => <SkeletonCard key={item} />)
              : (data?.newActiveClubs || []).slice(0, 3).map((club) => <ClubCard key={club._id} club={club} />)}
          </div>
        </div>
        <div>
          <SectionHeader title="Upcoming events" />
          <div className="card divide-y divide-slate-100">
            {(data?.upcomingEvents || []).length === 0 && !loading ? (
              <p className="p-5 text-sm text-slate-600">No upcoming joined-club events yet.</p>
            ) : null}
            {(data?.upcomingEvents || []).map((event) => (
              <Link key={event._id} to={`/clubs/${event.clubId?.slug}`} className="block p-5 hover:bg-mist">
                <p className="font-heading font-semibold text-navy">{event.title}</p>
                <p className="mt-1 text-sm text-slate-600">{event.clubId?.name} · {new Date(event.eventDate).toLocaleString()}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section>
        <SectionHeader title="Trending this week" />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {(data?.trendingClubs || []).map((club) => <ClubCard key={club._id} club={club} />)}
        </div>
      </section>
    </div>
  );
}
