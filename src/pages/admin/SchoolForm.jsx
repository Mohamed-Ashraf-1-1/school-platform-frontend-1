import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { FiPlus, FiTrash2, FiSave, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
// 🛠️ تم جلب دالة getSchoolById بدلاً من slug لأن الروابط تعتمد على المعرف الرقمي
import { getSchoolById, createSchool, updateSchool } from '../../services/schools.js';
import { governoratesApi } from '../../services/governorates.js';
import { partnersApi } from '../../services/partners.js';
import { specializationsApi } from '../../services/specializations.js';
import PageHeader from '../../components/admin/PageHeader.jsx';
import FormField from '../../components/common/FormField.jsx';
import Spinner from '../../components/common/Spinner.jsx';
import { GENDERS, DURATIONS, SOCIAL_PLATFORMS, MAX_SCORE } from '../../utils/constants.js';
import { genderLabel, durationLabel } from '../../utils/format.js';

const emptyDefaults = {
  name: '',
  description: '',
  mainImage: '',
  gender: 'BOTH',
  studyDuration: 'THREE_YEARS',
  minScore: '',
  establishedYear: '',
  address: '',
  phone: '',
  email: '',
  governorateId: '',
  isActive: true,
  partnerIds: [],
  specializationIds: [],
  branches: [],
  requirements: [],
  exams: [],
  documents: [],
  images: [],
  socialMedia: [],
};

export default function SchoolForm() {
  // 🛠️ استقبال id بدلاً من slug ليتوافق مع هيكلة الروابط المتواجدة بالصورة والـ Router
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { t, lang, dir } = useLanguage();
  const toast = useToast();
  const BackArrow = dir === 'rtl' ? FiArrowRight : FiArrowLeft;

  const [governorates, setGovernorates] = useState([]);
  const [partners, setPartners] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [schoolId, setSchoolId] = useState(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: emptyDefaults });

  const branches = useFieldArray({ control, name: 'branches' });
  const requirements = useFieldArray({ control, name: 'requirements' });
  const exams = useFieldArray({ control, name: 'exams' });
  const documents = useFieldArray({ control, name: 'documents' });
  const images = useFieldArray({ control, name: 'images' });
  const socialMedia = useFieldArray({ control, name: 'socialMedia' });

  useEffect(() => {
    governoratesApi.list({ limit: 100 }).then((res) => setGovernorates(res.data || []));
    partnersApi.list({ limit: 100 }).then((res) => setPartners(res.data || []));
    specializationsApi.list({ limit: 100 }).then((res) => setSpecializations(res.data || []));
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    // 🛠️ جلب بيانات المدرسة الحالية عن طريق الـ id لتعرض داخل الـ inputs بنجاح
    getSchoolById(id)
      .then((res) => {
        const s = res.data;
        setSchoolId(s.id);
        reset({
          name: s.name || '',
          description: s.description || '',
          mainImage: s.mainImage || '',
          gender: s.gender || 'BOTH',
          studyDuration: s.studyDuration || 'THREE_YEARS',
          minScore: s.minScore ?? '',
          establishedYear: s.establishedYear ?? '',
          address: s.address || '',
          phone: s.phone || '',
          email: s.email || '',
          governorateId: s.governorateId || s.governorate?.id || '',
          isActive: s.isActive ?? true,
          partnerIds: (s.partners || []).map((p) => p.id),
          specializationIds: (s.specializations || []).map((sp) => sp.id),
          branches: (s.branches || []).map((b) => ({
            name: b.name || '',
            address: b.address || '',
            phone: b.phone || '',
            governorateId: b.governorateId || '',
          })),
          requirements: (s.requirements || []).map((r) => ({
            title: r.title || '',
            description: r.description || '',
          })),
          exams: (s.exams || []).map((e) => ({ name: e.name || '', description: e.description || '' })),
          documents: (s.documents || []).map((d) => ({ name: d.name || '', description: d.description || '' })),
          images: (s.images || []).map((i) => ({ url: i.url || '', caption: i.caption || '' })),
          socialMedia: (s.socialMedia || []).map((sm) => ({ platform: sm.platform, url: sm.url || '' })),
        });
      })
      .catch(() => toast.error(t('admin_toast_error')))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onSubmit = async (values) => {
    setSaving(true);
    try {
      const payload = {
        name: values.name,
        description: values.description || undefined,
        mainImage: values.mainImage || undefined,
        gender: values.gender,
        studyDuration: values.studyDuration,
        minScore: values.minScore === '' ? undefined : Number(values.minScore),
        establishedYear: values.establishedYear === '' ? undefined : Number(values.establishedYear),
        address: values.address || undefined,
        phone: values.phone || undefined,
        email: values.email || undefined,
        governorateId: Number(values.governorateId),
        isActive: values.isActive,
        partnerIds: values.partnerIds.map(Number),
        specializationIds: values.specializationIds.map(Number),
        branches: values.branches
          .filter((b) => b.name)
          .map((b) => ({
            name: b.name,
            address: b.address || undefined,
            phone: b.phone || undefined,
            governorateId: b.governorateId ? Number(b.governorateId) : undefined,
          })),
        requirements: values.requirements
          .filter((r) => r.title)
          .map((r) => ({ title: r.title, description: r.description || undefined })),
        exams: values.exams
          .filter((e) => e.name)
          .map((e) => ({ name: e.name, description: e.description || undefined })),
        documents: values.documents
          .filter((d) => d.name)
          .map((d) => ({ name: d.name, description: d.description || undefined })),
        images: values.images.filter((i) => i.url).map((i) => ({ url: i.url, caption: i.caption || undefined })),
        socialMedia: values.socialMedia
          .filter((sm) => sm.url)
          .map((sm) => ({ platform: sm.platform, url: sm.url })),
      };

      if (isEdit) {
        await updateSchool(schoolId, payload);
        toast.success(t('admin_toast_updated'));
      } else {
        await createSchool(payload);
        toast.success(t('admin_toast_created'));
      }
      // 🛠️ تعديل مسار العودة بعد الحفظ بنجاح ليطابق اللينك السري للوحة التحكم
      navigate('/secret-hub-portal-2026-x/schools');
    } catch (err) {
      toast.error(err.message || t('admin_toast_error'));
    } finally {
      setSaving(false);
    }
  };

  const genderOptions = useMemo(() => GENDERS.map((g) => ({ value: g, label: genderLabel(g, lang) })), [lang]);
  const durationOptions = useMemo(
    () => DURATIONS.map((d) => ({ value: d, label: durationLabel(d, lang) })),
    [lang]
  );

  if (loading) return <Spinner />;

  return (
    <div>
      {/* 🛠️ تعديل مسار زر العودة العلوي ليطابق اللينك السري للوحة التحكم */}
      <button
        onClick={() => navigate('/secret-hub-portal-2026-x/schools')}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-400 hover:text-ink-700"
      >
        <BackArrow className="h-4 w-4" />
        {t('admin_sidebar_schools')}
      </button>
      <PageHeader title={isEdit ? t('admin_edit') : t('admin_add_new')} subtitle={t('admin_sidebar_schools')} />

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Basic info */}
        <FormSection title={t('admin_school_form_basic')}>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label={t('field_name')} required error={errors.name && t('field_required')}>
              <input className="input" {...register('name', { required: true })} />
            </FormField>
            <FormField label={t('field_governorate')} required error={errors.governorateId && t('field_required')}>
              <select className="input" {...register('governorateId', { required: true })}>
                <option value="">{t('filters_all')}</option>
                {governorates.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label={t('field_gender')}>
              <select className="input" {...register('gender')}>
                {genderOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label={t('field_duration')}>
              <select className="input" {...register('studyDuration')}>
                {durationOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label={t('field_min_score')} hint={`0 - ${MAX_SCORE}`}>
              <input type="number" min="0" max={MAX_SCORE} step="0.5" className="input" {...register('minScore')} />
            </FormField>
            <FormField label={t('field_established_year')}>
              <input type="number" min="1950" max="2100" className="input" {...register('establishedYear')} />
            </FormField>
            <FormField label={t('field_phone')}>
              <input className="input" dir="ltr" {...register('phone')} />
            </FormField>
            <FormField
              label={t('field_email')}
              error={errors.email && t('field_invalid_email')}
            >
              <input
                type="email"
                dir="ltr"
                className="input"
                {...register('email', { pattern: /^\S+@\S+\.\S+$/ })}
              />
            </FormField>
            <FormField label={t('field_main_image')} hint="URL">
              <input className="input" dir="ltr" {...register('mainImage')} placeholder="https://..." />
            </FormField>
            <FormField label={t('field_address')}>
              <input className="input" {...register('address')} />
            </FormField>
          </div>
          <FormField label={t('field_description')}>
            <textarea rows={4} className="input resize-none" {...register('description')} />
          </FormField>
          <label className="flex items-center gap-2.5 text-sm font-medium text-ink-700">
            <input type="checkbox" className="h-4 w-4 rounded accent-brass-400" {...register('isActive')} />
            {t('field_active')}
          </label>
        </FormSection>

        {/* Relations */}
        <FormSection title={t('admin_school_form_relations')}>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="label">{t('details_specializations')}</label>
              <MultiCheckList name="specializationIds" control={control} options={specializations} />
            </div>
            <div>
              <label className="label">{t('details_partners')}</label>
              <MultiCheckList name="partnerIds" control={control} options={partners} />
            </div>
          </div>
        </FormSection>

        {/* Branches */}
        <RepeatableSection
          title={t('admin_school_form_branches')}
          fieldArray={branches}
          t={t}
          onAdd={() => branches.append({ name: '', address: '', phone: '', governorateId: '' })}
          renderRow={(field, index) => (
            <div className="grid flex-1 gap-2 sm:grid-cols-3">
              <input className="input" placeholder={t('field_name')} {...register(`branches.${index}.name`)} />
              <input className="input" placeholder={t('field_address')} {...register(`branches.${index}.address`)} />
              <input
                className="input"
                dir="ltr"
                placeholder={t('field_phone')}
                {...register(`branches.${index}.phone`)}
              />
            </div>
          )}
        />

        {/* Requirements */}
        <RepeatableSection
          title={t('admin_school_form_requirements')}
          fieldArray={requirements}
          t={t}
          onAdd={() => requirements.append({ title: '', description: '' })}
          renderRow={(field, index) => (
            <div className="grid flex-1 gap-2 sm:grid-cols-2">
              <input
                className="input"
                placeholder={t('field_name')}
                {...register(`requirements.${index}.title`)}
              />
              <input
                className="input"
                placeholder={t('field_description')}
                {...register(`requirements.${index}.description`)}
              />
            </div>
          )}
        />

        {/* Exams */}
        <RepeatableSection
          title={t('admin_school_form_exams')}
          fieldArray={exams}
          t={t}
          onAdd={() => exams.append({ name: '', description: '' })}
          renderRow={(field, index) => (
            <div className="grid flex-1 gap-2 sm:grid-cols-2">
              <input className="input" placeholder={t('field_name')} {...register(`exams.${index}.name`)} />
              <input
                className="input"
                placeholder={t('field_description')}
                {...register(`exams.${index}.description`)}
              />
            </div>
          )}
        />

        {/* Documents */}
        <RepeatableSection
          title={t('admin_school_form_documents')}
          fieldArray={documents}
          t={t}
          onAdd={() => documents.append({ name: '', description: '' })}
          renderRow={(field, index) => (
            <div className="grid flex-1 gap-2 sm:grid-cols-2">
              <input className="input" placeholder={t('field_name')} {...register(`documents.${index}.name`)} />
              <input
                className="input"
                placeholder={t('field_description')}
                {...register(`documents.${index}.description`)}
              />
            </div>
          )}
        />

        {/* Images */}
        <RepeatableSection
          title={t('admin_school_form_images')}
          fieldArray={images}
          t={t}
          onAdd={() => images.append({ url: '', caption: '' })}
          renderRow={(field, index) => (
            <div className="grid flex-1 gap-2 sm:grid-cols-2">
              <input
                className="input"
                dir="ltr"
                placeholder="https://..."
                {...register(`images.${index}.url`)}
              />
              <input
                className="input"
                placeholder={t('field_description')}
                {...register(`images.${index}.caption`)}
              />
            </div>
          )}
        />

        {/* Social media */}
        <RepeatableSection
          title={t('admin_school_form_social')}
          fieldArray={socialMedia}
          t={t}
          onAdd={() => socialMedia.append({ platform: 'WEBSITE', url: '' })}
          renderRow={(field, index) => (
            <div className="grid flex-1 gap-2 sm:grid-cols-[160px,1fr]">
              <select className="input" {...register(`socialMedia.${index}.platform`)}>
                {SOCIAL_PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <input
                className="input"
                dir="ltr"
                placeholder="https://..."
                {...register(`socialMedia.${index}.url`)}
              />
            </div>
          )}
        />

        {/* 🛠️ تعديل مسار زر الإلغاء السفلي ليطابق اللينك السري للوحة التحكم */}
        <div className="sticky bottom-4 flex justify-end gap-2 rounded-2xl border border-ink-100 bg-white/95 p-3 shadow-lifted backdrop-blur">
          <button type="button" className="btn-outline" onClick={() => navigate('/secret-hub-portal-2026-x/schools')}>
            {t('admin_cancel')}
          </button>
          <button type="submit" disabled={saving} className="btn-accent">
            <FiSave className="h-4 w-4" />
            {saving ? t('admin_saving') : t('admin_save')}
          </button>
        </div>
      </form>
    </div>
  );
}

function FormSection({ title, children }) {
  return (
    <div className="card p-5 sm:p-6">
      <h3 className="font-display mb-4 text-base font-semibold text-ink-900">{title}</h3>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

function RepeatableSection({ title, fieldArray, renderRow, onAdd, t }) {
  return (
    <div className="card p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-base font-semibold text-ink-900">{title}</h3>
        <button type="button" onClick={onAdd} className="btn-outline !px-3 !py-1.5 text-xs">
          <FiPlus className="h-3.5 w-3.5" />
          {t('admin_school_form_add_row')}
        </button>
      </div>
      <div className="flex flex-col gap-3">
        {fieldArray.fields.map((field, index) => (
          <div key={field.id} className="flex items-start gap-2">
            {renderRow(field, index)}
            <button
              type="button"
              onClick={() => fieldArray.remove(index)}
              className="mt-1.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-clay-500 hover:bg-clay-50"
              aria-label={t('admin_school_form_remove_row')}
            >
              <FiTrash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        {fieldArray.fields.length === 0 && <p className="text-sm text-ink-400">—</p>}
      </div>
    </div>
  );
}

/** Checkbox list bound to an array field (specializationIds / partnerIds) via react-hook-form's Controller. */
function MultiCheckList({ name, control, options }) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="max-h-52 overflow-y-auto rounded-xl border border-ink-200 p-3">
          {options.length === 0 && <p className="text-sm text-ink-400">—</p>}
          <div className="flex flex-col gap-2">
            {options.map((opt) => {
              const checked = field.value?.includes(opt.id);
              return (
                <label key={opt.id} className="flex items-center gap-2.5 text-sm text-ink-700">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded accent-brass-400"
                    checked={checked}
                    onChange={(e) => {
                      const next = e.target.checked
                        ? [...(field.value || []), opt.id]
                        : (field.value || []).filter((v) => v !== opt.id);
                      field.onChange(next);
                    }}
                  />
                  {opt.name}
                </label>
              );
            })}
          </div>
        </div>
      )}
    />
  );
}