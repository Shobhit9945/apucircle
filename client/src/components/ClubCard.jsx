import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge.jsx';

const fallbackImage =
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80';

function getInitials(name) {
  return (name || '')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function ClubCard({ club, action }) {
  const initials = getInitials(club.name);

  return (
    <article className="card card-hover overflow-hidden flex flex-col group cursor-pointer relative">
      {/* Status Badge */}
      {club.activityStatus && (
        <div className="absolute top-3 right-3 z-10">
          <StatusBadge status={club.activityStatus} />
        </div>
      )}

      {/* Cover Image */}
      <Link to={`/clubs/${club.slug}`} className="block">
        <div className="h-32 w-full bg-surface-container-high relative overflow-hidden">
          <img
            src={club.bannerImage || fallbackImage}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 pt-8 relative flex-1 flex flex-col">
        {/* Club Avatar */}
        <div className="absolute -top-6 left-5 w-12 h-12 rounded-full border-4 border-surface-container-lowest bg-primary shadow-sm flex items-center justify-center text-on-primary font-bold text-base overflow-hidden">
          {initials}
        </div>

        <Link to={`/clubs/${club.slug}`} className="hover:text-primary transition-colors">
          <h4 className="text-headline-sm font-semibold text-on-surface mb-1 line-clamp-1">{club.name}</h4>
        </Link>

        <p className="text-body-sm text-on-surface-variant mb-3 flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">language</span>
          {club.languageOfOperation || 'English'}
        </p>

        <div className="flex flex-wrap gap-2 mt-auto">
          {club.category && (
            <span className="bg-surface-container-low text-on-surface-variant px-2.5 py-1 rounded-md text-[11px] font-semibold">
              {club.category}
            </span>
          )}
          {(club.tags || []).slice(0, 2).map((tag) => (
            <span key={tag} className="bg-surface-container-low text-on-surface-variant px-2.5 py-1 rounded-md text-[11px] font-semibold">
              {tag}
            </span>
          ))}
        </div>

        {/* Member count or action */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="flex items-center gap-1 text-body-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px]">group</span>
            {club.memberCount ?? club.members?.length ?? 0} members
          </span>
          {action || (
            <Link
              to={`/clubs/${club.slug}`}
              className="text-primary text-label-md font-semibold hover:underline"
            >
              View
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
