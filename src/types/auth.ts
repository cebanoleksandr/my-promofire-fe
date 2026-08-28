import type { Role } from './membership';
import type { WorkspaceListItem } from './workspace';

export interface AccountInfo {
  id: string;
  email: string;
}

export interface WorkspaceContext {
  id: string;
  name: string;
  role: Role;
  membershipId: string;
}

// Ответ, когда воркспейс уже выбран (register, select-workspace, accept-invite,
// или login при единственном воркспейсе у аккаунта) — можно сразу работать
export interface WorkspaceAuthResponse {
  accessToken: string;
  account: AccountInfo;
  workspace: WorkspaceContext;
}

// Ответ login, когда у аккаунта НЕСКОЛЬКО воркспейсов — accessToken тут
// "промежуточный" (без контекста воркспейса), годен только для select-workspace
export interface MultiWorkspaceLoginResponse {
  accessToken: string;
  account: AccountInfo;
  workspaces: WorkspaceListItem[];
}

export type LoginResponse = WorkspaceAuthResponse | MultiWorkspaceLoginResponse;

// Type guard: если есть поле workspace — воркспейс уже выбран и с ответом можно
// сразу работать, если нет — это MultiWorkspaceLoginResponse, нужен select-workspace
export function isWorkspaceAuthResponse(
  response: LoginResponse,
): response is WorkspaceAuthResponse {
  return 'workspace' in response;
}

export interface RegisterDto {
  email: string;
  password: string;
  workspaceName: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface SelectWorkspaceDto {
  membershipId: string;
}

export interface AcceptInviteDto {
  token: string;
  // Обязателен, только если у аккаунта ещё нет пароля (первый вход в систему)
  password?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}
