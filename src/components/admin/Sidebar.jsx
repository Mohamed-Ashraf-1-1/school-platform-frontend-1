import { NavLink, Link } from 'react-router-dom';
import {
  FiGrid,
  FiHome,
  FiMapPin,
  FiBriefcase,
  FiLayers,
  FiImage,
  FiExternalLink,
} from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function Sidebar({ open, onClose }) {
  const { t } = useLanguage();

  // تحديث المصفوفة هنا لتقرأ المسار السري من ملف البيئة .env ديناميكياً
  const items = [
    { to: `/${import.meta.env.VITE_ADMIN_SECRET_PATH}/dashboard`, label: t('admin_sidebar_dashboard'), icon: FiGrid, end: true },
    { to: `/${import.meta.env.VITE_ADMIN_SECRET_PATH}/schools`, label: t('admin_sidebar_schools'), icon: FiHome },
    { to: `/${import.meta.env.VITE_ADMIN_SECRET_PATH}/governorates`, label: t('admin_sidebar_governorates'), icon: FiMapPin },
    { to: `/${import.meta.env.VITE_ADMIN_SECRET_PATH}/partners`, label: t('admin_sidebar_partners'), icon: FiBriefcase },
    { to: `/${import.meta.env.VITE_ADMIN_SECRET_PATH}/specializations`, label: t('admin_sidebar_specializations'), icon: FiLayers },
    { to: `/${import.meta.env.VITE_ADMIN_SECRET_PATH}/media`, label: t('admin_sidebar_media'), icon: FiImage },
  ];

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
      isActive ? 'bg-brass-400 text-ink-900' : 'text-ink-200 hover:bg-ink-800 hover:text-paper-50'
    }`;

  const content = (
    <>
      <Link to="/" className="mb-8 flex items-center gap-2.5 px-1">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brass-400 text-ink-900">
          <FiGrid className="h-4 w-4" />
        </span>
        <span className="font-display text-base font-bold text-paper-50">{t('brand')}</span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1.5">
        {items.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={linkClass} onClick={onClose}>
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <Link
        to="/"
        className="mt-6 flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-ink-300 hover:bg-ink-800 hover:text-paper-50"
      >
        <FiExternalLink className="h-4 w-4 shrink-0" />
        {t('admin_sidebar_view_site')}
      </Link>
    </>
  );

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-ink-900 p-4 lg:flex">
        {content}
      </aside>

      {open && (
        <div className="fixed inset-0 z-[95] lg:hidden">
          <div className="absolute inset-0 bg-ink-900/60" onClick={onClose} />
          <aside className="absolute inset-y-0 start-0 flex w-72 flex-col bg-ink-900 p-4 animate-fadeIn">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}