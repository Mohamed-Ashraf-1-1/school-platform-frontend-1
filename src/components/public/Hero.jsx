import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function Hero() {
  const { t, dir } = useLanguage();
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const Arrow = dir === 'rtl' ? FiArrowLeft : FiArrowRight;

  const onSubmit = (e) => {
    e.preventDefault();
    navigate(q ? `/schools?search=${encodeURIComponent(q)}` : '/schools');
  };

  return (
    <section className="relative overflow-hidden bg-ink-900">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #C69A3C 1.5px, transparent 1.5px)',
          backgroundSize: '28px 28px',
        }}
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute -top-32 end-[-10%] h-96 w-96 rounded-full bg-brass-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 start-[-10%] h-96 w-96 rounded-full bg-teal-400/10 blur-3xl" />

      <div className="container-page relative py-20 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow animate-fadeUp justify-center">{t('hero_eyebrow')}</span>
          <h1
            className="font-display mt-5 animate-fadeUp text-4xl font-bold leading-[1.15] text-paper-50 sm:text-5xl"
            style={{ animationDelay: '0.08s' }}
          >
            {t('hero_title_1')}
            <br />
            <span className="text-brass-400">{t('hero_title_2')}</span>
          </h1>
          <p
            className="mx-auto mt-5 max-w-lg animate-fadeUp text-base leading-relaxed text-ink-200"
            style={{ animationDelay: '0.16s' }}
          >
            {t('hero_subtitle')}
          </p>

          <form
            onSubmit={onSubmit}
            className="mx-auto mt-8 flex max-w-lg animate-fadeUp items-center gap-2 rounded-full bg-white p-1.5 shadow-lifted"
            style={{ animationDelay: '0.24s' }}
          >
            <FiSearch className="ms-3 h-4 w-4 shrink-0 text-ink-300" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t('hero_search_placeholder')}
              className="w-full bg-transparent py-2 text-sm text-ink-900 placeholder:text-ink-300 focus:outline-none"
            />
            <button type="submit" className="btn-accent shrink-0 !py-2.5">
              {t('hero_search_btn')}
              <Arrow className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
