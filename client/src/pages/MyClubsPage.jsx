import { Link } from 'react-router-dom';
import ClubCard from '../components/ClubCard.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import { SkeletonCard } from '../components/Skeleton.jsx';
import { api } from '../api/client.js';
import { useFetch } from '../hooks/useFetch.js';

export default function MyClubsPage() {
  const { data, loading } = useFetch(() => api.get('/users/me/clubs').then((res) => res.data), []);

  return (
    <section>
      <SectionHeader title="My Clubs" eyebrow="Joined Spaces" />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {loading
          ? [0, 1, 2].map((i) => <SkeletonCard key={i} />)
          : (data?.clubs || []).map((club) => <ClubCard key={club._id} club={club} />)}
      </div>
      {!loading && (data?.clubs || []).length === 0 && (
        <div className="card p-8 text-center mt-4">
          <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-on-surface-variant text-[32px]">groups</span>
          </div>
          <p className="text-headline-sm font-semibold text-on-surface">No clubs yet</p>
          <p className="text-body-md text-on-surface-variant mt-2">
            Discover a club and send a join request.
          </p>
          <Link
            to="/discover"
            className="inline-flex mt-5 bg-primary text-on-primary px-6 py-3 rounded-full text-label-lg font-semibold hover:bg-primary-container transition-colors"
          >
            Discover clubs
          </Link>
        </div>
      )}
    </section>
  );
}
