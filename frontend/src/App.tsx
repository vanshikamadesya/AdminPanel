import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { PrivateRoute } from './components/auth/PrivateRoute';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { PageLoader } from './components/ui/Loader';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { VerifyEmail } from './pages/auth/VerifyEmail';
import { ResetPassword } from './pages/auth/ResetPassword';

const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const UsersPage = lazy(() => import('./pages/UsersPage').then(m => ({ default: m.UsersPage })));
const ProductsPage = lazy(() => import('./pages/ProductsPage').then(m => ({ default: m.ProductsPage })));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })));
const ReportsPage = lazy(() => import('./pages/ReportsPage').then(m => ({ default: m.ReportsPage })));
const RolesPage = lazy(() => import('./pages/RolesPage'));
const AttributesPage = lazy(() => import('./pages/AttributesPage'));
const VariantsPage = lazy(() => import('./pages/VariantsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const ChangePasswordPage = lazy(() => import('./pages/ChangePasswordPage').then(m => ({ default: m.ChangePasswordPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

function App() {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Protected Routes */}
              <Route element={<PrivateRoute />}>
                <Route path="/" element={<DashboardLayout />}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="users" element={<UsersPage />} />
                  <Route path="roles" element={<RolesPage />} />
                  <Route path="products" element={<ProductsPage />} />
                  <Route path="attributes" element={<AttributesPage />} />
                  <Route path="variants" element={<VariantsPage />} />
                  <Route path="analytics" element={<AnalyticsPage />} />
                  <Route path="reports" element={<ReportsPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="change-password" element={<ChangePasswordPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'hsl(var(--background))',
                color: 'hsl(var(--foreground))',
                border: '1px solid hsl(var(--border))',
              },
              success: {
                iconTheme: {
                  primary: 'hsl(var(--primary))',
                  secondary: 'white',
                },
              },
              error: {
                iconTheme: {
                  primary: 'hsl(var(--destructive))',
                  secondary: 'white',
                },
              },
            }}
          />
        </BrowserRouter>
      </ErrorBoundary>
    </Provider>
  );
}

export default App;
