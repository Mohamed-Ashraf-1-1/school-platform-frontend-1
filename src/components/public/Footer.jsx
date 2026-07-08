import { Link } from 'react-router-dom';
import { FiCompass } from 'react-icons/fi'; // تم تغييرها هنا لتطابق الـ Navbar
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  const links = [
    { to: '/schools', label: t('nav_schools') },
    { to: '/compare', label: t('nav_compare') },
    { to: '/about', label: t('nav_about') },
    { to: '/contact', label: t('nav_contact') },
  ];

  return (
    <footer className="border-t border-ink-100 bg-ink-900 text-paper-200">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[2fr,1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brass-400 text-ink-900">
              {/* تم التعديل إلى أيقونة البوصلة لتطابق الهوية الجديدة */}
              <FiCompass className="h-4 w-4" />
            </span>
            {/* تم التعديل هنا مباشرة ليصبح نفس اسم الـ Navbar */}
            <span className="font-display text-lg font-bold text-paper-50">دليل التكنولوجيا التطبيقية</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-200">{t('footer_about_short')}</p>
        </div>

        <div>
          <p className="eyebrow !text-brass-300">{t('footer_quick_links')}</p>
          <ul className="mt-4 flex flex-col gap-2.5">
            {links.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-sm text-ink-200 transition hover:text-paper-50">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-800">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-ink-400 sm:flex-row">
          <div className="flex flex-col gap-1 sm:flex-row sm:gap-2 items-center">
            <span>
              © {year} دليل التكنولوجيا التطبيقية — {t('footer_rights')}
            </span>
            <span className="hidden sm:inline text-ink-600">|</span>
            {/* 🌟 جملة التطوير برقمك الحقيقي وخط أعرض وأوضح ولون نحاسي زاهي */}
            <span className="text-brass-400 font-bold tracking-wide text-[13px] bg-ink-800/50 px-2.5 py-0.5 rounded border border-ink-700/30">
              Developed by Mohamed Ashraf (+20 120 692 3817)
            </span>
          </div>
          <span>{t('brand_sub')}</span>
        </div>
      </div>
    </footer>
  );
}