import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useDebounce } from '../../hooks/useDebounce.js';
import { listSchools, deleteSchool } from '../../services/schools.js';
import PageHeader from '../../components/admin/PageHeader.jsx';
import Toolbar from '../../components/admin/Toolbar.jsx';
import DataTable from '../../components/admin/DataTable.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import ScoreGauge from '../../components/common/ScoreGauge.jsx';
import Badge from '../../components/common/Badge.jsx';
import { genderLabel, durationLabel } from '../../utils/format.js';
import { PAGE_SIZE } from '../../utils/constants.js';

export default function SchoolsList() {
  const { t, lang } = useLanguage();
  const toast = useToast();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 350);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(null);
  const [meta, setMeta] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setRows(null);
    listSchools({ page, limit: PAGE_SIZE, search: debouncedSearch, sortBy: 'createdAt', sortOrder: 'desc' })
      .then((res) => {
        setRows(res.data || []);
        setMeta(res.meta || null);
      })
      .catch(() => {
        setRows([]);
        toast.error(t('admin_toast_error'));
      });
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSearch]);

  useEffect(() => setPage(1), [debouncedSearch]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteSchool(deleteTarget.id);
      toast.success(t('admin_toast_deleted'));
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err.message || t('admin_toast_error'));
    } finally {
      setDeleting(false);
    }
  };

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
      <PageHeader title={t('admin_sidebar_schools')} subtitle={t('admin_dashboard_sub')} />
      
      {/* 🛠️ تعديل توجيه زر إضافة جديد ليذهب للمسار السري الصحيح */}
      <Toolbar search={search} onSearchChange={setSearch} onAddClick={() => navigate('/secret-hub-portal-2026-x/schools/new')} />

      <DataTable
        columns={columns}
        rows={rows}
        loading={rows === null}
        rowActions={(row) => (
          <div className="flex items-center gap-1.5">
            <a
              href={`/schools/${row.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-full text-ink-500 hover:bg-ink-50"
              aria-label={t('view_details')}
            >
              <FiEye className="h-3.5 w-3.5" />
            </a>
            
            {/* 🛠️ تعديل توجيه زر التعديل ليعتمد على المسار السري والـ ID الرقمي الآمن */}
            <button
              onClick={() => navigate(`/secret-hub-portal-2026-x/schools/${row.id}/edit`)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-ink-500 hover:bg-ink-50"
              aria-label={t('admin_edit')}
            >
              <FiEdit2 className="h-3.5 w-3.5" />
            </button>
            
            <button
              onClick={() => setDeleteTarget(row)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-clay-500 hover:bg-clay-50"
              aria-label={t('admin_delete')}
            >
              <FiTrash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      />

      <Pagination page={page} totalPages={meta?.totalPages} onChange={setPage} />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        message={deleteTarget ? `${t('admin_confirm_delete_sub')} (${deleteTarget.name})` : ''}
      />
    </div>
  );
}