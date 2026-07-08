import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useDebounce } from '../../hooks/useDebounce.js';
import PageHeader from './PageHeader.jsx';
import Toolbar from './Toolbar.jsx';
import DataTable from './DataTable.jsx';
import Modal from '../common/Modal.jsx';
import ConfirmDialog from '../common/ConfirmDialog.jsx';
import FormField from '../common/FormField.jsx';
import Pagination from '../common/Pagination.jsx';

/**
 * Drives Governorates / Partners / Specializations admin pages. All three
 * resources expose the exact same REST shape on the backend
 * (list/getById/create/update/remove with { name, ... } bodies), so this one
 * component handles listing, search, pagination, add/edit modal and delete
 * confirmation for any of them — only `fields` and `columns` differ per page.
 *
 * fields: [{ name, label, type: 'text'|'textarea'|'url', required? }]
 */
export default function ReferenceManager({ api, title, subtitle, fields, extraColumns = [] }) {
  const { t } = useLanguage();
  const toast = useToast();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 350);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(null);
  const [meta, setMeta] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const load = () => {
    setRows(null);
    api
      .list({ page, limit: 10, search: debouncedSearch })
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

  const openCreate = () => {
    setEditing(null);
    reset(Object.fromEntries(fields.map((f) => [f.name, ''])));
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    reset(Object.fromEntries(fields.map((f) => [f.name, row[f.name] ?? ''])));
    setModalOpen(true);
  };

  const onSubmit = async (values) => {
    setSaving(true);
    try {
      const payload = Object.fromEntries(
        Object.entries(values).map(([k, v]) => [k, v === '' ? undefined : v])
      );
      if (editing) {
        await api.update(editing.id, payload);
        toast.success(t('admin_toast_updated'));
      } else {
        await api.create(payload);
        toast.success(t('admin_toast_created'));
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.message || t('admin_toast_error'));
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.remove(deleteTarget.id);
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
    ...extraColumns,
    {
      key: 'count',
      label: t('admin_table_schools_count'),
      render: (r) => r._count?.schools ?? 0,
    },
  ];

  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} />
      <Toolbar search={search} onSearchChange={setSearch} onAddClick={openCreate} />

      <DataTable
        columns={columns}
        rows={rows}
        loading={rows === null}
        rowActions={(row) => (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => openEdit(row)}
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

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? t('admin_edit') : t('admin_add_new')}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {fields.map((f) => (
            <FormField
              key={f.name}
              label={f.label}
              required={f.required}
              error={errors[f.name] && t('field_required')}
            >
              {f.type === 'textarea' ? (
                <textarea
                  rows={3}
                  className="input resize-none"
                  {...register(f.name, { required: f.required })}
                />
              ) : (
                <input
                  type={f.type === 'url' ? 'url' : 'text'}
                  className="input"
                  {...register(f.name, { required: f.required })}
                />
              )}
            </FormField>
          ))}
          <div className="mt-2 flex justify-end gap-2">
            <button type="button" className="btn-outline" onClick={() => setModalOpen(false)} disabled={saving}>
              {t('admin_cancel')}
            </button>
            <button type="submit" className="btn-accent" disabled={saving}>
              {saving ? t('admin_saving') : t('admin_save')}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        loading={deleting}
      />
    </div>
  );
}
