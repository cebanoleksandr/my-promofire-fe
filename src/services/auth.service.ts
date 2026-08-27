import { apiClient } from '../lib/api-client';
import { setAuth, clearAuth, getStoredUser } from '../lib/auth-storage';
import type {
  AuthResponse,
  LoginDto,
  RegisterDto,
  AcceptInviteDto,
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from '../types/auth';

export const authService = {
  async register(dto: RegisterDto): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/auth/register', dto);
    setAuth(data.accessToken, data.user);
    return data;
  },

  async login(dto: LoginDto): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', dto);
    setAuth(data.accessToken, data.user);
    return data;
  },

  async acceptInvite(dto: AcceptInviteDto): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/auth/accept-invite', dto);
    setAuth(data.accessToken, data.user);
    return data;
  },

  async changePassword(dto: ChangePasswordDto): Promise<{ message: string }> {
    const { data } = await apiClient.post<{ message: string }>(
      '/auth/change-password',
      dto,
    );
    return data;
  },

  // Одинаковый ответ независимо от того, существует email или нет — так и должно быть
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

  getCurrentUser: getStoredUser,
};
