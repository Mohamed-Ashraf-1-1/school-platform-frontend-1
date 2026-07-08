import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiLayers, FiArrowUpLeft } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { specializationsApi } from '../../services/specializations.js';
import Spinner from '../common/Spinner.jsx';

export default function CategoriesSection() {
  const { t } = useLanguage();
  const [specs, setSpecs] = useState(null);

  useEffect(() => {
    specializationsApi
      .list({ limit: 8 })
      .then((res) => setSpecs(res.data || []))
      .catch(() => setSpecs([]));
  }, []);

  return (
    <section className="container-page py-16 sm:py-20">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <span className="eyebrow">{t('section_categories')}</span>
          <h2 className="font-display mt-2 text-2xl font-bold text-ink-900 sm:text-3xl">
            {t('section_categories_sub')}
          </h2>
        </div>
      </div>

      {specs === null ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {specs.map((s) => (
            <Link
              key={s.id}
              to={`/schools?specialization=${s.id}`}
              className="group card flex flex-col justify-between p-5 transition hover:-translate-y-1 hover:border-brass-200 hover:shadow-lifted"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                <FiLayers className="h-4 w-4" />
              </div>
              <div className="mt-6 flex items-end justify-between">
                <div>
                  <p className="font-display text-sm font-semibold text-ink-900">{s.name}</p>
                  {typeof s._count?.schools === 'number' && (
                    <p className="mt-0.5 text-xs text-ink-400">
                      {s._count.schools} {t('hero_stat_schools')}
                    </p>
                  )}
                </div>
                <FiArrowUpLeft className="h-4 w-4 text-ink-200 transition group-hover:text-brass-400" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
