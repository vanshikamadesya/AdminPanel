import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { useAppDispatch } from '../../store/hooks';
import { getCurrentUser } from '../../store/slices/authSlice';
import { PageLoader } from '../ui/Loader';

export function PrivateRoute() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
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

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
