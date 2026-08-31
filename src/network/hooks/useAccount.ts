import { useMutation, useQuery } from '@tanstack/react-query';
import { accountsService } from '../../services';
import { queryKeys } from '../_types';
import queryClient from '../queryClient';
import type { ApiError } from '../../types/api-error';
import type { AccountProfile, UpdateProfileDto } from '../../types/account';

// Профиль аккаунта с бэка (GET /accounts/me) — в отличие от useCurrentAccount,
// который читает урезанный AccountInfo из localStorage
export function useProfile() {
  return useQuery<AccountProfile, ApiError>({
    queryKey: queryKeys.accountProfile(),
    queryFn: () => accountsService.getProfile(),
  });
}

export function useUpdateProfile() {
  return useMutation<AccountProfile, ApiError, UpdateProfileDto>({
    mutationFn: (dto) => accountsService.updateProfile(dto),
    onSuccess: (profile) => {
      queryClient.setQueryData(queryKeys.accountProfile(), profile);
      // Имя показывается в шапке/сайдбаре из currentAccount — подтягиваем свежее
      queryClient.invalidateQueries({ queryKey: queryKeys.currentAccount() });
    },
  });
}
