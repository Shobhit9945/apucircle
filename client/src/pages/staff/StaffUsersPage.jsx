import SectionHeader from '../../components/SectionHeader.jsx';
import { api } from '../../api/client.js';
import { useFetch } from '../../hooks/useFetch.js';

export default function StaffUsersPage() {
  const { data, loading } = useFetch(() => api.get('/staff/users').then((res) => res.data), []);

  return (
    <section>
      <SectionHeader title="Users" eyebrow="Directory" />
      <div className="card overflow-hidden">
        {loading ? <p className="p-5 text-slate-600">Loading users...</p> : null}
        <div className="divide-y divide-slate-100">
          {(data?.users || []).map((user) => (
            <div key={user._id} className="grid gap-2 p-4 md:grid-cols-[1fr_140px_160px]">
              <div>
                <p className="font-heading font-semibold text-navy">{user.fullName}</p>
                <p className="text-sm text-slate-600">{user.email}</p>
              </div>
              <span className="text-sm font-bold text-apu-crimson">{user.role}</span>
              <span className="text-sm text-slate-600">Semester {user.semester}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
