import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../../services';
import { queryKeys } from '../_types';
import type { ApiError } from '../../types/api-error';
import type {
  AcceptInviteDto,
  AuthResponse,
  AuthUser,
  ChangePasswordDto,
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
} from '../../types/auth';

// Текущий пользователь читается из localStorage (см. auth-storage), сеть не дёргаем
export function useCurrentUser() {
  return useQuery<AuthUser | null, ApiError>({
    queryKey: queryKeys.currentUser(),
    queryFn: () => authService.getCurrentUser(),
    staleTime: Infinity,
  });
}

export function useRegister() {
  const qc = useQueryClient();

  return useMutation<AuthResponse, ApiError, RegisterDto>({
    mutationFn: (dto) => authService.register(dto),
    onSuccess: (res) => {
      qc.setQueryData(queryKeys.currentUser(), res.user);
      qc.invalidateQueries();
    },
  });
}

export function useLogin() {
  const qc = useQueryClient();

  return useMutation<AuthResponse, ApiError, LoginDto>({
    mutationFn: (dto) => authService.login(dto),
    onSuccess: (res) => {
      qc.setQueryData(queryKeys.currentUser(), res.user);
      qc.invalidateQueries();
    },
  });
}

export function useAcceptInvite() {
  const qc = useQueryClient();

  return useMutation<AuthResponse, ApiError, AcceptInviteDto>({
    mutationFn: (dto) => authService.acceptInvite(dto),
    onSuccess: (res) => {
      qc.setQueryData(queryKeys.currentUser(), res.user);
      qc.invalidateQueries();
    },
  });
}

export function useChangePassword() {
  return useMutation<{ message: string }, ApiError, ChangePasswordDto>({
    mutationFn: (dto) => authService.changePassword(dto),
  });
}

export function useForgotPassword() {
  return useMutation<{ message: string }, ApiError, ForgotPasswordDto>({
    mutationFn: (dto) => authService.forgotPassword(dto),
  });
}

export function useResetPassword() {
  return useMutation<{ message: string }, ApiError, ResetPasswordDto>({
    mutationFn: (dto) => authService.resetPassword(dto),
  });
}

export function useLogout() {
  const qc = useQueryClient();

  return useMutation<void, ApiError, void>({
    mutationFn: async () => authService.logout(),
    onSuccess: () => {
      qc.setQueryData(queryKeys.currentUser(), null);
      qc.clear();
    },
  });
}
