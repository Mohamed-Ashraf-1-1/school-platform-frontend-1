import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiCalendar,
  FiClock,
  FiUsers,
  FiCheckCircle,
  FiFileText,
  FiEdit3,
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiYoutube,
  FiLinkedin,
  FiGlobe,
  FiMessageCircle,
  FiExternalLink,
  FiImage,
  FiMap, // تم إضافة أيقونة الخريطة للفروع
} from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { getSchoolBySlug, listSchools } from '../../services/schools.js';
import ScoreGauge from '../../components/common/ScoreGauge.jsx';
import Badge from '../../components/common/Badge.jsx';
import SchoolCard from '../../components/public/SchoolCard.jsx';
import Spinner from '../../components/common/Spinner.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import { genderLabel, durationLabel } from '../../utils/format.js';

const SOCIAL_ICONS = {
  FACEBOOK: FiFacebook,
  INSTAGRAM: FiInstagram,
  TWITTER: FiTwitter,
  YOUTUBE: FiYoutube,
  LINKEDIN: FiLinkedin,
  TIKTOK: FiGlobe,
  WEBSITE: FiGlobe,
  WHATSAPP: FiMessageCircle,
  OTHER: FiExternalLink,
};

// دالة معالجة وتنظيف الروابط الخارجية بشكل صارم لمنع التحويل الداخلي (404)
const formatExternalUrl = (url) => {
  if (!url) return '';
  
  // 1. تنظيف الرابط من المسافات وأي شرطات مائلة في البداية والنهاية
  let cleanedUrl = url.trim().replace(/^\/+/, '');
  
  // 2. التحقق إذا كان الرابط يبدأ بـ http:// أو https://
  if (/^https?:\/\//i.test(cleanedUrl)) {
    return cleanedUrl;
  }
  
  // 3. إذا كان الرابط يبدأ بـ // بعد التنظيف الأول
  if (cleanedUrl.startsWith('//')) {
    return `https:${cleanedUrl}`;
  }
  
  // 4. إجبار الرابط على البدء بـ https://
  return `https://${cleanedUrl}`;
};

export default function SchoolDetails() {
  const { slug } = useParams();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [state, setState] = useState({ school: null, error: null });
  const [related, setRelated] = useState([]);
  const [activeImage, setActiveImage] = useState(null);
  const [brokenUrls, setBrokenUrls] = useState(() => new Set());

  const markBroken = (url) => setBrokenUrls((prev) => new Set(prev).add(url));

  useEffect(() => {
    setState({ school: null, error: null });
    setRelated([]);
    setBrokenUrls(new Set());
    getSchoolBySlug(slug)
      .then((res) => {
        setState({ school: res.data, error: null });
        setActiveImage(res.data?.mainImage || res.data?.images?.[0]?.url || null);
      })
      .catch((err) => setState({ school: null, error: err.message }));
  }, [slug]);

  useEffect(() => {
    if (!state.school) return;
    listSchools({ governorate: state.school.governorate?.id, limit: 4 })
      .then((res) => setRelated((res.data || []).filter((s) => s.id !== state.school.id).slice(0, 3)))
      .catch(() => setRelated([]));
  }, [state.school]);

  if (state.error) {
    return (
      <div className="container-page py-16">
        <ErrorState message={state.error} onRetry={() => navigate(0)} />
      </div>
    );
  }

  if (!state.school) {
    return (
      <div className="container-page py-16">
        <Spinner />
      </div>
    );
  }

  const school = state.school;

  const geoRequirement = school.requirements?.find((r) => r.title === 'النطاق الجغرافي للقبول');
  const catchmentGovernorates = geoRequirement
    ? geoRequirement.description
        .replace('يتاح التقديم لطلاب المحافظات التالية:', '')
        .replace(/\.$/, '')
        .split('،')
        .map((g) => g.trim())
        .filter(Boolean)
    : [];

  const gallery = [school.mainImage, ...(school.images || []).map((i) => i.url)].filter(Boolean);
  const uniqueGallery = [...new Set(gallery)].filter((url) => !brokenUrls.has(url));
  const displayImage = activeImage && !brokenUrls.has(activeImage) ? activeImage : uniqueGallery[0] || null;

  return (
    <div className="container-page py-10 sm:py-14">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Link to="/schools" className="text-xs font-semibold text-ink-400 hover:text-ink-700">
            {t('nav_schools')} /
          </Link>
          <h1 className="font-display mt-2 text-2xl font-bold text-ink-900 sm:text-3xl">{school.name}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-ink-400">
            <span className="inline-flex items-center gap-1.5">
              <FiMapPin className="h-4 w-4" />
              {school.governorate?.name}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <FiClock className="h-4 w-4" />
              {durationLabel(school.studyDuration, lang)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <FiUsers className="h-4 w-4" />
              {genderLabel(school.gender, lang)}
            </span>
            {school.establishedYear && (
              <span className="inline-flex items-center gap-1.5">
                <FiCalendar className="h-4 w-4" />
                {school.establishedYear}
              </span>
            )}
          </div>

          {catchmentGovernorates.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-ink-400">النطاق الجغرافي للقبول:</span>
              {catchmentGovernorates.map((g) => (
                <Badge key={g} tone="teal">
                  {g}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-ink-100 bg-white px-5 py-3.5 shadow-card">
          <ScoreGauge score={school.minScore} size={56} />
          <div>
            <p className="text-xs font-medium text-ink-400">{t('min_score_label')}</p>
            <p className="font-display text-lg font-bold text-ink-900">{school.minScore ?? '—'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[2fr,1fr]">
        <div className="min-w-0">
          {/* Gallery */}
          {gallery.length > 0 && (
            <div className="mb-10">
              {displayImage ? (
                <div className="aspect-video overflow-hidden rounded-2xl bg-ink-100">
                  <img
                    src={displayImage}
                    alt={school.name}
                    className="h-full w-full object-cover"
                    onError={() => markBroken(displayImage)}
                  />
                </div>
              ) : (
                <div className="flex aspect-video flex-col items-center justify-center gap-2 rounded-2xl bg-ink-50 text-ink-300">
                  <FiImage className="h-8 w-8" />
                  <span className="text-xs font-medium">لا تتوفر صورة لهذه المدرسة حاليًا</span>
                </div>
              )}
              {uniqueGallery.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  {uniqueGallery.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(url)}
                      className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                        displayImage === url ? 'border-brass-400' : 'border-transparent opacity-70'
                      }`}
                    >
                      <img
                        src={url}
                        alt=""
                        className="h-full w-full object-cover"
                        onError={() => markBroken(url)}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* About */}
          {school.description && (
            <Section title={t('details_about')}>
              <p className="whitespace-pre-line text-sm leading-relaxed text-ink-600">{school.description}</p>
            </Section>
          )}

          {/* Specializations */}
          {school.specializations?.length > 0 && (
            <Section title={t('details_specializations')}>
              <div className="grid gap-4 sm:grid-cols-1">
                {school.specializations.map((s) => (
                  <div key={s.id || s.name} className="rounded-xl border border-ink-100 bg-white p-4 shadow-sm transition hover:shadow-md">
                    <div className="mb-2">
                      <Badge tone="teal">{s.name}</Badge>
                    </div>
                    {s.description && (
                      <p className="text-xs leading-relaxed text-ink-500 mt-1">{s.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Partners */}
          {school.partners?.length > 0 && (
            <Section title={t('details_partners')}>
              <div className="flex flex-wrap gap-3">
                {school.partners.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-2 rounded-xl border border-ink-100 bg-white px-3.5 py-2"
                  >
                    {p.logo ? (
                      <img src={p.logo} alt={p.name} className="h-6 w-6 rounded object-contain" />
                    ) : (
                      <span className="flex h-6 w-6 items-center justify-center rounded bg-ink-50 text-[10px] font-bold text-ink-500">
                        {p.name?.[0]}
                      </span>
                    )}
                    <span className="text-sm font-medium text-ink-700">{p.name}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Branches */}
          {school.branches?.length > 0 && (
            <Section title={t('details_branches')}>
              <div className="grid gap-3 sm:grid-cols-2">
                {school.branches.map((b) => (
                  <div key={b.id} className="flex flex-col justify-between rounded-xl border border-ink-100 bg-white p-4">
                    <div>
                      <p className="font-semibold text-ink-800">{b.name}</p>
                      {b.governorate?.name && (
                        <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-teal-600">
                          <FiMapPin className="h-3.5 w-3.5 shrink-0" />
                          {b.governorate.name}
                        </p>
                      )}
                      {b.address && (
                        <p className="mt-1 flex items-start gap-1.5 text-xs text-ink-400">
                          <FiMapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                          {b.address}
                        </p>
                      )}
                      {b.phone && (
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-400">
                          <FiPhone className="h-3.5 w-3.5 shrink-0" />
                          {b.phone}
                        </p>
                      )}
                    </div>
                    
                    {/* زر الخريطة المصلّح جذرياً باستخدام دالة التنظيف الصارمة */}
                    {b.mapUrl && (
                      <div className="mt-4 border-t border-ink-50 pt-3">
                        <a
                          href={formatExternalUrl(b.mapUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brass-600 hover:text-brass-700 transition"
                        >
                          <FiMap className="h-3.5 w-3.5" />
                          عرض موقع الفرع على الخريطة
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Requirements */}
          {school.requirements?.length > 0 && (
            <Section title={t('details_requirements')}>
              {(() => {
                const otherReqs = school.requirements.filter((r) => r.title !== 'النطاق الجغرافي للقبول');
                if (otherReqs.length === 0) return <p className="text-sm text-ink-400">—</p>;
                return (
                  <ul className="flex flex-col gap-3">
                    {otherReqs.map((r) => (
                      <li key={r.id} className="flex gap-2.5">
                        <FiCheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" />
                        <div>
                          <p className="text-sm font-semibold text-ink-800">{r.title}</p>
                          {r.description && <p className="text-sm text-ink-500">{r.description}</p>}
                        </div>
                      </li>
                    ))}
                  </ul>
                );
              })()}
            </Section>
          )}

          {/* Exams */}
          {school.exams?.length > 0 && (
            <Section title={t('details_exams')}>
              <ul className="flex flex-col gap-3">
                {school.exams.map((ex) => (
                  <li key={ex.id} className="flex gap-2.5">
                    <FiEdit3 className="mt-0.5 h-4 w-4 shrink-0 text-brass-500" />
                    <div>
                      <p className="text-sm font-semibold text-ink-800">{ex.name}</p>
                      {ex.description && <p className="text-sm text-ink-500">{ex.description}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* Documents */}
          {school.documents?.length > 0 && (
            <Section title={t('details_documents')}>
              <ul className="flex flex-col gap-3">
                {school.documents.map((d) => (
                  <li key={d.id} className="flex gap-2.5">
                    <FiFileText className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" />
                    <div>
                      <p className="text-sm font-semibold text-ink-800">{d.name}</p>
                      {d.description && <p className="text-sm text-ink-500">{d.description}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-5">
          <div className="card p-5">
            <h3 className="font-display mb-4 text-sm font-semibold text-ink-900">{t('details_contact')}</h3>
            <div className="flex flex-col gap-3 text-sm text-ink-600">
              {school.address && (
                <p className="flex items-start gap-2.5">
                  <FiMapPin className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" />
                  {school.address}
                </p>
              )}
              {school.phone && (
                <a href={`tel:${school.phone}`} className="flex items-center gap-2.5 hover:text-teal-600">
                  <FiPhone className="h-4 w-4 shrink-0 text-ink-400" />
                  {school.phone}
                </a>
              )}
              {school.email && (
                <a href={`mailto:${school.email}`} className="flex items-center gap-2.5 hover:text-teal-600">
                  <FiMail className="h-4 w-4 shrink-0 text-ink-400" />
                  {school.email}
                </a>
              )}
            </div>

            {school.socialMedia?.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2 border-t border-ink-100 pt-4">
                {school.socialMedia.map((sm) => {
                  const Icon = SOCIAL_ICONS[sm.platform] || FiExternalLink;
                  return (
                    <a
                      key={sm.id}
                      href={formatExternalUrl(sm.url)} // تم تطبيق الفلتر الصارم على روابط السوشيال ميديا أيضاً
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-50 text-ink-600 transition hover:bg-ink-900 hover:text-paper-50"
                      aria-label={sm.platform}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display mb-6 text-xl font-bold text-ink-900">{t('details_related')}</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((s) => (
              <SchoolCard key={s.id} school={s} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-10">
      <h2 className="font-display mb-4 text-lg font-semibold text-ink-900">{title}</h2>
      {children}
    </div>
  );
}