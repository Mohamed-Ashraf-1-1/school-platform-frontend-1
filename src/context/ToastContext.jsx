import { createContext, useCallback, useContext, useState } from 'react';
import { FiCheckCircle, FiXCircle, FiInfo } from 'react-icons/fi';

const ToastContext = createContext(null);
let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (message, type = 'success') => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => remove(id), 3500);
    },
    [remove]
  );

  const toast = {
    success: (msg) => push(msg, 'success'),
    error: (msg) => push(msg, 'error'),
    info: (msg) => push(msg, 'info'),
  };

  const icons = {
    success: <FiCheckCircle className="h-5 w-5 text-teal-500" />,
    error: <FiXCircle className="h-5 w-5 text-clay-500" />,
    info: <FiInfo className="h-5 w-5 text-ink-500" />,
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-4 z-[100] flex w-full max-w-sm flex-col gap-2 px-4 end-0 sm:bottom-6 sm:end-6 sm:px-0">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="animate-fadeUp flex items-start gap-3 rounded-xl border border-ink-100 bg-white px-4 py-3 shadow-lifted"
          >
            {icons[t.type]}
            <p className="text-sm font-medium text-ink-800">{t.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
