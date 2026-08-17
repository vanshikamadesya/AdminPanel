import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { getCurrentUser } from '../../store/slices/authSlice';
import { PageLoader } from '../ui/Loader';

const roleRoutes: Record<string, string[]> = {
  admin: ['/dashboard', '/users', '/roles', '/products', '/attributes', '/variants', '/analytics', '/reports', '/profile', '/change-password', '/settings'],
  moderator: ['/dashboard', '/products', '/attributes', '/variants', '/analytics', '/reports', '/profile', '/change-password'],
  user: ['/dashboard', '/profile', '/change-password'],
};

export function PrivateRoute() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading, user } = useAppSelector((state) => state.auth);
  const location = useLocation();
  const [sessionChecked, setSessionChecked] = useState(
    () => !localStorage.getItem('accessToken') && !sessionStorage.getItem('accessToken')
  );

  useEffect(() => {
    const hasToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');

    if (!hasToken || isAuthenticated) {
      setSessionChecked(true);
      return;
    }

    dispatch(getCurrentUser()).finally(() => setSessionChecked(true));
  }, [dispatch, isAuthenticated]);

  if (!sessionChecked || isLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const role = user?.role || 'user';
  const allowedRoutes = roleRoutes[role] || roleRoutes.user;

  if (!allowedRoutes.some((route) => location.pathname.startsWith(route))) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
