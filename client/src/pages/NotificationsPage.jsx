import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader.jsx';
import { api } from '../api/client.js';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  function load() {
    api.get('/notifications').then(({ data }) => setNotifications(data.notifications || []));
  }

  useEffect(() => { load(); }, []);

  async function markRead(notification) {
    await api.put(`/notifications/${notification._id}/read`);
    load();
  }

  async function markAllRead() {
    await api.put('/notifications/read-all');
    load();
  }

  return (
    <section className="max-w-2xl">
      <SectionHeader
        title="Notifications"
        eyebrow="Inbox"
        action={
          <button
            onClick={markAllRead}
            className="border border-outline-variant bg-surface-container-lowest text-on-surface px-4 py-2 rounded-full text-label-md hover:bg-surface-container-high transition-colors"
          >
            Mark all read
          </button>
        }
      />

      {notifications.length === 0 && (
        <div className="card p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-on-surface-variant text-[32px]">notifications_none</span>
          </div>
          <p className="text-headline-sm font-semibold text-on-surface">All caught up</p>
          <p className="text-body-md text-on-surface-variant mt-2">No notifications yet.</p>
        </div>
      )}

      <div className="card divide-y divide-outline-variant/40 overflow-hidden">
        {notifications.map((n) => (
          <article
            key={n._id}
            className={`flex gap-4 p-5 items-start ${!n.readAt ? 'bg-primary-fixed/30' : ''}`}
          >
            <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${!n.readAt ? 'bg-primary' : 'bg-transparent'}`} />
            <div className="flex-1 min-w-0">
              <p className="text-label-lg text-on-surface font-semibold">{n.title}</p>
              <p className="text-body-sm text-on-surface-variant mt-0.5">{n.body}</p>
              <p className="text-label-md text-on-surface-variant mt-1">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              {n.link && (
                <Link to={n.link} className="bg-primary text-on-primary px-3 py-1.5 rounded-full text-label-md font-semibold hover:bg-primary-container transition-colors">
                  Open
                </Link>
              )}
              {!n.readAt && (
                <button
                  onClick={() => markRead(n)}
                  className="border border-outline-variant text-on-surface px-3 py-1.5 rounded-full text-label-md hover:bg-surface-container-high transition-colors"
                >
                  Read
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
