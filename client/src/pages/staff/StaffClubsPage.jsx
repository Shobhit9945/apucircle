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
        action={
          <Link
            to="/staff/clubs/new"
            className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-full text-label-lg font-semibold hover:bg-primary-container transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Create club
          </Link>
        }
      />
      <div className="card overflow-hidden">
        {loading && <p className="p-5 text-body-md text-on-surface-variant">Loading clubs...</p>}
        <div className="divide-y divide-outline-variant/40">
          {(data?.clubs || []).map((club) => (
            <div key={club._id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 hover:bg-surface-container-low transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-label-lg text-on-surface font-semibold">{club.name}</p>
                <p className="text-body-sm text-on-surface-variant">{club.category} · {club.languageOfOperation}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-label-md font-semibold ${
                  club.isActive ? 'bg-[#e6f4ea] text-[#137333]' : 'bg-error-container text-on-error-container'
                }`}>
                  {club.isActive ? 'Active' : 'Suspended'}
                </span>
                <span className={`px-3 py-1 rounded-full text-label-md font-semibold ${
                  club.isVerifiedByStaff ? 'bg-primary-fixed text-primary' : 'bg-surface-container-high text-on-surface-variant'
                }`}>
                  {club.isVerifiedByStaff ? 'Verified' : 'Unverified'}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => verify(club)}
                  className="border border-outline-variant text-on-surface px-3 py-1.5 rounded-full text-label-md hover:bg-surface-container-high transition-colors"
                >
                  {club.isVerifiedByStaff ? 'Unverify' : 'Verify'}
                </button>
                <button
                  onClick={() => suspend(club)}
                  className="border border-error/40 text-error bg-error-container/30 px-3 py-1.5 rounded-full text-label-md hover:bg-error-container transition-colors"
                >
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
