const toneClasses = {
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  yellow: 'bg-amber-50 text-amber-700 ring-amber-200',
  red: 'bg-rose-50 text-rose-700 ring-rose-200'
};

const dotClasses = {
  green: 'bg-emerald-500',
  yellow: 'bg-amber-500',
  red: 'bg-rose-500'
};

export default function StatusBadge({ status }) {
  const tone = status?.tone || 'red';
  const label = status?.label || 'Inactive';

  return (
    <span className={`inline-flex items-center gap-1.5 border px-2.5 py-1 text-xs font-bold ${toneClasses[tone]}`}>
      <span className={`h-2 w-2 rounded-full ${dotClasses[tone]}`} />
      {label}
    </span>
  );
}
