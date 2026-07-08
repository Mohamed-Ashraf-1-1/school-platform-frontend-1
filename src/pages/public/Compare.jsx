import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiX, FiSearch, FiMapPin, FiInfo, FiArrowLeft } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useCompareList } from '../../hooks/useCompareList.js';
import { compareSchools, listSchools } from '../../services/schools.js';
import { useDebounce } from '../../hooks/useDebounce.js';
import ScoreGauge from '../../components/common/ScoreGauge.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import Spinner from '../../components/common/Spinner.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import { genderLabel, durationLabel } from '../../utils/format.js';

export default function Compare() {
  const { t, lang } = useLanguage();
  const compare = useCompareList();
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 350);
  const [results, setResults] = useState([]);
  const [picking, setPicking] = useState(false);

  useEffect(() => {
    if (compare.ids.length < 2) {
      setSchools([]);
      return;
    }
    setLoading(true);
    setError(null);
    compareSchools(compare.ids)
      .then((res) => setSchools(res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [compare.ids]);

  useEffect(() => {
    const searchParams = debouncedQuery 
      ? { search: debouncedQuery, limit: 100 } 
      : { limit: 100 };
    
    listSchools(searchParams)
      .then((res) => {
        setResults((res.data || []).filter((s) => !compare.ids.includes(s.id)));
      })
      .catch(() => setResults([]));
  }, [debouncedQuery, compare.ids]);

  // مصفوفة الخصائص لتسهيل عرضها في الجدول والأنماط البديلة
  const rows = [
    { key: 'governorate', label: t('filters_governorate'), render: (s) => s.governorate?.name },
    { key: 'minScore', label: t('min_score_label'), render: (s) => <ScoreGauge score={s.minScore} size={44} /> },
    { key: 'gender', label: t('details_gender'), render: (s) => genderLabel(s.gender, lang) },
    { key: 'duration', label: t('details_duration'), render: (s) => durationLabel(s.studyDuration, lang) },
    { key: 'established', label: t('details_established'), render: (s) => s.establishedYear || '—' },
    {
      key: 'specializations',
      label: t('details_specializations'),
      render: (s) => s.specializations?.map((x) => x.name).join('، ') || '—',
    },
    {
      key: 'partners',
      label: t('details_partners'),
      render: (s) => s.partners?.map((x) => x.name).join('، ') || '—',
    },
    { key: 'address', label: t('field_address'), render: (s) => s.address || '—' },
    { key: 'phone', label: t('field_phone'), render: (s) => s.phone || '—' },
  ];

  return (
    <div className="container-page py-6 sm:py-14 px-4 sm:px-6 relative">
      
      {/* رأس الصفحة والهيدر المتجاوب */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="eyebrow text-blue-600 font-medium tracking-wide">{t('nav_compare')}</span>
          <h1 className="font-display mt-1 text-2xl font-bold text-ink-900 sm:text-3xl tracking-tight">{t('compare_title')}</h1>
          <p className="mt-1.5 text-sm text-ink-400">{t('compare_subtitle')}</p>
        </div>

        {compare.ids.length < 4 && (
          <div className="relative w-full md:w-80">
            <FiSearch className="pointer-events-none absolute top-1/2 -translate-y-1/2 start-3.5 h-4 w-4 text-ink-300" />
            <input
              className="input !ps-10 w-full rounded-xl border border-slate-200 bg-white py-2.5 text-sm outline-none focus:border-blue-600 transition-all"
              placeholder="اضغط هنا لاختيار مدرسة مباشرة..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setPicking(true)}
              onBlur={() => setTimeout(() => setPicking(false), 250)}
            />
            {picking && results.length > 0 && (
              <div className="absolute z-30 mt-1.5 max-h-60 w-full overflow-y-auto rounded-xl border border-slate-100 bg-white shadow-xl">
                {results.map((s) => (
                  <button
                    key={s.id}
                    onMouseDown={() => {
                      compare.toggle(s.id);
                      setQuery('');
                    }}
                    className="flex w-full items-center gap-2.5 px-4 py-3 text-start text-sm hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                  >
                    <FiMapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <div className="flex flex-col">
                      <span className="font-medium text-ink-800 text-xs sm:text-sm">{s.name}</span>
                      <span className="text-slate-400 text-xs">{s.governorate?.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 1. حالة عدم اختيار أي مدرسة نهائياً */}
      {compare.ids.length === 0 && (
        <EmptyState
          title="أضف مدارس من صفحة المدارس ثم عُد إلى صفحة المقارنة لبدء المقارنة"
          action={
            <Link to="/schools" className="btn-primary bg-[#111e38] hover:bg-[#1d2d4f] text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all">
              {t('nav_schools')}
            </Link>
          }
        />
      )}

      {/* 2. حالة اختيار مدرسة واحدة فقط */}
      {compare.ids.length === 1 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white py-12 px-4 text-center shadow-sm max-w-2xl mx-auto my-6">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-[#2563eb] animate-pulse">
            <FiInfo className="h-7 w-7" />
          </div>
          <h3 className="font-display text-lg sm:text-xl font-bold text-ink-900 px-2">
            يلزم اختيار مدرستين على الأقل للمقارنة
          </h3>
          <p className="mt-2.5 max-w-md text-xs sm:text-sm text-ink-400 leading-relaxed">
            لقد قمت باختيار مدرسة واحدة فقط حتى الآن. يرجى التوجه لصفحة المدارس وإضافة مدرسة أخرى عبر الضغط على زر المقارنة، وبعد الاختيار عُد هنا لبدء المقارنة الفورية.
          </p>
          <Link 
            to="/schools" 
            className="mt-6 inline-flex items-center gap-2 bg-[#111e38] hover:bg-[#1d2d4f] text-white font-medium py-3 px-6 rounded-xl text-xs sm:text-sm transition-all shadow-sm"
          >
            <span>الانتقال إلى دليل المدارس لإضافة مدرسة</span>
            <FiArrowLeft className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>
      )}

      {error && compare.ids.length >= 2 && <ErrorState message={error} />}
      {loading && <Spinner />}

      {/* 3. عرض المقارنة بشكل متجاوب بالكامل ذكي */}
      {!loading && !error && compare.ids.length >= 2 && schools.length > 0 && (
        <>
          {/* أ) العرض على الموبايل والتابلت (شاشات أقل من lg): كروت عمودية أنيقة */}
          <div className="block lg:hidden space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {schools.map((s) => (
                <div key={s.id} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm relative flex flex-col justify-between">
                  
                  {/* زر الإزالة الصغير */}
                  <button
                    onClick={() => compare.remove(s.id)}
                    className="absolute top-3 end-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors shadow-sm"
                  >
                    <FiX className="h-4 w-4" />
                  </button>

                  {/* الجزء العلوي للكارت */}
                  <div>
                    <div className="mb-3 aspect-video overflow-hidden rounded-xl bg-slate-100">
                      {s.mainImage && (
                        <img src={s.mainImage} alt={s.name} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <Link
                      to={`/schools/${s.slug}`}
                      className="font-display block text-base font-bold text-[#111e38] hover:text-[#2563eb] mb-4 transition-colors"
                    >
                      {s.name}
                    </Link>

                    {/* قائمة الخصائص المفصلة داخل الكارت */}
                    <div className="space-y-3 border-t border-slate-50 pt-3">
                      {rows.map((row) => (
                        <div key={row.key} className="flex flex-col gap-0.5 pb-2.5 border-b border-slate-50/50 last:border-0 last:pb-0">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{row.label}</span>
                          <div className="text-sm font-medium text-ink-800 mt-0.5">
                            {row.render(s)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ب) العرض على أجهزة الكمبيوتر (شاشات lg فما فوق): جدول أفقي تقليدي ممتاز */}
          <div className="hidden lg:block overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
            <table className="w-full min-w-[768px] border-collapse text-start">
              <thead>
                <tr className="bg-slate-50/70">
                  <th className="w-56 p-4 border-b border-slate-100"></th>
                  {schools.map((s) => (
                    <th key={s.id} className="p-4 align-top border-b border-slate-100 min-w-[200px]">
                      <div className="relative p-2 bg-white rounded-xl border border-slate-100/70 shadow-2xs">
                        <button
                          onClick={() => compare.remove(s.id)}
                          aria-label={t('compare_remove')}
                          className="absolute -top-1.5 -end-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors shadow-xs"
                        >
                          <FiX className="h-3.5 w-3.5" />
                        </button>
                        <div className="mb-2 aspect-video overflow-hidden rounded-lg bg-slate-50">
                          {s.mainImage && (
                            <img src={s.mainImage} alt={s.name} className="h-full w-full object-cover" />
                          )}
                        </div>
                        <Link
                          to={`/schools/${s.slug}`}
                          className="font-display block text-sm font-bold text-[#111e38] hover:text-[#2563eb] transition-colors line-clamp-2"
                        >
                          {s.name}
                        </Link>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={row.key} className="hover:bg-slate-50/40 transition-colors">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-slate-500 border-b border-slate-100 bg-slate-50/20">
                      {row.label}
                    </td>
                    {schools.map((s) => (
                      <td key={s.id} className="px-6 py-4 text-sm font-medium text-ink-700 border-b border-slate-100">
                        {row.render(s)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}