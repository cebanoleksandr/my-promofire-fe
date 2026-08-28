import { apiClient } from '../lib/api-client';
import {
  setAccessToken,
  setAccount,
  setWorkspace,
  clearAuth,
  getStoredAccount,
  getStoredWorkspace,
} from '../lib/auth-storage';
import {
  isWorkspaceAuthResponse,
  type LoginResponse,
  type WorkspaceAuthResponse,
  type RegisterDto,
  type LoginDto,
  type SelectWorkspaceDto,
  type AcceptInviteDto,
  type ChangePasswordDto,
  type ForgotPasswordDto,
  type ResetPasswordDto,
} from '../types/auth';

function persistWorkspaceAuth(response: WorkspaceAuthResponse): void {
  setAccessToken(response.accessToken);
  setAccount(response.account);
  setWorkspace(response.workspace);
}

export const authService = {
  // Создаёт аккаунт + первый воркспейс, сразу возвращает полный контекст
  async register(dto: RegisterDto): Promise<WorkspaceAuthResponse> {
    const { data } = await apiClient.post<WorkspaceAuthResponse>('/auth/register', dto);
    persistWorkspaceAuth(data);
    return data;
  },

  // Если у аккаунта один воркспейс — вернётся WorkspaceAuthResponse, готово к работе.
  // Если несколько — MultiWorkspaceLoginResponse со списком, дальше вызови selectWorkspace.
  // Используй isWorkspaceAuthResponse(response) чтобы различить эти два случая.
  async login(dto: LoginDto): Promise<LoginResponse> {
    const { data } = await apiClient.post<LoginResponse>('/auth/login', dto);

    if (isWorkspaceAuthResponse(data)) {
      persistWorkspaceAuth(data);
    } else {
      // Промежуточный account-токен — сохраняем аккаунт и токен,
      // воркспейс появится только после selectWorkspace
      setAccessToken(data.accessToken);
      setAccount(data.account);
    }

    return data;
  },

  // Работает и сразу после многоворкспейсового логина, и как "переключить
  // воркспейс" из уже открытого — кнопка-свитчер в UI дёргает именно это
  async selectWorkspace(dto: SelectWorkspaceDto): Promise<WorkspaceAuthResponse> {
    const { data } = await apiClient.post<WorkspaceAuthResponse>(
      '/auth/select-workspace',
      dto,
    );
    persistWorkspaceAuth(data);
    return data;
  },

  async acceptInvite(dto: AcceptInviteDto): Promise<WorkspaceAuthResponse> {
    const { data } = await apiClient.post<WorkspaceAuthResponse>(
      '/auth/accept-invite',
      dto,
    );
    persistWorkspaceAuth(data);
    return data;
  },

  async changePassword(dto: ChangePasswordDto): Promise<{ message: string }> {
    const { data } = await apiClient.post<{ message: string }>(
      '/auth/change-password',
      dto,
    );
    return data;
  },

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const { data } = await apiClient.post<{ message: string }>(
      '/auth/forgot-password',
      dto,
    );
    return data;
  },

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const { data } = await apiClient.post<{ message: string }>(
      '/auth/reset-password',
      dto,
    );
    return data;
  },

  logout(): void {
    clearAuth();
  },

  getCurrentAccount: getStoredAccount,
  getCurrentWorkspace: getStoredWorkspace,
};
