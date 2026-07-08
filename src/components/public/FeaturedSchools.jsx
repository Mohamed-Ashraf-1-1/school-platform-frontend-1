import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { listSchools } from '../../services/schools.js';
import SchoolCard from './SchoolCard.jsx';
import Spinner from '../common/Spinner.jsx';
import ErrorState from '../common/ErrorState.jsx';

export default function FeaturedSchools() {
  const { t } = useLanguage();
  const [state, setState] = useState({ items: null, error: null });

  useEffect(() => {
    listSchools({ limit: 8, sortBy: 'createdAt', sortOrder: 'desc' })
      .then((res) => setState({ items: res.data || [], error: null }))
      .catch((err) => setState({ items: null, error: err.message }));
  }, []);

  return (
    <section className="container-page py-16 sm:py-20">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <span className="eyebrow">{t('section_featured')}</span>
          <h2 className="font-display mt-2 text-2xl font-bold text-ink-900 sm:text-3xl">
            {t('section_featured_sub')}
          </h2>
        </div>
        <Link to="/schools" className="hidden text-sm font-semibold text-teal-600 hover:text-teal-700 sm:block">
          {t('view_all')}
        </Link>
      </div>

      {state.error && <ErrorState message={state.error} />}
      {!state.error && state.items === null && <Spinner />}
      {!state.error && state.items && state.items.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {state.items.map((school) => (
            <SchoolCard key={school.id} school={school} />
          ))}
        </div>
      )}
    </section>
  );
}
