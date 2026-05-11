import SectionHeader from '../../components/SectionHeader.jsx';
import { api } from '../../api/client.js';
import { useFetch } from '../../hooks/useFetch.js';

export default function StaffUsersPage() {
  const { data, loading } = useFetch(() => api.get('/staff/users').then((res) => res.data), []);

  return (
    <section>
      <SectionHeader title="Users" eyebrow="Directory" />
      <div className="card overflow-hidden">
        {loading && <p className="p-5 text-body-md text-on-surface-variant">Loading users...</p>}
        <div className="divide-y divide-outline-variant/40">
          {(data?.users || []).map((user) => (
            <div key={user._id} className="flex items-center gap-4 p-4 hover:bg-surface-container-low transition-colors">
              <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-xs font-bold text-on-surface-variant flex-shrink-0">
                {user.fullName?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-label-lg text-on-surface font-semibold">{user.fullName}</p>
                <p className="text-body-sm text-on-surface-variant">{user.email}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-label-md font-semibold flex-shrink-0 ${
                user.role === 'staff' ? 'bg-primary-fixed text-primary' : 'bg-surface-container-high text-on-surface-variant'
              }`}>
                {user.role}
              </span>
              <span className="text-body-sm text-on-surface-variant hidden sm:block flex-shrink-0">
                Semester {user.semester}
              </span>
            </div>
          ))}
          {!loading && (data?.users || []).length === 0 && (
            <p className="p-5 text-body-md text-on-surface-variant">No users found.</p>
          )}
        </div>
      </div>
    </section>
  );
}
