import { FiGlobe } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function LanguageSwitch({ className = '' }) {
  const { toggleLang, t } = useLanguage();
  return (
    <button
      onClick={toggleLang}
      className={`inline-flex items-center gap-1.5 rounded-full border border-ink-200 px-3 py-1.5 text-xs font-semibold text-ink-700 transition hover:border-ink-400 ${className}`}
      aria-label="Toggle language"
    >
      <FiGlobe className="h-3.5 w-3.5" />
      {t('lang_toggle')}
    </button>
  );
}
