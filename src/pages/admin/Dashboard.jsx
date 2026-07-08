import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiMapPin, FiBriefcase, FiLayers } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { listSchools } from '../../services/schools.js';
import { governoratesApi } from '../../services/governorates.js';
import { partnersApi } from '../../services/partners.js';
import { specializationsApi } from '../../services/specializations.js';
import PageHeader from '../../components/admin/PageHeader.jsx';
import StatCard from '../../components/admin/StatCard.jsx';
import DataTable from '../../components/admin/DataTable.jsx';
import ScoreGauge from '../../components/common/ScoreGauge.jsx';
import Badge from '../../components/common/Badge.jsx';
import { genderLabel, durationLabel } from '../../utils/format.js';

export default function Dashboard() {
  const { t, lang } = useLanguage();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState(null);

  useEffect(() => {
    Promise.all([
      listSchools({ limit: 1 }),
      governoratesApi.list({ limit: 1 }),
      partnersApi.list({ limit: 1 }),
      specializationsApi.list({ limit: 1 }),
    ]).then(([schools, govs, partners, specs]) => {
      setStats({
        schools: schools.meta?.total ?? 0,
        governorates: govs.meta?.total ?? 0,
        partners: partners.meta?.total ?? 0,
        specializations: specs.meta?.total ?? 0,
      });
    });

    listSchools({ limit: 6, sortBy: 'createdAt', sortOrder: 'desc' })
      .then((res) => setRecent(res.data || []))
      .catch(() => setRecent([]));
  }, []);

  const columns = [
    { key: 'name', label: t('admin_table_name') },
    { key: 'governorate', label: t('admin_table_governorate'), render: (r) => r.governorate?.name },
    { key: 'score', label: t('admin_table_score'), render: (r) => <ScoreGauge score={r.minScore} size={36} /> },
    { key: 'gender', label: t('admin_table_gender'), render: (r) => genderLabel(r.gender, lang) },
    { key: 'duration', label: t('admin_table_duration'), render: (r) => durationLabel(r.studyDuration, lang) },
    {
      key: 'status',
      label: t('admin_table_status'),
      render: (r) => (
        <Badge tone={r.isActive ? 'teal' : 'clay'}>
          {r.isActive ? t('admin_status_active') : t('admin_status_inactive')}
        </Badge>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title={t('admin_dashboard_title')} subtitle={t('admin_dashboard_sub')} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={FiHome} label={t('admin_dashboard_total_schools')} value={stats?.schools} tone="brass" />
        <StatCard
          icon={FiMapPin}
          label={t('admin_dashboard_total_governorates')}
          value={stats?.governorates}
          tone="teal"
        />
        <StatCard
          icon={FiBriefcase}
          label={t('admin_dashboard_total_partners')}
          value={stats?.partners}
          tone="ink"
        />
        <StatCard
          icon={FiLayers}
          label={t('admin_dashboard_total_specializations')}
          value={stats?.specializations}
          tone="clay"
        />
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-base font-semibold text-ink-900">{t('admin_dashboard_recent')}</h3>
          <Link to="/admin/schools" className="text-sm font-semibold text-teal-600 hover:text-teal-700">
            {t('view_all')}
          </Link>
        </div>
        <DataTable columns={columns} rows={recent} loading={recent === null} />
      </div>
    </div>
  );
}
