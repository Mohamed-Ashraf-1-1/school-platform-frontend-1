import { useLanguage } from '../../context/LanguageContext.jsx';
import Modal from './Modal.jsx';

export default function ConfirmDialog({ open, onClose, onConfirm, loading, title, message }) {
  const { t } = useLanguage();
  return (
    <Modal open={open} onClose={onClose} title={title || t('admin_confirm_delete_title')} size="sm">
      <p className="text-sm text-ink-500">{message || t('admin_confirm_delete_sub')}</p>
      <div className="mt-6 flex justify-end gap-2">
        <button className="btn-outline" onClick={onClose} disabled={loading}>
          {t('admin_cancel')}
        </button>
        <button className="btn-danger" onClick={onConfirm} disabled={loading}>
          {loading ? t('admin_saving') : t('admin_confirm_delete_btn')}
        </button>
      </div>
    </Modal>
  );
}
