import { FiAlertTriangle } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function ErrorState({ message, onRetry }) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-clay-50 bg-clay-50/40 px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-clay-50 text-clay-500">
        <FiAlertTriangle className="h-6 w-6" />
      </div>
      <p className="font-display text-lg font-semibold text-ink-800">{t('error_generic')}</p>
      {message && <p className="mt-1.5 max-w-sm text-sm text-ink-400">{message}</p>}
      {onRetry && (
        <button onClick={onRetry} className="btn-outline mt-5">
          {t('retry')}
        </button>
      )}
    </div>
  );
}
