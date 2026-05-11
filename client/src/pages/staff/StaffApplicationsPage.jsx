import toast from 'react-hot-toast';
import SectionHeader from '../../components/SectionHeader.jsx';
import { api, errorMessage } from '../../api/client.js';
import { useFetch } from '../../hooks/useFetch.js';

export default function StaffApplicationsPage() {
  const { data, loading, setData } = useFetch(() => api.get('/staff/applications?status=pending').then((res) => res.data), []);

  async function refresh() {
    const { data: next } = await api.get('/staff/applications?status=pending');
    setData(next);
  }

  async function review(application, status) {
    try {
      await api.put(`/staff/applications/${application._id}`, { status });
      toast.success(`Application ${status}`);
      refresh();
    } catch (error) {
      toast.error(errorMessage(error, 'Could not review application'));
    }
  }

  return (
    <section>
      <SectionHeader
        title="Club Leader Applications"
        eyebrow="Pending Review"
        action={
          <span className={`px-3 py-1.5 rounded-full text-label-md font-semibold ${
            (data?.applications || []).length > 0 ? 'bg-error-container text-on-error-container' : 'bg-surface-container text-on-surface-variant'
          }`}>
            {(data?.applications || []).length} Pending
          </span>
        }
      />
      <div className="space-y-4">
        {loading && <div className="card p-5 text-body-md text-on-surface-variant">Loading applications...</div>}
        {!loading && (data?.applications || []).length === 0 && (
          <div className="card p-8 text-center">
            <span className="material-symbols-outlined text-[48px] text-on-surface-variant mb-3">assignment_turned_in</span>
            <p className="text-body-md text-on-surface-variant">No pending applications.</p>
          </div>
        )}
        {(data?.applications || []).map((application) => (
          <article key={application._id} className="card p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {application.userId?.fullName?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h2 className="text-label-lg text-on-surface font-semibold">{application.userId?.fullName}</h2>
                    <p className="text-label-md text-primary font-semibold">{application.clubId?.name}</p>
                  </div>
                </div>
                <p className="text-body-md text-on-surface-variant bg-surface-container rounded-xl p-4">{application.reason}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => review(application, 'approved')}
                  className="flex items-center gap-1.5 bg-[#e6f4ea] text-[#137333] border border-[#ceead6] px-4 py-2 rounded-full text-label-md font-semibold hover:bg-[#c8e6c9] transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  Approve
                </button>
                <button
                  onClick={() => review(application, 'rejected')}
                  className="flex items-center gap-1.5 bg-error-container text-on-error-container px-4 py-2 rounded-full text-label-md font-semibold hover:bg-error-container/80 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">cancel</span>
                  Reject
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
