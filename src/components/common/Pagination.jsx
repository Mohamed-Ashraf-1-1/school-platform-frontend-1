import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function Pagination({ page, totalPages, onChange }) {
  const { t, dir } = useLanguage();
  if (!totalPages || totalPages <= 1) return null;

  const PrevIcon = dir === 'rtl' ? FiChevronRight : FiChevronLeft;
  const NextIcon = dir === 'rtl' ? FiChevronLeft : FiChevronRight;

  const pages = getPageWindow(page, totalPages);

  return (
    <nav className="mt-10 flex items-center justify-center gap-1.5" aria-label="Pagination">
      <button
        className="btn-ghost h-9 w-9 rounded-full p-0"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        aria-label="Previous page"
      >
        <PrevIcon className="h-4 w-4" />
      </button>

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`dots-${i}`} className="px-1.5 text-ink-300">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={`h-9 w-9 rounded-full text-sm font-semibold transition ${
              p === page ? 'bg-ink-900 text-paper-100' : 'text-ink-600 hover:bg-ink-50'
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        className="btn-ghost h-9 w-9 rounded-full p-0"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        aria-label="Next page"
      >
        <NextIcon className="h-4 w-4" />
      </button>
    </nav>
  );
}

function getPageWindow(current, total) {
  const delta = 1;
  const range = [];
  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    range.push(i);
  }
  if (current - delta > 2) range.unshift('...');
  if (current + delta < total - 1) range.push('...');
  range.unshift(1);
  if (total > 1) range.push(total);
  return [...new Set(range)];
}
