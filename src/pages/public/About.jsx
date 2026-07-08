import { FiTarget, FiRefreshCw, FiUsers } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function About() {
  const { t } = useLanguage();

  const points = [
    { icon: FiTarget, title: t('nav_schools'), desc: "منصة مستقلة تجمع بيانات كل مدارس التكنولوجيا التطبيقية في مصر، لمساعدة الطلاب وأولياء الأمور على اتخاذ قرار مبني على معلومات دقيقة ومقارنة واضحة." },
    { icon: FiRefreshCw, title: t('footer_quick_links'), desc: "نعمل على تحديث البيانات باستمرار بالتعاون مع المدارس والشركاء الصناعيين لضمان دقة كل تفصيلة، من شروط القبول إلى التخصصات المتاحة." },
  ];

  return (
    <div className="container-page py-14 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <span className="eyebrow justify-center">{t('nav_about')}</span>
        
        {/* تم حذف وسم العنوان h1 من هنا بناءً على طلبك */}
        
        <p className="mt-5 text-base leading-relaxed text-ink-500">
          دليل التكنولوجيا التطبيقية منصة مستقلة تجمع بيانات كل مدارس التكنولوجيا التطبيقية في مصر، لمساعدة الطلاب وأولياء الأمور على اتخاذ قرار مبني على معلومات دقيقة ومقارنة واضحة.
        </p>
        <p className="mt-4 text-base leading-relaxed text-ink-500">
          نعمل على تحديث البيانات باستمرار بالتعاون مع المدارس والشركاء الصناعيين لضمان دقة كل تفصيلة، من شروط القبول إلى التخصصات المتاحة.
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-3xl gap-5 sm:grid-cols-2">
        {points.map((p, i) => (
          <div key={i} className="card p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-50 text-teal-600">
              <p.icon className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink-600">{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-10 flex max-w-3xl items-center gap-4 rounded-2xl border border-ink-100 bg-white p-6">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brass-50 text-brass-600">
          <FiUsers className="h-5 w-5" />
        </div>
        <p className="text-sm text-ink-500">
          نعمل على تحديث البيانات باستمرار بالتعاون مع المدارس والشركاء الصناعيين لضمان دقة كل تفصيلة، من شروط القبول إلى التخصصات المتاحة.
        </p>
      </div>
    </div>
  );
}