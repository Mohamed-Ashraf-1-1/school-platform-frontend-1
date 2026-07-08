import { useLanguage } from '../../context/LanguageContext.jsx';
import Spinner from '../common/Spinner.jsx';
import EmptyState from '../common/EmptyState.jsx';

/**
 * columns: [{ key, label, render?(row) }]
 * rows: array of data objects (must include `id`)
 */
export default function DataTable({ columns, rows, loading, emptyTitle, emptySubtitle, rowActions }) {
  const { t } = useLanguage();

  if (loading) return <Spinner />;
  if (!rows || rows.length === 0) {
    return <EmptyState title={emptyTitle || t('admin_empty_title')} subtitle={emptySubtitle || t('admin_empty_sub')} />;
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full min-w-[640px] text-start text-sm">
        <thead>
          <tr className="border-b border-ink-100 bg-ink-50/50 text-xs font-semibold uppercase tracking-wide text-ink-400">
            {columns.map((col) => (
              <th key={col.key} className="whitespace-nowrap px-4 py-3 text-start">
                {col.label}
              </th>
            ))}
            {rowActions && <th className="px-4 py-3 text-start">{t('admin_table_actions')}</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-ink-50 last:border-0 hover:bg-ink-50/40">
              {columns.map((col) => (
                <td key={col.key} className="whitespace-nowrap px-4 py-3.5 text-ink-700">
                  {col.render ? col.render(row) : row[col.key] ?? '—'}
                </td>
              ))}
              {rowActions && <td className="whitespace-nowrap px-4 py-3.5">{rowActions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
