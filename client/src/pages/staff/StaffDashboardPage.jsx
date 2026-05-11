import SectionHeader from '../../components/SectionHeader.jsx';
import { api } from '../../api/client.js';
import { useFetch } from '../../hooks/useFetch.js';

const statIcons = {
  'Total users': 'group',
  'Active clubs': 'groups',
  'Pending applications': 'assignment',
  'Recent announcements': 'campaign'
};

export default function StaffDashboardPage() {
  const { data, loading } = useFetch(() => api.get('/staff/analytics').then((res) => res.data), []);

  const cards = [
    { label: 'Total users', value: data?.totalUsers },
    { label: 'Active clubs', value: data?.activeClubs },
    { label: 'Pending applications', value: data?.pendingApplications },
    { label: 'Recent announcements', value: data?.recentAnnouncements }
  ];

  return (
    <section className="space-y-6">
      <SectionHeader title="Analytics Overview" eyebrow="Platform Health" />

      {/* Stats Bento */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, i) => (
          <article key={card.label} className={`card p-5 flex flex-col gap-3 relative overflow-hidden ${i === 2 && (data?.pendingApplications || 0) > 0 ? 'border-error/40 bg-error-container/20' : ''}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              i === 2 && (data?.pendingApplications || 0) > 0
                ? 'bg-error-container text-on-error-container'
                : 'bg-primary-container text-on-primary-container'
            }`}>
              <span className="material-symbols-outlined text-[20px]">{statIcons[card.label]}</span>
            </div>
            <div>
              <p className="text-label-md text-on-surface-variant uppercase tracking-wider">{card.label}</p>
              <p className="text-display font-bold text-on-surface mt-1" style={{ fontSize: '36px' }}>
                {loading ? '...' : (card.value ?? 0)}
              </p>
            </div>
          </article>
        ))}
      </div>

      {/* Join Rates */}
      <div className="card overflow-hidden">
        <div className="border-b border-outline-variant/50 p-5 flex items-center justify-between">
          <h2 className="text-headline-sm font-bold text-on-surface">Club Member Statistics</h2>
        </div>
        <div className="divide-y divide-outline-variant/40">
          {loading && (
            <div className="p-5 text-body-md text-on-surface-variant">Loading...</div>
          )}
          {!loading && (data?.joinRates || []).length === 0 && (
            <div className="p-5 text-body-md text-on-surface-variant">No data available.</div>
          )}
          {(data?.joinRates || []).map((club) => (
            <div key={club.clubId} className="flex items-center justify-between gap-4 p-4 hover:bg-surface-container-low transition-colors">
              <div className="min-w-0 flex-1">
                <p className="text-label-lg text-on-surface font-semibold truncate">{club.name}</p>
                <p className="text-body-sm text-on-surface-variant">{club.category}</p>
              </div>
              <span className="flex items-center gap-1.5 text-label-lg text-primary font-semibold flex-shrink-0">
                <span className="material-symbols-outlined text-[16px]">group</span>
                {club.members} members
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
