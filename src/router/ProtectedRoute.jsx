import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext.jsx';

export default function ProtectedRoute({ children }) {
  const { isAuthed } = useAdminAuth();
  const location = useLocation();

  // جلب المسار السري المتغير من المتغيرات البيئية
  const secretPath = import.meta.env.VITE_ADMIN_SECRET_PATH || 'secret-hub-portal-2026-x';

  if (!isAuthed) {
    // التوجيه تلقائياً إلى مسار الـ login الجديد داخل الرابط السري لمنع الـ Infinite Loop
    return <Navigate to={`/${secretPath}/login`} replace state={{ from: location }} />;
  }
  return children;
}