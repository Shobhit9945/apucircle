const styles = {
  English: 'bg-surface-container text-on-surface-variant',
  Japanese: 'bg-primary-fixed text-primary',
  Bilingual: 'bg-tertiary-fixed text-tertiary'
};

const labels = {
  English: 'EN',
  Japanese: 'JP',
  Bilingual: 'Bilingual'
};

export default function LanguageBadge({ language }) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-label-md font-semibold ${styles[language] || styles.English}`}>
      {labels[language] || language}
    </span>
  );
}
