import { useEffect, useState } from 'react';
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
    <Link to="/notifications" className="relative p-1 text-on-surface-variant hover:text-primary transition-colors">
      <span className="material-symbols-outlined text-[24px]">notifications</span>
      {unread > 0 && (
        <span className="absolute -right-1 -top-1 min-w-[18px] h-[18px] bg-primary text-on-primary text-[10px] font-bold rounded-full flex items-center justify-center px-1">
          {unread}
        </span>
      )}
    </Link>
  );
}
