import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ClubCard from '../components/ClubCard.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import { SkeletonCard } from '../components/Skeleton.jsx';
import { api, errorMessage } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

const categories = ['Sports', 'Culture', 'Music', 'Arts', 'Academic', 'Community Service', 'Language', 'Technology', 'Entrepreneurship', 'Other'];
const languages = ['English', 'Japanese', 'Bilingual'];

export default function DirectoryPage({ authenticated = false }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    category: '',
    language: '',
    tags: ''
  });
  const [loading, setLoading] = useState(true);
  const [clubs, setClubs] = useState([]);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value) params.set(key, value);
    }
    return params.toString();
  }, [filters]);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/clubs${query ? `?${query}` : ''}`)
      .then(({ data }) => setClubs(data.clubs || []))
      .catch(() => setClubs([]))
      .finally(() => setLoading(false));
  }, [query]);

  function applySearch(event) {
    event.preventDefault();
    setSearchParams(filters.q ? { q: filters.q } : {});
  }

  async function joinClub(club) {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/clubs/${club.slug}` } } });
      return;
    }
    try {
      const { data } = await api.post(`/clubs/${club._id}/join`);
      toast.success(data.warning || 'Join request submitted');
    } catch (error) {
      toast.error(errorMessage(error, 'Could not request to join'));
    }
  }

  return (
    <div className={authenticated ? '' : 'page-shell'}>
      <SectionHeader
        eyebrow={authenticated ? 'Advanced discovery' : 'Public directory'}
        title={authenticated ? 'Find your next club' : 'Explore APU clubs'}
      />

      {/* Search & Filters */}
      <form onSubmit={applySearch} className="card mb-6 p-4 grid gap-3 lg:grid-cols-[1fr_200px_200px_auto]">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
          <input
            value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
            placeholder="Search by club, tag, or keyword"
            className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant text-on-surface rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-body-md"
          />
        </div>
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="px-3 py-2.5 bg-surface-container-lowest border border-outline-variant text-on-surface rounded-xl focus:outline-none focus:border-primary transition-all text-body-md"
        >
          <option value="">All categories</option>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select
          value={filters.language}
          onChange={(e) => setFilters({ ...filters, language: e.target.value })}
          className="px-3 py-2.5 bg-surface-container-lowest border border-outline-variant text-on-surface rounded-xl focus:outline-none focus:border-primary transition-all text-body-md"
        >
          <option value="">Any language</option>
          {languages.map((l) => <option key={l}>{l}</option>)}
        </select>
        <button className="bg-primary text-on-primary rounded-full px-5 py-2.5 text-label-lg font-semibold hover:bg-primary-container transition-colors">
          Search
        </button>
        {authenticated && (
          <input
            value={filters.tags}
            onChange={(e) => setFilters({ ...filters, tags: e.target.value })}
            placeholder="Tags: Music, Debate"
            className="lg:col-span-4 px-4 py-2.5 bg-surface-container-lowest border border-outline-variant text-on-surface rounded-xl focus:outline-none focus:border-primary transition-all text-body-md"
          />
        )}
      </form>

      {/* Club Grid */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {loading
          ? [0, 1, 2, 3, 4, 5].map((i) => <SkeletonCard key={i} />)
          : clubs.map((club) => (
              <ClubCard
                key={club._id}
                club={club}
                action={
                  user && club.isMember ? (
                    <span className="bg-tertiary-fixed text-tertiary px-3 py-1.5 rounded-full text-label-md font-semibold">
                      Joined
                    </span>
                  ) : (
                    <button
                      onClick={() => joinClub(club)}
                      className="bg-primary text-on-primary px-4 py-1.5 rounded-full text-label-md font-semibold hover:bg-primary-container transition-colors"
                    >
                      Join
                    </button>
                  )
                }
              />
            ))}
      </div>

      {!loading && clubs.length === 0 && (
        <div className="card p-8 text-center">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant mb-3">search_off</span>
          <p className="text-body-md text-on-surface-variant">No clubs found. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
}
