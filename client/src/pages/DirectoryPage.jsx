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
    <main className={authenticated ? '' : 'page-shell'}>
      <SectionHeader
        eyebrow={authenticated ? 'Advanced discovery' : 'Public directory'}
        title={authenticated ? 'Find your next club' : 'Explore APU clubs'}
      />
      <form onSubmit={applySearch} className="card mb-6 grid gap-3 p-4 lg:grid-cols-[1fr_220px_220px_160px]">
        <input
          value={filters.q}
          onChange={(event) => setFilters({ ...filters, q: event.target.value })}
          placeholder="Search by club, tag, or keyword"
          className="focus-ring rounded-lg border border-slate-200 px-3 py-2"
        />
        <select value={filters.category} onChange={(event) => setFilters({ ...filters, category: event.target.value })} className="focus-ring rounded-lg border border-slate-200 px-3 py-2">
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>
        <select value={filters.language} onChange={(event) => setFilters({ ...filters, language: event.target.value })} className="focus-ring rounded-lg border border-slate-200 px-3 py-2">
          <option value="">Any language</option>
          {languages.map((language) => (
            <option key={language}>{language}</option>
          ))}
        </select>
        <button className="focus-ring bg-black px-4 py-2 font-bold text-white hover:bg-apu-crimson">Search</button>
        {authenticated ? (
          <input
            value={filters.tags}
            onChange={(event) => setFilters({ ...filters, tags: event.target.value })}
            placeholder="Tags: Music, Debate"
            className="focus-ring rounded-lg border border-slate-200 px-3 py-2 lg:col-span-4"
          />
        ) : null}
      </form>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {loading
          ? [0, 1, 2, 3, 4, 5].map((item) => <SkeletonCard key={item} />)
          : clubs.map((club) => (
              <ClubCard
                key={club._id}
                club={club}
                action={
                  user && club.isMember ? (
                    <span className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700">Joined</span>
                  ) : (
                    <button onClick={() => joinClub(club)} className="focus-ring bg-apu-crimson px-3 py-2 text-sm font-bold text-white hover:bg-crimson-dark">
                      Join
                    </button>
                  )
                }
              />
            ))}
      </div>
    </main>
  );
}
