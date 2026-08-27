import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { usersService } from '../../services';
import { EQueries, queryKeys } from '../_types';
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
  const qc = useQueryClient();

  return useMutation<User, ApiError, InviteDto>({
    mutationFn: (dto) => usersService.invite(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [EQueries.MY_TEAM] });
      qc.invalidateQueries({ queryKey: queryKeys.statsOverview() });
    },
  });
}

export function useResendInvite() {
  const qc = useQueryClient();

  return useMutation<User, ApiError, string>({
    mutationFn: (userId) => usersService.resendInvite(userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [EQueries.MY_TEAM] });
    },
  });
}

export function useDeactivateUser() {
  const qc = useQueryClient();

  return useMutation<User, ApiError, string>({
    mutationFn: (userId) => usersService.deactivate(userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [EQueries.MY_TEAM] });
    },
  });
}

export function useActivateUser() {
  const qc = useQueryClient();

  return useMutation<User, ApiError, string>({
    mutationFn: (userId) => usersService.activate(userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [EQueries.MY_TEAM] });
    },
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();

  return useMutation<void, ApiError, string>({
    mutationFn: (userId) => usersService.remove(userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [EQueries.MY_TEAM] });
      qc.invalidateQueries({ queryKey: queryKeys.statsOverview() });
    },
  });
}
