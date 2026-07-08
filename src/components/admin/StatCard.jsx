export default function StatCard({ icon: Icon, label, value, tone = 'brass' }) {
  const tones = {
    brass: 'bg-brass-50 text-brass-600',
    teal: 'bg-teal-50 text-teal-600',
    ink: 'bg-ink-50 text-ink-700',
    clay: 'bg-clay-50 text-clay-600',
  };
  return (
    <div className="card flex items-center gap-4 p-5">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${tones[tone]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="font-display text-2xl font-bold text-ink-900">{value ?? '—'}</p>
        <p className="text-xs font-medium text-ink-400">{label}</p>
      </div>
    </div>
  );
}
