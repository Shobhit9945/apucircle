export default function SectionHeader({ title, eyebrow, action }) {
  return (
    <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="text-label-md text-primary font-semibold uppercase tracking-wider mb-1">{eyebrow}</p>
        )}
        <h2 className="text-headline-md font-bold text-on-surface">{title}</h2>
      </div>
      {action}
    </div>
  );
}
