import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import SectionHeader from '../../components/SectionHeader.jsx';
import { api, errorMessage } from '../../api/client.js';
import { useFetch } from '../../hooks/useFetch.js';

export default function StaffClubsPage() {
  const { data, loading, setData } = useFetch(() => api.get('/staff/clubs').then((res) => res.data), []);

  async function refresh() {
    const { data: next } = await api.get('/staff/clubs');
    setData(next);
  }

  async function verify(club) {
    try {
      await api.put(`/staff/clubs/${club._id}/verify`, { isVerifiedByStaff: !club.isVerifiedByStaff });
      toast.success('Club verification updated');
      refresh();
    } catch (error) {
      toast.error(errorMessage(error, 'Could not update club'));
    }
  }

  async function suspend(club) {
    try {
      await api.put(`/staff/clubs/${club._id}/suspend`);
      toast.success('Club suspended');
      refresh();
    } catch (error) {
      toast.error(errorMessage(error, 'Could not suspend club'));
    }
  }

  return (
    <section>
      <SectionHeader
        title="Clubs"
        eyebrow="Administration"
        action={<Link to="/staff/clubs/new" className="bg-apu-crimson px-4 py-2 font-bold text-white hover:bg-crimson-dark">Create club</Link>}
      />
      <div className="card overflow-hidden">
        {loading ? <p className="p-5 text-slate-600">Loading clubs...</p> : null}
        <div className="divide-y divide-slate-100">
          {(data?.clubs || []).map((club) => (
            <div key={club._id} className="grid gap-3 p-4 lg:grid-cols-[1fr_120px_120px_220px] lg:items-center">
              <div>
                <p className="font-heading font-semibold text-navy">{club.name}</p>
                <p className="text-sm text-slate-600">{club.category} · {club.languageOfOperation}</p>
              </div>
              <span className={`text-sm font-bold ${club.isActive ? 'text-emerald-700' : 'text-rose-700'}`}>{club.isActive ? 'Active' : 'Suspended'}</span>
              <span className={`text-sm font-bold ${club.isVerifiedByStaff ? 'text-apu-crimson' : 'text-slate-500'}`}>{club.isVerifiedByStaff ? 'Verified' : 'Unverified'}</span>
              <div className="flex gap-2">
                <button onClick={() => verify(club)} className="rounded-lg bg-white px-3 py-2 text-sm font-bold text-navy ring-1 ring-slate-200">
                  {club.isVerifiedByStaff ? 'Unverify' : 'Verify'}
                </button>
                <button onClick={() => suspend(club)} className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700">
                  Suspend
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
