import { useMutation, useQuery } from '@tanstack/react-query';
import { authService } from '../../services';
import { queryKeys } from '../_types';
import queryClient from '../queryClient';
import type { ApiError } from '../../types/api-error';
import {
  isWorkspaceAuthResponse,
  type AccountInfo,
  type WorkspaceContext,
  type LoginResponse,
  type WorkspaceAuthResponse,
  type RegisterDto,
  type LoginDto,
  type SelectWorkspaceDto,
  type AcceptInviteDto,
  type ChangePasswordDto,
  type ForgotPasswordDto,
  type ResetPasswordDto,
} from '../../types/auth';

/** Полный контекст воркспейса получен — синхронизируем кэш и перезапрашиваем данные. */
function syncWorkspaceAuth(res: WorkspaceAuthResponse) {
  queryClient.setQueryData(queryKeys.currentAccount(), res.account);
  queryClient.setQueryData(queryKeys.currentWorkspace(), res.workspace);
  queryClient.invalidateQueries();
}

// Аккаунт и воркспейс читаются из localStorage (auth-storage), сеть не дёргаем
export function useCurrentAccount() {
  return useQuery<AccountInfo | null, ApiError>({
    queryKey: queryKeys.currentAccount(),
    queryFn: () => authService.getCurrentAccount(),
    staleTime: Infinity,
  });
}

export function useCurrentWorkspace() {
  return useQuery<WorkspaceContext | null, ApiError>({
    queryKey: queryKeys.currentWorkspace(),
    queryFn: () => authService.getCurrentWorkspace(),
    staleTime: Infinity,
  });
}

export function useRegister() {
  return useMutation<WorkspaceAuthResponse, ApiError, RegisterDto>({
    mutationFn: (dto) => authService.register(dto),
    onSuccess: syncWorkspaceAuth,
  });
}

export function useLogin() {
  return useMutation<LoginResponse, ApiError, LoginDto>({
    mutationFn: (dto) => authService.login(dto),
    onSuccess: (res) => {
      queryClient.setQueryData(queryKeys.currentAccount(), res.account);

      if (isWorkspaceAuthResponse(res)) {
        queryClient.setQueryData(queryKeys.currentWorkspace(), res.workspace);
      } else {
        // Мультиворкспейс-аккаунт: воркспейс ещё не выбран
        queryClient.setQueryData(queryKeys.currentWorkspace(), null);
        queryClient.setQueryData(queryKeys.workspacesMine(), res.workspaces);
      }

      queryClient.invalidateQueries();
    },
  });
}

// Первичный выбор воркспейса после мультиворкспейс-логина и "переключить воркспейс"
export function useSelectWorkspace() {
  return useMutation<WorkspaceAuthResponse, ApiError, SelectWorkspaceDto>({
    mutationFn: (dto) => authService.selectWorkspace(dto),
    onSuccess: syncWorkspaceAuth,
  });
}

export function useAcceptInvite() {
  return useMutation<WorkspaceAuthResponse, ApiError, AcceptInviteDto>({
    mutationFn: (dto) => authService.acceptInvite(dto),
    onSuccess: syncWorkspaceAuth,
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
      queryClient.clear();
    },
  });
}
