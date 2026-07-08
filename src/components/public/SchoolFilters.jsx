import { useEffect, useState } from 'react';
import { FiFilter, FiX, FiSearch, FiMapPin, FiBookOpen, FiSliders, FiUsers, FiClock, FiRotateCcw } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { governoratesApi } from '../../services/governorates.js';
import { specializationsApi } from '../../services/specializations.js';
import { MAX_SCORE } from '../../utils/constants.js';

const emptyFilters = {
  search: '',
  governorate: '',
  specialization: '',
  minScore: '',
  maxScore: '',
  studyDuration: '',
  gender: '',
};

export default function SchoolFilters({ filters, onChange, onReset }) {
  const { t } = useLanguage();
  const [governorates, setGovernorates] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    governoratesApi
      .list({ limit: 100 })
      .then((res) => setGovernorates(res.data || []))
      .catch(() => {});
    specializationsApi
      .list({ limit: 100 })
      .then((res) => setSpecializations(res.data || []))
      .catch(() => {});
  }, []);

  const update = (key, value) => onChange({ ...filters, [key]: value });

  // عدد الفلاتر الفعّالة حاليًا (تحسين بصري فقط، مايأثرش على أي منطق)
  const activeCount = Object.entries(filters).filter(([, v]) => v !== '' && v !== null && v !== undefined).length;

  const fieldLabelClass = 'label mb-1.5 flex items-center gap-1.5 text-ink-600';

  const Content = (
    <div className="flex flex-col gap-5">
      <div>
        <label className={fieldLabelClass}>
          <FiSearch className="h-3.5 w-3.5 text-teal-600" />
          {t('filters_search')}
        </label>
        <input
          className="input"
          value={filters.search}
          onChange={(e) => update('search', e.target.value)}
          placeholder={t('hero_search_placeholder')}
          maxLength={100}
          autoComplete="off"
        />
      </div>

      <div>
        <label className={fieldLabelClass}>
          <FiMapPin className="h-3.5 w-3.5 text-teal-600" />
          {t('filters_governorate')}
        </label>
        <select className="input" value={filters.governorate} onChange={(e) => update('governorate', e.target.value)}>
          <option value="">{t('filters_all')}</option>
          {governorates.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={fieldLabelClass}>
          <FiBookOpen className="h-3.5 w-3.5 text-teal-600" />
          {t('filters_specialization')}
        </label>
        <select
          className="input"
          value={filters.specialization}
          onChange={(e) => update('specialization', e.target.value)}
        >
          <option value="">{t('filters_all')}</option>
          {specializations.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={fieldLabelClass}>
          <FiSliders className="h-3.5 w-3.5 text-teal-600" />
          {t('filters_min_score')} / {t('filters_max_score')}
        </label>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            min="0"
            max={MAX_SCORE}
            className="input"
            placeholder={t('filters_min_score')}
            value={filters.minScore}
            onChange={(e) => update('minScore', e.target.value)}
          />
          <input
            type="number"
            min="0"
            max={MAX_SCORE}
            className="input"
            placeholder={t('filters_max_score')}
            value={filters.maxScore}
            onChange={(e) => update('maxScore', e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className={fieldLabelClass}>
          <FiClock className="h-3.5 w-3.5 text-teal-600" />
          {t('filters_duration')}
        </label>
        <select
          className="input"
          value={filters.studyDuration}
          onChange={(e) => update('studyDuration', e.target.value)}
        >
          <option value="">{t('filters_all')}</option>
          <option value="THREE_YEARS">{t('duration_three')}</option>
          <option value="FIVE_YEARS">{t('duration_five')}</option>
        </select>
      </div>

      <div>
        <label className={fieldLabelClass}>
          <FiUsers className="h-3.5 w-3.5 text-teal-600" />
          {t('filters_gender')}
        </label>
        <select className="input" value={filters.gender} onChange={(e) => update('gender', e.target.value)}>
          <option value="">{t('filters_all')}</option>
          <option value="BOYS">{t('gender_boys')}</option>
          <option value="GIRLS">{t('gender_girls')}</option>
          <option value="BOTH">{t('gender_both')}</option>
        </select>
      </div>

      <button
        className="btn-outline flex w-full items-center justify-center gap-2 hover:border-red-300 hover:bg-red-50 hover:text-red-600"
        onClick={onReset}
      >
        <FiRotateCcw className="h-3.5 w-3.5" />
        {t('filters_reset')}
      </button>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="btn-outline relative mb-4 inline-flex w-full items-center justify-center gap-2 lg:hidden"
      >
        <FiFilter className="h-4 w-4" />
        {t('filters_title')}
        {activeCount > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-teal-500 px-1.5 text-[11px] font-semibold text-white">
            {activeCount}
          </span>
        )}
      </button>

      <aside className="hidden lg:block">
        <div className="card sticky top-24 overflow-hidden rounded-2xl p-5 shadow-soft ring-1 ring-ink-100">
          <div className="mb-4 flex items-center justify-between border-b border-ink-100 pb-3">
            <h2 className="font-display flex items-center gap-2 text-base font-semibold text-ink-900">
              <FiFilter className="h-4 w-4 text-teal-600" />
              {t('filters_title')}
            </h2>
            {activeCount > 0 && (
              <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-semibold text-teal-700">
                {activeCount}
              </span>
            )}
          </div>
          {Content}
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-[95] lg:hidden">
          <div
            className="absolute inset-0 bg-ink-900/50 backdrop-blur-[2px] transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 start-0 flex w-[85%] max-w-sm animate-fadeIn flex-col overflow-y-auto bg-white p-5 shadow-lifted">
            <div className="mb-4 flex items-center justify-between border-b border-ink-100 pb-3">
              <h2 className="font-display flex items-center gap-2 text-base font-semibold text-ink-900">
                <FiFilter className="h-4 w-4 text-teal-600" />
                {t('filters_title')}
              </h2>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label={t('close')}
                className="rounded-full p-1.5 text-ink-500 transition hover:bg-ink-100"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            {Content}
          </div>
        </div>
      )}
    </>
  );
}

export { emptyFilters };
