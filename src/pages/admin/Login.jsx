import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { FiLock, FiGrid, FiAlertCircle } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx';

export default function Login() {
  const { t } = useLanguage();
  const { isAuthed, login } = useAdminAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // جلب المسار السري من المتغيرات البيئية
  const secretPath = import.meta.env.VITE_ADMIN_SECRET_PATH || 'secret-hub-portal-2026-x';

  if (isAuthed) {
    const from = location.state?.from?.pathname || `/${secretPath}/dashboard`;
    return <Navigate to={from} replace />;
  }

  const onSubmit = (e) => {
    e.preventDefault();
    if (login(password)) {
      // التوجيه للمسار السري الصحيح بعد نجاح تسجيل الدخول
      navigate(`/${secretPath}/dashboard`, { replace: true });
    } else {
      setError(true);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-900 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lifted">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink-900 text-brass-400">
            <FiGrid className="h-5 w-5" />
          </span>
          <h1 className="font-display mt-4 text-xl font-bold text-ink-900">{t('admin_login_title')}</h1>
          <p className="mt-2 text-xs leading-relaxed text-ink-400">{t('admin_login_sub')}</p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div>
            <label className="label">{t('admin_password')}</label>
            <div className="relative">
              <FiLock className="pointer-events-none absolute top-1/2 -translate-y-1/2 start-3.5 h-4 w-4 text-ink-300" />
              <input
                type="password"
                autoFocus
                className="input !ps-10"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
              />
            </div>
            {error && (
              <p className="field-error flex items-center gap-1.5">
                <FiAlertCircle className="h-3.5 w-3.5" />
                {t('admin_login_error')}
              </p>
            )}
          </div>
          <button type="submit" className="btn-primary justify-center">
            {t('admin_login_btn')}
          </button>
        </form>
      </div>
    </div>
  );
}