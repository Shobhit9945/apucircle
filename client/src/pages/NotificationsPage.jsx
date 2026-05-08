import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader.jsx';
import { api } from '../api/client.js';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  function load() {
    api.get('/notifications').then(({ data }) => setNotifications(data.notifications || []));
  }

  useEffect(() => {
    load();
  }, []);

  async function markRead(notification) {
    await api.put(`/notifications/${notification._id}/read`);
    load();
  }

  async function markAllRead() {
    await api.put('/notifications/read-all');
    load();
  }

  return (
    <section>
      <SectionHeader
        title="Notifications"
        eyebrow="Inbox"
        action={<button onClick={markAllRead} className="border border-line bg-white px-3 py-2 text-sm font-bold text-navy hover:border-apu-crimson hover:text-apu-crimson">Mark all read</button>}
      />
      <div className="card divide-y divide-slate-100">
        {notifications.length === 0 ? <p className="p-5 text-sm text-slate-600">No notifications yet.</p> : null}
        {notifications.map((notification) => (
          <article key={notification._id} className={`grid gap-3 p-5 sm:grid-cols-[1fr_auto] ${notification.readAt ? '' : 'border-l-4 border-apu-crimson bg-mist'}`}>
            <div>
              <p className="font-heading font-semibold text-navy">{notification.title}</p>
              <p className="text-sm text-slate-600">{notification.body}</p>
              <p className="mt-1 text-xs font-semibold text-slate-400">{new Date(notification.createdAt).toLocaleString()}</p>
            </div>
            <div className="flex gap-2">
              {notification.link ? (
                <Link to={notification.link} className="rounded-lg bg-navy px-3 py-2 text-sm font-bold text-white">
                  Open
                </Link>
              ) : null}
              {!notification.readAt ? (
                <button onClick={() => markRead(notification)} className="rounded-lg bg-white px-3 py-2 text-sm font-bold text-navy">
                  Read
                </button>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
