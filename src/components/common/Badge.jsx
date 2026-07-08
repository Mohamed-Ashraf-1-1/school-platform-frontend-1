export default function Badge({ children, tone = 'ink' }) {
  const tones = {
    ink: 'bg-ink-50 text-ink-700',
    brass: 'bg-brass-50 text-brass-700',
    teal: 'bg-teal-50 text-teal-700',
    clay: 'bg-clay-50 text-clay-600',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}
