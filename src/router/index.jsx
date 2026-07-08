import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import Spinner from '../components/common/Spinner.jsx';

// Public pages
const Home = lazy(() => import('../pages/public/Home.jsx'));
const Schools = lazy(() => import('../pages/public/Schools.jsx'));
const SchoolDetails = lazy(() => import('../pages/public/SchoolDetails.jsx'));
const Compare = lazy(() => import('../pages/public/Compare.jsx'));
const About = lazy(() => import('../pages/public/About.jsx'));
const Contact = lazy(() => import('../pages/public/Contact.jsx'));
const NotFound = lazy(() => import('../pages/public/NotFound.jsx'));

// Admin pages
const Login = lazy(() => import('../pages/admin/Login.jsx'));
const Dashboard = lazy(() => import('../pages/admin/Dashboard.jsx'));
const SchoolsList = lazy(() => import('../pages/admin/SchoolsList.jsx'));
const SchoolForm = lazy(() => import('../pages/admin/SchoolForm.jsx'));
const Governorates = lazy(() => import('../pages/admin/Governorates.jsx'));
const Partners = lazy(() => import('../pages/admin/Partners.jsx'));
const Specializations = lazy(() => import('../pages/admin/Specializations.jsx'));
const MediaManager = lazy(() => import('../pages/admin/MediaManager.jsx'));

function PageFallback() {
  return <Spinner className="min-h-[50vh]" />;
}

export default function AppRouter() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        {/* Public site */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/schools" element={<Schools />} />
          <Route path="/schools/:slug" element={<SchoolDetails />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* 🔒 رابط بوابة تسجيل الدخول (تم إضافة /login لمنع الدوران اللانهائي) */}
        <Route path={`/${import.meta.env.VITE_ADMIN_SECRET_PATH}/login`} element={<Login />} />

        {/* 🔒 Admin dashboard (protected) */}
        <Route
          path={`/${import.meta.env.VITE_ADMIN_SECRET_PATH}`}
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="schools" element={<SchoolsList />} />
          <Route path="schools/new" element={<SchoolForm />} />
          <Route path="schools/:slug/edit" element={<SchoolForm />} />
          <Route path="governorates" element={<Governorates />} />
          <Route path="partners" element={<Partners />} />
          <Route path="specializations" element={<Specializations />} />
          <Route path="media" element={<MediaManager />} />
        </Route>
      </Routes>
    </Suspense>
  );
}