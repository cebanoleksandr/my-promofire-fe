import { useMutation, useQuery } from '@tanstack/react-query';
import { authService } from '../../services';
import { queryKeys } from '../_types';
import queryClient from '../queryClient';
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
  return useMutation<AuthResponse, ApiError, RegisterDto>({
    mutationFn: (dto) => authService.register(dto),
    onSuccess: (res) => {
      queryClient.setQueryData(queryKeys.currentUser(), res.user);
      queryClient.invalidateQueries();
    },
  });
}

export function useLogin() {
  return useMutation<AuthResponse, ApiError, LoginDto>({
    mutationFn: (dto) => authService.login(dto),
    onSuccess: (res) => {
      queryClient.setQueryData(queryKeys.currentUser(), res.user);
      queryClient.invalidateQueries();
    },
  });
}

export function useAcceptInvite() {
  return useMutation<AuthResponse, ApiError, AcceptInviteDto>({
    mutationFn: (dto) => authService.acceptInvite(dto),
    onSuccess: (res) => {
      queryClient.setQueryData(queryKeys.currentUser(), res.user);
      queryClient.invalidateQueries();
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
  return useMutation<void, ApiError, void>({
    mutationFn: async () => authService.logout(),
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.currentUser(), null);
      queryClient.clear();
    },
  });
}
