import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { listSchools } from '../../services/schools.js';
import { useDebounce } from '../../hooks/useDebounce.js';
import { useCompareList } from '../../hooks/useCompareList.js';
import SchoolFilters, { emptyFilters } from '../../components/public/SchoolFilters.jsx';
import SchoolCard from '../../components/public/SchoolCard.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import Spinner from '../../components/common/Spinner.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import { PAGE_SIZE } from '../../utils/constants.js';

// --- Security helper ---
function sanitizeSearchInput(value) {
  if (!value) return '';
  return value
    .replace(/<[^>]*>?/g, '') // strip HTML/script tags
    .replace(/[<>"'`;(){}[\]\\]/g, '') // strip characters used in XSS/SQL injection
    .slice(0, 100); // hard cap length
}

export default function Schools() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const compare = useCompareList();

  // جلب الكلمة مباشرة من الرابط بشكل آمن
  const searchParamValue = searchParams.get('search') || '';

  // --- States ---
  const [filters, setFilters] = useState({
    ...emptyFilters,
    search: searchParamValue,
    specialization: searchParams.get('specialization') || '',
    governorate: searchParams.get('governorate') || '',
  });
  const [page, setPage] = useState(1);
  const [state, setState] = useState({ items: null, meta: null, error: null });

  const debouncedSearch = useDebounce(filters.search, 400);
  const safeSearch = sanitizeSearchInput(debouncedSearch);

  // 🌟 تحديث الفلتر فوراً إذا تغير نص البحث في الـ URL فوق (من الهيدر أو الصفحة الرئيسية)
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      search: searchParamValue
    }));
  }, [searchParamValue]);

  // --- حساب عدد المدارس المختارة للمقارنة ---
  let selectedCount = 0;
  if (compare) {
    if (Array.isArray(compare.ids)) {
      selectedCount = compare.ids.length;
    } else if (Array.isArray(compare)) {
      selectedCount = compare.length;
    } else if (typeof compare === 'object') {
      const fallbackList = compare.list || compare.items || compare.schools || compare.selectedSchools;
      if (Array.isArray(fallbackList)) {
        selectedCount = fallbackList.length;
      } else if (state.items && typeof compare.isSelected === 'function') {
        selectedCount = state.items.filter(school => compare.isSelected(school.id)).length;
      }
    }
  }

  // --- Effects ---
  useEffect(() => {
    setPage(1);
  }, [
    debouncedSearch,
    filters.governorate,
    filters.specialization,
    filters.minScore,
    filters.maxScore,
    filters.studyDuration,
    filters.gender,
  ]);

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
      governorate: filters.governorate,
      specialization: filters.specialization,
      minScore: filters.minScore,
      maxScore: filters.maxScore,
      studyDuration: filters.studyDuration,
      gender: filters.gender,
    })
      .then((res) => {
        if (cancelled) return;
        setState({ items: res.data || [], meta: res.meta || null, error: null });
      })
      .catch((err) => {
        if (cancelled) return;
        setState({ items: null, meta: null, error: err.message });
      });
    return () => {
      cancelled = true;
    };
  }, [
    page,
    safeSearch,
    filters.governorate,
    filters.specialization,
    filters.minScore,
    filters.maxScore,
    filters.studyDuration,
    filters.gender,
  ]);

  const resetFilters = () => setFilters(emptyFilters);

  return (
    <div className="container-page py-10 sm:py-14 relative">
      <style>{`
        @keyframes schoolCardFadeInUp {
          0% { opacity: 0; transform: translateY(40px) scale(0.95); filter: blur(4px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        @keyframes compareBtnSidePop {
          0% { opacity: 0; transform: translateY(20px) scale(0.9); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .equal-grid-container {
          display: grid;
          grid-template-columns: repeat(1, minmax(0, 1fr));
          gap: 1.5rem;
          align-items: stretch;
        }
        @media (min-width: 640px) {
          .equal-grid-container { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (min-width: 1280px) {
          .equal-grid-container { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        }
        .school-card-animate {
          opacity: 0;
          animation: schoolCardFadeInUp 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.4s cubic-bezier(0.25, 1, 0.5, 1);
          will-change: transform, box-shadow;
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .school-card-animate:hover {
          transform: translateY(-8px) scale(1.015);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          z-index: 10;
        }
        .school-card-animate > * {
          display: flex !important;
          flex-direction: column !important;
          height: 100% !important;
          flex: 1 1 auto !important;
          justify-content: space-between !important;
        }
        .compare-side-btn {
          animation: compareBtnSidePop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          box-shadow: 0 15px 30px -5px rgba(17, 30, 56, 0.3);
        }
      `}</style>

      <div className="mb-8">
        <span className="eyebrow">{t('nav_schools')}</span>
        <h1 className="font-display mt-2 text-2xl font-bold text-ink-900 sm:text-3xl">
          {t('schools_page_title')}
        </h1>
        <p className="mt-1.5 text-sm text-ink-400">{t('schools_page_sub')}</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px,1fr]">
        <SchoolFilters filters={filters} onChange={setFilters} onReset={resetFilters} />

        <div>
          {state.error && <ErrorState message={state.error} />}

          {!state.error && state.items === null && <Spinner />}

          {!state.error && state.items && state.items.length === 0 && (
            <EmptyState title={t('schools_empty_title')} subtitle={t('schools_empty_sub')} />
          )}

          {!state.error && state.items && state.items.length > 0 && (
            <>
              <p className="mb-4 text-sm text-ink-400">
                {state.meta?.total ?? state.items.length} {t('schools_results')}
              </p>
              
              <div className="equal-grid-container">
                {state.items.map((school, index) => (
                  <div
                    key={school.id}
                    className="school-card-animate rounded-2xl"
                    style={{ animationDelay: `${Math.min(index, 8) * 75}ms` }}
                  >
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

      {selectedCount >= 2 && (
        <div className="fixed bottom-6 right-6 z-50 rtl:right-auto rtl:left-6 max-w-xs px-2">
          <button
            onClick={() => navigate('/compare')}
            className="compare-side-btn flex items-center gap-3 bg-[#111e38] hover:bg-[#1d2d4f] text-white font-medium py-3 px-5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 text-sm sm:text-base border border-slate-700/30"
          >
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-5 h-5 text-slate-200">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
              </svg>
              <span>اذهب للمقارنة</span>
            </div>
            <span className="flex items-center justify-center bg-[#2563eb] text-white text-xs font-bold w-6 h-6 rounded-full shadow-sm">
              {selectedCount}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}