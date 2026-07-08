import ReferenceManager from '../../components/admin/ReferenceManager.jsx';
import { specializationsApi } from '../../services/specializations.js';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function Specializations() {
  const { t } = useLanguage();
  return (
    <ReferenceManager
      api={specializationsApi}
      title={t('admin_sidebar_specializations')}
      subtitle={t('admin_dashboard_sub')}
      fields={[
        { name: 'name', label: t('field_name'), type: 'text', required: true },
        { name: 'description', label: t('field_description'), type: 'textarea' },
      ]}
    />
  );
}
