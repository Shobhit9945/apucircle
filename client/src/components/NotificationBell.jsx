import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../api/client.js';

export default function NotificationBell() {
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    api
      .get('/notifications')
      .then(({ data }) => setUnread(data.unreadCount || 0))
      .catch(() => setUnread(0));
  }, []);

  return (
    <Link to="/notifications" className="focus-ring relative p-2 text-graphite hover:text-apu-crimson">
      <Bell size={20} />
      {unread > 0 ? (
        <span className="absolute -right-1 -top-1 bg-apu-crimson px-1.5 text-xs font-bold text-white">
          {unread}
        </span>
      ) : null}
    </Link>
  );
}
