import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getAccessToken } from '../../lib/auth-storage';

/**
 * Для страниц логина/регистрации: залогиненного пользователя уводит
 * на исходный путь (location.state.from) или на главную.
 */
export function GuestOnly() {
  const location = useLocation();
  const isAuthed = Boolean(getAccessToken());

  if (isAuthed) {
    const to = (location.state as { from?: string } | null)?.from ?? '/';
    return <Navigate to={to} replace />;
  }

  return <Outlet />;
}

export default GuestOnly;
