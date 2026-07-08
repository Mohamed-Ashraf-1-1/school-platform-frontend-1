import ReferenceManager from '../../components/admin/ReferenceManager.jsx';
import { partnersApi } from '../../services/partners.js';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function Partners() {
  const { t } = useLanguage();
  return (
    <ReferenceManager
      api={partnersApi}
      title={t('admin_sidebar_partners')}
      subtitle={t('admin_dashboard_sub')}
      fields={[
        { name: 'name', label: t('field_name'), type: 'text', required: true },
        { name: 'logo', label: t('field_logo'), type: 'url' },
        { name: 'website', label: t('field_website'), type: 'url' },
        { name: 'description', label: t('field_description'), type: 'textarea' },
      ]}
    />
  );
}
