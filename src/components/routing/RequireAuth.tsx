import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getAccessToken } from '../../lib/auth-storage';

/**
 * Пускает дальше только с валидным токеном. Иначе — на /login,
 * запоминая исходный путь в location.state.from.
 */
export function RequireAuth() {
  const location = useLocation();
  const isAuthed = Boolean(getAccessToken());

  if (!isAuthed) {
    const from = location.pathname + location.search;
    return <Navigate to="/login" replace state={{ from }} />;
  }

  return <Outlet />;
}

export default RequireAuth;
