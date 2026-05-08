import ClubCard from '../components/ClubCard.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import { SkeletonCard } from '../components/Skeleton.jsx';
import { api } from '../api/client.js';
import { useFetch } from '../hooks/useFetch.js';

export default function MyClubsPage() {
  const { data, loading } = useFetch(() => api.get('/users/me/clubs').then((res) => res.data), []);

  return (
    <section>
      <SectionHeader title="My clubs" eyebrow="Joined spaces" />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {loading
          ? [0, 1, 2].map((item) => <SkeletonCard key={item} />)
          : (data?.clubs || []).map((club) => <ClubCard key={club._id} club={club} />)}
      </div>
      {!loading && (data?.clubs || []).length === 0 ? (
        <div className="card p-6 text-slate-600">No joined clubs yet. Discover a club and send a join request.</div>
      ) : null}
    </section>
  );
}
