import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { FiImage, FiPlus, FiTrash2, FiSave, FiInfo } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { listSchools, getSchoolBySlug, updateSchool } from '../../services/schools.js';
import PageHeader from '../../components/admin/PageHeader.jsx';
import FormField from '../../components/common/FormField.jsx';
import Spinner from '../../components/common/Spinner.jsx';

export default function MediaManager() {
  const { t } = useLanguage();
  const toast = useToast();
  const [schools, setSchools] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState('');
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const { register, control, handleSubmit, reset } = useForm({
    defaultValues: { mainImage: '', images: [] },
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'images' });

  useEffect(() => {
    listSchools({ limit: 100, sortBy: 'name', sortOrder: 'asc' })
      .then((res) => setSchools(res.data || []))
      .catch(() => setSchools([]));
  }, []);

  useEffect(() => {
    if (!selectedSlug) {
      setSchool(null);
      return;
    }
    setLoading(true);
    getSchoolBySlug(selectedSlug)
      .then((res) => {
        setSchool(res.data);
        reset({
          mainImage: res.data.mainImage || '',
          images: (res.data.images || []).map((img) => ({ url: img.url, caption: img.caption || '' })),
        });
      })
      .catch(() => toast.error(t('admin_toast_error')))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSlug]);

  const onSubmit = async (values) => {
    if (!school) return;
    setSaving(true);
    try {
      await updateSchool(school.id, {
        mainImage: values.mainImage || undefined,
        images: values.images
          .filter((i) => i.url)
          .map((i) => ({ url: i.url, caption: i.caption || undefined })),
      });
      toast.success(t('admin_toast_updated'));
    } catch (err) {
      toast.error(err.message || t('admin_toast_error'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader title={t('admin_media_title')} subtitle={t('admin_media_sub')} />

      <div className="mb-6 flex items-start gap-3 rounded-xl border border-brass-100 bg-brass-50/60 p-4 text-sm text-ink-600">
        <FiInfo className="mt-0.5 h-4 w-4 shrink-0 text-brass-600" />
        <p>{t('admin_media_sub')}</p>
      </div>

      <div className="card mb-6 p-5">
        <label className="label">{t('admin_sidebar_schools')}</label>
        <select className="input max-w-md" value={selectedSlug} onChange={(e) => setSelectedSlug(e.target.value)}>
          <option value="">{t('compare_pick')}</option>
          {schools.map((s) => (
            <option key={s.id} value={s.slug}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {loading && <Spinner />}

      {!loading && school && (
        <form onSubmit={handleSubmit(onSubmit)} className="card flex flex-col gap-5 p-5">
          <FormField label={t('field_main_image')}>
            <input className="input" {...register('mainImage')} placeholder="https://..." />
          </FormField>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <label className="label !mb-0">{t('details_gallery')}</label>
              <button
                type="button"
                onClick={() => append({ url: '', caption: '' })}
                className="btn-outline !px-3 !py-1.5 text-xs"
              >
                <FiPlus className="h-3.5 w-3.5" />
                {t('admin_school_form_add_row')}
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-2 rounded-xl border border-ink-100 p-3">
                  <FiImage className="mt-2.5 h-4 w-4 shrink-0 text-ink-300" />
                  <div className="grid flex-1 gap-2 sm:grid-cols-2">
                    <input
                      className="input"
                      placeholder="https://..."
                      {...register(`images.${index}.url`)}
                    />
                    <input
                      className="input"
                      placeholder={t('field_description')}
                      {...register(`images.${index}.caption`)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="mt-1.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-clay-500 hover:bg-clay-50"
                  >
                    <FiTrash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              {fields.length === 0 && <p className="text-sm text-ink-400">—</p>}
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={saving} className="btn-accent">
              <FiSave className="h-4 w-4" />
              {saving ? t('admin_saving') : t('admin_save')}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
