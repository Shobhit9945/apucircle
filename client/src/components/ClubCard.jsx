import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import LanguageBadge from './LanguageBadge.jsx';
import StatusBadge from './StatusBadge.jsx';

const fallbackImage =
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80';

export default function ClubCard({ club, action }) {
  return (
    <article className="card card-hover overflow-hidden">
      <Link to={`/clubs/${club.slug}`} className="block">
        <div className="relative aspect-[16/8] bg-slate-200">
          <img
            src={club.bannerImage || fallbackImage}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute left-0 top-0 h-1 w-full bg-apu-crimson" />
        </div>
      </Link>
      <div className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link to={`/clubs/${club.slug}`} className="font-heading text-lg font-black text-navy hover:text-apu-crimson">
              {club.name}
            </Link>
            <p className="mt-1 line-clamp-2 text-sm text-slate-600">{club.description}</p>
          </div>
          <LanguageBadge language={club.languageOfOperation} />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="border border-line bg-mist px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-graphite">
            {club.category}
          </span>
          <StatusBadge status={club.activityStatus} />
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600">
            <Users size={16} />
            {club.memberCount ?? club.members?.length ?? 0} members
          </span>
          {action || (
            <Link
              to={`/clubs/${club.slug}`}
              className="focus-ring bg-apu-crimson px-3 py-2 text-sm font-bold text-white hover:bg-crimson-dark"
            >
              View
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
