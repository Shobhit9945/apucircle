export default function SectionHeader({ title, eyebrow, action }) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? <p className="apu-kicker">{eyebrow}</p> : null}
        <h2 className="font-heading text-2xl font-black text-navy">{title}</h2>
      </div>
      {action}
    </div>
  );
}
