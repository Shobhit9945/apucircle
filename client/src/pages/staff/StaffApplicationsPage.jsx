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
      <SectionHeader title="Club leader applications" eyebrow="Pending review" />
      <div className="grid gap-4">
        {loading ? <div className="card p-5 text-slate-600">Loading applications...</div> : null}
        {(data?.applications || []).map((application) => (
          <article key={application._id} className="card p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="font-heading text-xl font-semibold text-navy">{application.userId?.fullName}</h2>
                <p className="text-sm font-bold text-apu-crimson">{application.clubId?.name}</p>
                <p className="mt-3 text-slate-600">{application.reason}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => review(application, 'approved')} className="rounded-lg bg-emerald-600 px-4 py-2 font-bold text-white">Approve</button>
                <button onClick={() => review(application, 'rejected')} className="rounded-lg bg-rose-50 px-4 py-2 font-bold text-rose-700">Reject</button>
              </div>
            </div>
          </article>
        ))}
        {!loading && (data?.applications || []).length === 0 ? <div className="card p-5 text-slate-600">No pending applications.</div> : null}
      </div>
    </section>
  );
}
