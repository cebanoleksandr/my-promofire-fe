import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { usersService } from '../../services';
import { EQueries, queryKeys } from '../_types';
import queryClient from '../queryClient';
import type { ApiError } from '../../types/api-error';
import type { InviteDto } from '../../types/auth';
import type { PaginatedResult, PaginationParams } from '../../types/pagination';
import type { User } from '../../types/user';

export function useMyTeam(params: PaginationParams = {}) {
  return useQuery<PaginatedResult<User>, ApiError>({
    queryKey: queryKeys.myTeam(params),
    queryFn: () => usersService.getMyTeam(params),
    placeholderData: keepPreviousData,
  });
}

export function useInviteUser() {
  return useMutation<User, ApiError, InviteDto>({
    mutationFn: (dto) => usersService.invite(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQueries.MY_TEAM] });
      queryClient.invalidateQueries({ queryKey: queryKeys.statsOverview() });
    },
  });
}

export function useResendInvite() {
  return useMutation<User, ApiError, string>({
    mutationFn: (userId) => usersService.resendInvite(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQueries.MY_TEAM] });
    },
  });
}

export function useDeactivateUser() {
  return useMutation<User, ApiError, string>({
    mutationFn: (userId) => usersService.deactivate(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQueries.MY_TEAM] });
    },
  });
}

export function useActivateUser() {
  return useMutation<User, ApiError, string>({
    mutationFn: (userId) => usersService.activate(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQueries.MY_TEAM] });
    },
  });
}

export function useDeleteUser() {
  return useMutation<void, ApiError, string>({
    mutationFn: (userId) => usersService.remove(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQueries.MY_TEAM] });
      queryClient.invalidateQueries({ queryKey: queryKeys.statsOverview() });
    },
  });
}
