import { FiSearch, FiPlus } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function Toolbar({ search, onSearchChange, onAddClick, addLabel }) {
  const { t } = useLanguage();
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-xs">
        <FiSearch className="pointer-events-none absolute top-1/2 -translate-y-1/2 start-3.5 h-4 w-4 text-ink-300" />
        <input
          className="input !ps-10"
          placeholder={t('admin_search_placeholder')}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      {onAddClick && (
        <button onClick={onAddClick} className="btn-accent shrink-0">
          <FiPlus className="h-4 w-4" />
          {addLabel || t('admin_add_new')}
        </button>
      )}
    </div>
  );
}
