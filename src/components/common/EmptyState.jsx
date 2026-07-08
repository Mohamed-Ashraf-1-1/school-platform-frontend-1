import { FiInbox } from 'react-icons/fi';

export default function EmptyState({ icon, title, subtitle, action }) {
  const Icon = icon || FiInbox;
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 bg-white/60 px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-ink-50 text-ink-400">
        <Icon className="h-6 w-6" />
      </div>
      <p className="font-display text-lg font-semibold text-ink-800">{title}</p>
      {subtitle && <p className="mt-1.5 max-w-sm text-sm text-ink-400">{subtitle}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
