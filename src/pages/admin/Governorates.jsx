import ReferenceManager from '../../components/admin/ReferenceManager.jsx';
import { governoratesApi } from '../../services/governorates.js';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function Governorates() {
  const { t } = useLanguage();
  return (
    <ReferenceManager
      api={governoratesApi}
      title={t('admin_sidebar_governorates')}
      subtitle={t('admin_dashboard_sub')}
      fields={[{ name: 'name', label: t('field_name'), type: 'text', required: true }]}
    />
  );
}
