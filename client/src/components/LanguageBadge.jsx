const classes = {
  English: 'border-line bg-white text-graphite',
  Japanese: 'border-apu-crimson bg-white text-apu-crimson',
  Bilingual: 'border-black bg-black text-white'
};

const labels = {
  English: 'EN',
  Japanese: 'JP',
  Bilingual: 'Bilingual'
};

export default function LanguageBadge({ language }) {
  return (
    <span className={`border px-2.5 py-1 text-xs font-black uppercase tracking-wide ${classes[language] || classes.English}`}>
      {labels[language] || language}
    </span>
  );
}
