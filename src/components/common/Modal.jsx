import { useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function Modal({ open, onClose, title, children, size = 'md' }) {
  const { t } = useLanguage();

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 animate-fadeIn bg-ink-900/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative z-10 max-h-[85vh] w-full ${sizes[size]} animate-scaleIn overflow-y-auto rounded-2xl bg-white shadow-lifted`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-ink-100 bg-white px-6 py-4">
          <h2 className="font-display text-lg font-semibold text-ink-900">{title}</h2>
          <button
            onClick={onClose}
            aria-label={t('close')}
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink-400 hover:bg-ink-50 hover:text-ink-700"
          >
            <FiX className="h-4 w-4" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
