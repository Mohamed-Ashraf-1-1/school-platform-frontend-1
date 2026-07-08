import { Link } from 'react-router-dom';
import { FiMapPin, FiPlus, FiCheck } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext.jsx';
import ScoreGauge from '../common/ScoreGauge.jsx';
import Badge from '../common/Badge.jsx';
import { genderLabel, durationLabel } from '../../utils/format.js';

export default function SchoolCard({ school, compareState }) {
  const { t, lang } = useLanguage();
  const specs = school.specializations || [];

  // 1. حماية وتأمين مسار الروابط بجعلها مسارات مطلقة واختيار الـ slug أو الـ id كبديل
  const schoolSlug = school.slug || school.id;
  const schoolLink = `/schools/${schoolSlug}`;

  return (
    <div className="group card flex h-full flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-lifted">
      {/* 2. إضافة relative="path" تضمن حل مشكلة التضارب الناتجة عن الـ Splat routes في React Router */}
      <Link to={schoolLink} relative="path" className="relative block aspect-[4/3] overflow-hidden bg-ink-100">
        {school.mainImage ? (
          <img
            src={school.mainImage}
            alt={school.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            onError={(e) => {
              // 3. تعديل معالجة الخطأ لمنع الاختفاء المفاجئ للصورة بره في حالة الروابط النسبية الخاطئة
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-3xl font-bold text-ink-200">
            {school.name?.[0]}
          </div>
        )}
        <div className="absolute top-3 end-3 rounded-full bg-white/95 p-1 shadow-soft">
          <ScoreGauge score={school.minScore} size={44} />
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-1.5 text-xs font-medium text-ink-400">
          <FiMapPin className="h-3.5 w-3.5" />
          {school.governorate?.name}
        </div>

        <Link to={schoolLink} relative="path">
          <h3 className="mt-1.5 font-display text-lg font-semibold text-ink-900 transition group-hover:text-teal-600">
            {school.name}
          </h3>
        </Link>

        {specs.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {specs.slice(0, 2).map((s) => (
              <Badge key={s.id} tone="teal">
                {s.name}
              </Badge>
            ))}
            {specs.length > 2 && <Badge tone="ink">+{specs.length - 2}</Badge>}
          </div>
        )}

        <div className="mt-4 flex items-center gap-3 border-t border-ink-100 pt-4 text-xs text-ink-500">
          <span>{genderLabel(school.gender, lang)}</span>
          <span className="text-ink-200">•</span>
          <span>{durationLabel(school.studyDuration, lang)}</span>
        </div>

        {/* mt-auto يدفع الأزرار لأسفل الكارت دايمًا سواء المحتوى فوق طويل أو قصير،
            وده اللي بيخلي كل الكروت متساوية الشكل جوه الجريد */}
        <div className="mt-auto flex flex-col gap-2 pt-4">
          <Link to={schoolLink} relative="path" className="btn-primary w-full !py-2 text-center text-xs">
            {t('view_details')}
          </Link>

          {compareState && (
            <button
              onClick={() => compareState.toggle(school.id)}
              aria-label={compareState.selected ? t('remove_from_compare') : t('add_to_compare')}
              disabled={!compareState.selected && compareState.maxReached}
              className={`flex w-full items-center justify-center gap-1.5 rounded-full border py-2 text-xs font-medium transition ${
                compareState.selected
                  ? 'border-teal-500 bg-teal-500 text-white hover:bg-teal-600'
                  : 'border-ink-200 text-ink-600 hover:border-teal-400 hover:text-teal-600 disabled:cursor-not-allowed disabled:opacity-40'
              }`}
            >
              {compareState.selected ? (
                <>
                  <FiCheck className="h-4 w-4" />
                  {t('remove_from_compare')}
                </>
              ) : (
                <>
                  <FiPlus className="h-4 w-4" />
                  {t('add_to_compare')}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
