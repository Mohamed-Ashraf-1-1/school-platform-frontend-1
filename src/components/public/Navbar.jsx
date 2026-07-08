import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiCompass, FiSearch } from 'react-icons/fi'; 
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx'; 
import LanguageSwitch from '../common/LanguageSwitch.jsx';

export default function Navbar() {
  const { t } = useLanguage();
  const { isAuthed } = useAdminAuth(); 
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const links = [
    { to: '/', label: t('nav_home'), end: true },
    { to: '/schools', label: t('nav_schools') },
    { to: '/compare', label: t('nav_compare') },
    { to: '/about', label: t('nav_about') },
    { to: '/contact', label: t('nav_contact') },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setOpen(false); // غلق قائمة الموبايل لو كان مفتوحاً
    navigate(searchQuery ? `/schools?search=${encodeURIComponent(searchQuery)}` : '/schools');
  };

  const linkClass = ({ isActive }) =>
    `text-sm font-semibold transition-colors ${
      isActive ? 'text-ink-900' : 'text-ink-400 hover:text-ink-700'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-ink-100/70 bg-paper-100/85 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        
        {/* اللوجو والعنوان - يظهر كاملاً في جميع الأجهزة */}
        <Link to="/" className="flex shrink-0 items-center gap-2.5 max-w-[65%] sm:max-w-none">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-900 text-brass-400">
            <FiCompass className="h-4 w-4" />
          </span>
          <span className="font-display text-sm sm:text-base font-bold text-ink-900 leading-tight">
            دليل مدارس التكنولوجيا التطبيقية
          </span>
        </Link>

        {/* 🔍 مربع البحث الاحترافي للشاشات الكبيرة */}
        <form 
          onSubmit={handleSearchSubmit}
          className="hidden max-w-xs flex-1 items-center gap-2 rounded-full border border-ink-100 bg-white/60 px-3 py-1.5 focus-within:border-ink-300 focus-within:bg-white md:flex transition-all"
        >
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('hero_search_placeholder') || 'ابحث عن مدرسة...'}
            className="w-full bg-transparent text-xs text-ink-900 placeholder:text-ink-300 focus:outline-none"
          />
          <button type="submit" aria-label="Search" className="text-ink-400 hover:text-ink-700 shrink-0">
            <FiSearch className="h-3.5 w-3.5" />
          </button>
        </form>

        {/* الروابط للشاشات الكبيرة */}
        <nav className="hidden items-center gap-6 lg:gap-8 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* أزرار التحكم للأدمن */}
        <div className="hidden items-center gap-3 md:flex shrink-0">
          {isAuthed && (
            <Link to={`/${import.meta.env.VITE_ADMIN_SECRET_PATH}/dashboard`} className="btn-outline !px-4 !py-2 text-xs">
              {t('nav_admin')}
            </Link>
          )}
        </div>

        {/* زر همبرجر للموبايل */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink-700 md:hidden ms-auto"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
        </button>
      </div>

      {/* قائمة الموبايل المنسدلة */}
      {open && (
        <div className="border-t border-ink-100 bg-paper-100 px-4 py-4 md:hidden animate-fadeIn flex flex-col gap-4">
          
          {/* 🔍 مربع البحث داخل قائمة الموبايل لسهولة الاستخدام */}
          <form 
            onSubmit={handleSearchSubmit}
            className="flex items-center gap-2 rounded-full border border-ink-100 bg-white px-3 py-2"
          >
            <FiSearch className="h-4 w-4 text-ink-300 shrink-0" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('hero_search_placeholder') || 'ابحث عن مدرسة...'}
              className="w-full bg-transparent text-sm text-ink-900 placeholder:text-ink-300 focus:outline-none"
            />
            <button type="submit" className="text-xs font-bold text-ink-700 px-2">
              بحث
            </button>
          </form>

          <nav className="flex flex-col gap-3">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                onClick={() => setOpen(false)}
                className={linkClass}
              >
                {l.label}
              </NavLink>
            ))}
            
            {isAuthed && (
              <Link to="/admin" onClick={() => setOpen(false)} className="text-sm font-semibold text-ink-400">
                {t('nav_admin')}
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}