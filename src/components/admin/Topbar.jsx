import { FiMenu, FiLogOut } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx';
import LanguageSwitch from '../common/LanguageSwitch.jsx';

export default function Topbar({ title, subtitle, onMenuClick }) {
  const { t } = useLanguage();
  const { logout } = useAdminAuth();
  const displayTitle = title || t('nav_admin');

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-ink-100 bg-paper-100/90 px-5 py-4 backdrop-blur-md sm:px-8">
      <div className="flex items-center gap-3">
        <button
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink-700 lg:hidden"
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <FiMenu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="font-display text-lg font-bold text-ink-900 sm:text-xl">{displayTitle}</h1>
          {subtitle && <p className="text-xs text-ink-400 sm:text-sm">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <LanguageSwitch className="hidden sm:inline-flex" />
        <button onClick={logout} className="btn-outline !px-4 !py-2 text-xs">
          <FiLogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{t('admin_logout')}</span>
        </button>
      </div>
    </header>
  );
}
