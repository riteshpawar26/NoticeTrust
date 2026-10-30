import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { Footer } from './components/common/Footer';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { NoticesFeedPage } from './pages/public/NoticesFeedPage';
import { NoticeDetailPage } from './pages/public/NoticeDetailPage';
import { TrustPassportPage } from './pages/public/TrustPassportPage';
import { VersionHistoryPage } from './pages/public/VersionHistoryPage';
import { VerifyUploadPage } from './pages/public/VerifyUploadPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Student Pages
import { StudentDashboardPage } from './pages/student/StudentDashboardPage';
import { SavedNoticesPage } from './pages/student/SavedNoticesPage';
import { NotificationsPage } from './pages/student/NotificationsPage';
import { StudentReportsPage } from './pages/student/StudentReportsPage';

// Publisher Pages
import { PublisherDashboardPage } from './pages/publisher/PublisherDashboardPage';
import { PublisherNoticesPage } from './pages/publisher/PublisherNoticesPage';
import { NoticeEditorPage } from './pages/publisher/NoticeEditorPage';
import { NoticeRevisionPage } from './pages/publisher/NoticeRevisionPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { ModerationApprovalsPage } from './pages/admin/ModerationApprovalsPage';
import { AdminNoticesPage } from './pages/admin/AdminNoticesPage';
import { ReportsModerationPage } from './pages/admin/ReportsModerationPage';
import { ConflictRadarPage } from './pages/admin/ConflictRadarPage';
import { AuditLogsPage } from './pages/admin/AuditLogsPage';

// Super Admin Pages
import { InstitutionsPage } from './pages/superadmin/InstitutionsPage';
import { UsersManagementPage } from './pages/superadmin/UsersManagementPage';
import { SystemSettingsPage } from './pages/superadmin/SystemSettingsPage';

// Errors
import { NotFoundPage } from './pages/error/NotFoundPage';
import { ForbiddenPage } from './pages/error/ForbiddenPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, role } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
};

const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Show sidebar for dashboard / registry routes
  const isDashboardOrFeed = location.pathname !== '/' && !location.pathname.startsWith('/login') && !location.pathname.startsWith('/register');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {isDashboardOrFeed && (
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}

        <main className={`flex-1 min-w-0 px-4 sm:px-6 lg:px-8 pb-12`}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<HomePage />} />
            <Route path="/notices" element={<NoticesFeedPage />} />
            <Route path="/notices/:noticeId" element={<NoticeDetailPage />} />
            <Route path="/notices/:noticeId/verify" element={<TrustPassportPage />} />
            <Route path="/notices/:noticeId/history" element={<VersionHistoryPage />} />
            <Route path="/verify-upload" element={<VerifyUploadPage />} />

            {/* Auth */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Student */}
            <Route path="/student/dashboard" element={<StudentDashboardPage />} />
            <Route path="/student/saved" element={<SavedNoticesPage />} />
            <Route path="/student/notifications" element={<NotificationsPage />} />
            <Route path="/student/reports" element={<StudentReportsPage />} />

            {/* Publisher */}
            <Route
              path="/publisher/dashboard"
              element={
                <ProtectedRoute allowedRoles={['publisher', 'admin', 'super_admin']}>
                  <PublisherDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/publisher/notices"
              element={
                <ProtectedRoute allowedRoles={['publisher', 'admin', 'super_admin']}>
                  <PublisherNoticesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/publisher/notices/new"
              element={
                <ProtectedRoute allowedRoles={['publisher', 'admin', 'super_admin']}>
                  <NoticeEditorPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/publisher/notices/:noticeId/revisions"
              element={
                <ProtectedRoute allowedRoles={['publisher', 'admin', 'super_admin']}>
                  <NoticeRevisionPage />
                </ProtectedRoute>
              }
            />

            {/* Admin */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/approvals"
              element={
                <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                  <ModerationApprovalsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/notices"
              element={
                <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                  <AdminNoticesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/conflicts"
              element={
                <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                  <ConflictRadarPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                  <ReportsModerationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/audit-logs"
              element={
                <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                  <AuditLogsPage />
                </ProtectedRoute>
              }
            />

            {/* Super Admin */}
            <Route
              path="/super-admin/institutions"
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <InstitutionsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/super-admin/users"
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <UsersManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/super-admin/settings"
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <SystemSettingsPage />
                </ProtectedRoute>
              }
            />

            {/* Error Handlers */}
            <Route path="/403" element={<ForbiddenPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <BrowserRouter>
            <AppLayout />
          </BrowserRouter>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
