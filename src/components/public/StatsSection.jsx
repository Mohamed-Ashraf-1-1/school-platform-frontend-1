import { useEffect, useState } from 'react';
import { FiHome, FiMapPin, FiBriefcase, FiLayers } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { governoratesApi } from '../../services/governorates.js';
import { partnersApi } from '../../services/partners.js';
import { specializationsApi } from '../../services/specializations.js';
import { listSchools } from '../../services/schools.js';

/**
 * There is no dedicated /stats endpoint on the backend, so these numbers are
 * derived client-side from each resource's pagination meta (meta.total),
 * requesting only 1 record per call to keep payloads tiny.
 */
export default function StatsSection() {
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      listSchools({ limit: 1 }),
      governoratesApi.list({ limit: 1 }),
      partnersApi.list({ limit: 1 }),
      specializationsApi.list({ limit: 1 }),
    ])
      .then(([schools, govs, partners, specs]) => {
        if (cancelled) return;
        setStats({
          schools: schools.meta?.total ?? 0,
          governorates: govs.meta?.total ?? 0,
          partners: partners.meta?.total ?? 0,
          specializations: specs.meta?.total ?? 0,
        });
      })
      .catch(() => setStats({ schools: 0, governorates: 0, partners: 0, specializations: 0 }));
    return () => {
      cancelled = true;
    };
  }, []);

  const items = [
    { icon: FiHome, value: stats?.schools, label: t('hero_stat_schools') },
    { icon: FiMapPin, value: stats?.governorates, label: t('hero_stat_governorates') },
    { icon: FiBriefcase, value: stats?.partners, label: t('hero_stat_partners') },
    { icon: FiLayers, value: stats?.specializations, label: t('hero_stat_specializations') },
  ];

  return (
    <section className="border-y border-ink-100 bg-white">
      <div className="container-page grid grid-cols-2 gap-6 py-12 sm:grid-cols-4">
        {items.map((item, i) => (
          <div key={i} className="flex flex-col items-center text-center">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-brass-50 text-brass-600">
              <item.icon className="h-5 w-5" />
            </div>
            <span className="font-display text-2xl font-bold text-ink-900 sm:text-3xl">
              {item.value ?? '—'}
            </span>
            <span className="mt-1 text-xs font-medium text-ink-400">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
