const styles = {
  green: {
    wrapper: 'bg-[#e6f4ea] text-[#137333]',
    dot: 'bg-[#1e8e3e] animate-pulse'
  },
  yellow: {
    wrapper: 'bg-[#fef7e0] text-[#b06000]',
    dot: 'bg-[#f9ab00]'
  },
  red: {
    wrapper: 'bg-[#fce8e6] text-[#c5221f]',
    dot: 'bg-[#ea4335]'
  }
};

export default function StatusBadge({ status }) {
  const tone = status?.tone || 'red';
  const label = status?.label || 'Inactive';
  const s = styles[tone] || styles.red;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-label-md shadow-sm ${s.wrapper}`}>
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${s.dot}`} />
      {label}
    </span>
  );
}
