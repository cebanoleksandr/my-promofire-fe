import { Navigate, Outlet } from 'react-router-dom';
import { getStoredWorkspace } from '../../lib/auth-storage';
import type { Role } from '../../types/membership';

export interface RequireRoleProps {
  /** Роли, которым закрыт доступ к вложенным маршрутам. */
  deny: Role[];
}

/**
 * Закрывает вложенные маршруты для конкретных ролей текущего воркспейса
 * (например, Distributor не должен видеть /distributors и /users) —
 * уводит на главную. Живёт внутри RequireAuth, воркспейс уже выбран.
 */
export function RequireRole({ deny }: RequireRoleProps) {
  const role = getStoredWorkspace()?.role;

  if (role && deny.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default RequireRole;
