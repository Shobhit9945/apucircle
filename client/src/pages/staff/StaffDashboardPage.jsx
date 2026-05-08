import { Building2, ClipboardList, Megaphone, Users } from 'lucide-react';
import SectionHeader from '../../components/SectionHeader.jsx';
import { api } from '../../api/client.js';
import { useFetch } from '../../hooks/useFetch.js';

export default function StaffDashboardPage() {
  const { data, loading } = useFetch(() => api.get('/staff/analytics').then((res) => res.data), []);

  const cards = [
    { label: 'Total users', value: data?.totalUsers, icon: Users },
    { label: 'Active clubs', value: data?.activeClubs, icon: Building2 },
    { label: 'Pending applications', value: data?.pendingApplications, icon: ClipboardList },
    { label: 'Recent announcements', value: data?.recentAnnouncements, icon: Megaphone }
  ];

  return (
    <section className="space-y-6">
      <SectionHeader title="Analytics overview" eyebrow="Platform health" />
      <div className="grid gap-4 md:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.label} className="card p-5">
              <Icon className="text-apu-crimson" />
              <p className="mt-4 text-sm font-semibold text-slate-500">{card.label}</p>
              <p className="font-heading text-3xl font-semibold text-navy">{loading ? '...' : card.value ?? 0}</p>
            </article>
          );
        })}
      </div>
      <div className="card overflow-hidden">
        <div className="border-b border-slate-100 p-5">
          <h2 className="font-heading text-xl font-semibold text-navy">Join rates by club</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {(data?.joinRates || []).map((club) => (
            <div key={club.clubId} className="grid gap-2 p-4 md:grid-cols-[1fr_120px_120px]">
              <span className="font-semibold text-navy">{club.name}</span>
              <span className="text-sm text-slate-600">{club.category}</span>
              <span className="text-sm font-bold text-apu-crimson">{club.members} members</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
