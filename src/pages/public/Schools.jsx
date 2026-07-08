import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { listSchools } from '../../services/schools.js';
import { useCompareList } from '../../hooks/useCompareList.js';
import SchoolFilters from '../../components/public/SchoolFilters.jsx';
import SchoolCard from '../../components/public/SchoolCard.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import Spinner from '../../components/common/Spinner.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import { PAGE_SIZE } from '../../utils/constants.js';

function sanitizeSearchInput(value) {
  if (!value) return '';
  return value
    .replace(/<[^>]*>?/g, '')
    .replace(/[<>"'`;(){}[\]\\]/g, '')
    .trim()
    .slice(0, 100);
}

export default function Schools() {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const compare = useCompareList();

  // Read every filter value directly from the URL params to keep them in sync
  const searchParam = searchParams.get('search') || '';
  const govParam = searchParams.get('governorate') || '';
  const specParam = searchParams.get('specialization') || '';
  const minScoreParam = searchParams.get('minScore') || '';
  const maxScoreParam = searchParams.get('maxScore') || '';
  const durationParam = searchParams.get('studyDuration') || '';
  const genderParam = searchParams.get('gender') || '';

  const [page, setPage] = useState(1);
  const [state, setState] = useState({ items: null, meta: null, error: null });

  const safeSearch = sanitizeSearchInput(searchParam);

  const handleFilterChange = (newFilters) => {
    const params = new URLSearchParams();
    if (newFilters.search) params.set('search', newFilters.search);
    if (newFilters.governorate) params.set('governorate', newFilters.governorate);
    if (newFilters.specialization) params.set('specialization', newFilters.specialization);
    if (newFilters.minScore) params.set('minScore', newFilters.minScore);
    if (newFilters.maxScore) params.set('maxScore', newFilters.maxScore);
    if (newFilters.studyDuration) params.set('studyDuration', newFilters.studyDuration);
    if (newFilters.gender) params.set('gender', newFilters.gender);
    setSearchParams(params);
    setPage(1);
  };

  const resetFilters = () => {
    setSearchParams(new URLSearchParams());
    setPage(1);
  };

  const currentFilters = {
    search: searchParam,
    governorate: govParam,
    specialization: specParam,
    minScore: minScoreParam,
    maxScore: maxScoreParam,
    studyDuration: durationParam,
    gender: genderParam,
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  useEffect(() => {
    let cancelled = false;
    setState((prev) => ({ ...prev, error: null }));

    listSchools({
      page,
      limit: PAGE_SIZE,
      search: safeSearch,
      governorate: govParam,
      specialization: specParam,
      minScore: minScoreParam,
      maxScore: maxScoreParam,
      studyDuration: durationParam,
      gender: genderParam,
    })
      .then((res) => {
        if (cancelled) return;
        // قمنا بتعديل res.data إلى res.items ليتوافق تماماً مع الـ Object القادم من الباك إند
        setState({ items: res.items || [], meta: res.meta || null, error: null });
      })
      .catch((err) => {
        if (cancelled) return;
        setState({ items: null, meta: null, error: err.message });
      });

    return () => {
      cancelled = true;
    };
  }, [page, safeSearch, govParam, specParam, minScoreParam, maxScoreParam, durationParam, genderParam]);

  return (
    <div className="container-page py-10 sm:py-14 relative">
      <style>{`
        .equal-grid-container {
          display: grid;
          grid-template-columns: repeat(1, minmax(0, 1fr));
          gap: 1.5rem;
          align-items: stretch;
        }
        @media (min-width: 640px) { .equal-grid-container { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        @media (min-width: 1280px) { .equal-grid-container { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
        .school-card-animate {
          opacity: 0;
          animation: schoolCardFadeInUp 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.4s cubic-bezier(0.25, 1, 0.5, 1);
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        @keyframes schoolCardFadeInUp {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .school-card-animate:hover { transform: translateY(-8px); }
        .school-card-animate > * { display: flex !important; flex-direction: column !important; height: 100% !important; justify-content: space-between !important; }
      `}</style>

      <div className="mb-8">
        <span className="eyebrow">{t('nav_schools')}</span>
        <h1 className="font-display mt-2 text-2xl font-bold text-ink-900 sm:text-3xl">{t('schools_page_title')}</h1>
        <p className="mt-1.5 text-sm text-ink-400">{t('schools_page_sub')}</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px,1fr]">
        <SchoolFilters filters={currentFilters} onChange={handleFilterChange} onReset={resetFilters} />

        <div>
          {state.error && <ErrorState message={state.error} />}
          {!state.error && state.items === null && <Spinner />}
          {!state.error && state.items && state.items.length === 0 && (
            <EmptyState title={t('schools_empty_title')} subtitle={t('schools_empty_sub')} />
          )}

          {!state.error && state.items && state.items.length > 0 && (
            <>
              <p className="mb-4 text-sm text-ink-400">{state.meta?.total ?? state.items.length} {t('schools_results')}</p>
              <div className="equal-grid-container">
                {state.items.map((school, index) => (
                  <div key={school.id} className="school-card-animate rounded-2xl" style={{ animationDelay: `${Math.min(index, 8) * 75}ms` }}>
                    <SchoolCard
                      school={school}
                      compareState={{
                        selected: typeof compare?.isSelected === 'function' ? compare.isSelected(school.id) : false,
                        toggle: compare?.toggle,
                        maxReached: compare?.maxReached,
                      }}
                    />
                  </div>
                ))}
              </div>
              <Pagination page={page} totalPages={state.meta?.totalPages} onChange={setPage} />
            </>
          )}
        </div>
      </div>

      {/* 🛠️ الكود المضاف لإظهار زرار بار المقارنة العائم في أسفل الصفحة تلقائياً عند تحديد مدرستين أو أكثر */}
      {compare?.list && compare.list.length >= 2 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-ink-900 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-6 animate-fade-in backdrop-blur-md bg-opacity-95 border border-ink-700">
          <div className="text-sm font-medium">
            {t('compare_selected_count', { count: compare.list.length })} {compare.list.length} {t('nav_compare')}
          </div>
          <button
            onClick={() => navigate('/compare')}
            className="bg-brand-500 hover:bg-brand-600 text-ink-950 font-bold text-xs px-5 py-2.5 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md"
          >
            {t('go_to_compare') || 'اذهب للمقارنة ←'}
          </button>
        </div>
      )}
    </div>
  );
}