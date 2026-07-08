import { Link } from 'react-router-dom';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function CTASection() {
  const { t, dir } = useLanguage();
  const Arrow = dir === 'rtl' ? FiArrowLeft : FiArrowRight;

  return (
    <section className="container-page pb-20">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ink-900 to-ink-700 px-8 py-14 text-center sm:px-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #C69A3C 1.5px, transparent 1.5px)',
            backgroundSize: '24px 24px',
          }}
          aria-hidden="true"
        />
        <div className="relative">
          <h2 className="font-display text-2xl font-bold text-paper-50 sm:text-3xl">
            {t('section_cta_title')}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-ink-200">{t('section_cta_sub')}</p>
          <Link to="/schools" className="btn-accent mt-7 inline-flex">
            {t('section_cta_btn')}
            <Arrow className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
