import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ClubCard from '../components/ClubCard.jsx';
import { SkeletonCard } from '../components/Skeleton.jsx';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useFetch } from '../hooks/useFetch.js';

const categories = ['All', 'Academic', 'Cultural', 'Sports', 'Service', 'Arts & Media', 'Technology'];

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, loading } = useFetch(() => api.get('/dashboard').then((res) => res.data), []);
  const [activeCategory, setActiveCategory] = useState('All');
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  function submitSearch(event) {
    event.preventDefault();
    navigate(`/discover${query ? `?q=${encodeURIComponent(query)}` : ''}`);
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-headline-lg font-bold text-on-surface">Discover</h2>
          <p className="text-body-md text-on-surface-variant mt-1">Find your community and get involved.</p>
        </div>
        <form onSubmit={submitSearch} className="relative w-full md:w-96">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
            search
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface rounded-full py-3 pl-12 pr-4 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-sm text-body-md"
            placeholder="Search clubs, tags, or keywords..."
            type="text"
          />
        </form>
      </div>

      {/* Interests Banner */}
      {(!user?.interests || user.interests.length === 0) && (
        <div className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4 bg-primary-fixed border-primary-fixed-dim">
          <div className="flex-1">
            <p className="text-label-lg text-primary font-semibold">Personalize your experience</p>
            <p className="text-body-sm text-on-surface-variant mt-1">Select interests to get better club recommendations.</p>
          </div>
          <Link to="/profile" className="bg-primary text-on-primary px-5 py-2 rounded-full text-label-lg font-semibold hover:bg-primary-container transition-colors flex-shrink-0">
            Update profile
          </Link>
        </div>
      )}

      {/* Category Chips */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-1 -mx-4 px-4 md:mx-0 md:px-0">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-shrink-0 px-5 py-2 rounded-full text-label-md min-h-[40px] flex items-center transition-colors ${
              activeCategory === cat
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container-lowest border border-outline-variant text-on-surface hover:bg-surface-container-low'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Recommended for You */}
      <section>
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-headline-md font-bold text-on-surface">Recommended for You</h3>
          <Link to="/discover" className="text-label-md text-primary hover:underline font-semibold">
            View All
          </Link>
        </div>
        <div className="flex overflow-x-auto hide-scrollbar gap-5 pb-4 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory">
          {loading
            ? [0, 1, 2].map((i) => (
                <div key={i} className="snap-start flex-shrink-0 w-72">
                  <SkeletonCard />
                </div>
              ))
            : (data?.recommendations || []).map((club) => (
                <div key={club._id} className="snap-start flex-shrink-0 w-72">
                  <ClubCard club={club} />
                </div>
              ))}
          {!loading && (data?.recommendations || []).length === 0 && (
            <p className="text-body-md text-on-surface-variant py-8">
              No recommendations yet.{' '}
              <Link to="/discover" className="text-primary font-semibold hover:underline">
                Browse all clubs
              </Link>
            </p>
          )}
        </div>
      </section>

      {/* Active & New Clubs */}
      <section>
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-headline-md font-bold text-on-surface flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#1e8e3e] animate-pulse inline-block" />
            Active Right Now
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading
            ? [0, 1, 2].map((i) => <SkeletonCard key={i} />)
            : (data?.newActiveClubs || []).slice(0, 6).map((club) => (
                <ClubCard key={club._id} club={club} />
              ))}
          {!loading && (data?.newActiveClubs || []).length === 0 && (
            <p className="text-body-md text-on-surface-variant col-span-full py-6">No active clubs to show.</p>
          )}
        </div>
      </section>

      {/* Upcoming Events */}
      {(data?.upcomingEvents || []).length > 0 && (
        <section>
          <h3 className="text-headline-md font-bold text-on-surface mb-4">Upcoming Events</h3>
          <div className="card overflow-hidden divide-y divide-outline-variant/40">
            {(data.upcomingEvents || []).slice(0, 5).map((event) => (
              <Link
                key={event._id}
                to={`/clubs/${event.clubId?.slug}`}
                className="flex items-center gap-4 p-4 hover:bg-surface-container-low transition-colors group"
              >
                <div className="bg-primary-container text-on-primary-container w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-label-md uppercase leading-none">
                    {new Date(event.eventDate).toLocaleString('en', { month: 'short' })}
                  </span>
                  <span className="text-headline-sm font-bold leading-none">
                    {new Date(event.eventDate).getDate()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-label-lg text-on-surface font-semibold group-hover:text-primary transition-colors truncate">
                    {event.title}
                  </p>
                  <p className="text-body-sm text-on-surface-variant flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                    {new Date(event.eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {event.clubId?.name && ` · ${event.clubId.name}`}
                  </p>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors text-[20px]">
                  chevron_right
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Trending */}
      {(data?.trendingClubs || []).length > 0 && (
        <section className="pb-4">
          <h3 className="text-headline-md font-bold text-on-surface mb-4">Trending This Week</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(data.trendingClubs || []).map((club) => (
              <ClubCard key={club._id} club={club} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
