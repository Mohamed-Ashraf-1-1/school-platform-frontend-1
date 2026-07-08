import { useForm } from 'react-hook-form';
import { FiSend, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import FormField from '../../components/common/FormField.jsx';

export default function Contact() {
  const { t } = useLanguage();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  // تم تعديل الدالة لتقوم بإرسال البيانات فعلياً إلى حسابك في Formspree
  const onSubmit = async (data) => {
    try {
      const response = await fetch('https://formspree.io/f/xaqgazyw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        toast.success(t('contact_sent'));
        reset();
      } else {
        toast.error('حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى.');
      }
    } catch (error) {
      toast.error('عذراً، تعذر الاتصال بالسيرفر حالياً.');
    }
  };

  return (
    <div className="container-page px-4 py-14 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <span className="eyebrow justify-center">{t('nav_contact')}</span>
          <h1 className="font-display mt-3 text-2xl font-bold text-ink-900 sm:text-4xl">{t('contact_title')}</h1>
          <p className="mt-3 text-sm text-ink-500 sm:text-base">{t('contact_subtitle')}</p>
        </div>

        {/* تعديل الـ Grid هنا ليصبح عمود واحد في الموبايل وعمودين في الشاشات الأكبر */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-[1fr,1.3fr]">
          <div className="flex flex-col gap-4">
            {/* تم تحديث البيانات الحقيقية الخاصة بك في الكروت الجانبية هنا */}
            <InfoRow icon={FiMail} text="m23566aud@gmail.com" />
            <InfoRow icon={FiPhone} text="01206923817" />
            <InfoRow icon={FiMapPin} text="أسيوط، مصر" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="card flex flex-col gap-4 p-5 sm:p-6">
            <FormField label={t('contact_name')} required error={errors.name && t('field_required')}>
              <input className="input" {...register('name', { required: true })} />
            </FormField>
            <FormField
              label={t('contact_email')}
              required
              error={errors.email && (errors.email.type === 'pattern' ? t('field_invalid_email') : t('field_required'))}
            >
              <input
                className="input"
                type="email"
                {...register('email', { required: true, pattern: /^\S+@\S+\.\S+$/ })}
              />
            </FormField>
            <FormField label={t('contact_message')} required error={errors.message && t('field_required')}>
              <textarea rows={4} className="input resize-none" {...register('message', { required: true })} />
            </FormField>
            <button type="submit" disabled={isSubmitting} className="btn-accent mt-1 justify-center w-full sm:w-auto">
              <FiSend className="h-4 w-4" />
              {isSubmitting ? 'جاري الإرسال...' : t('contact_send')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-ink-100 bg-white px-4 py-3.5 shadow-sm">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-50 text-ink-600">
        <Icon className="h-4 w-4" />
      </span>
      <span className="text-xs sm:text-sm text-ink-700 break-all" dir="ltr">
        {text}
      </span>
    </div>
  );
}