import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { membershipsService } from '../../services';
import { EQueries, queryKeys } from '../_types';
import queryClient from '../queryClient';
import type { ApiError } from '../../types/api-error';
import type { Membership, TeamMember, InviteDto } from '../../types/membership';
import type { PaginatedResult, PaginationParams } from '../../types/pagination';

/** Команда текущего воркспейса (единственный эндпоинт с email). */
export function useMyTeam(params: PaginationParams = {}) {
  return useQuery<PaginatedResult<TeamMember>, ApiError>({
    queryKey: queryKeys.myTeam(params),
    queryFn: () => membershipsService.getMyTeam(params),
    placeholderData: keepPreviousData,
  });
}

export function useInviteMember() {
  return useMutation<Membership, ApiError, InviteDto>({
    mutationFn: (dto) => membershipsService.invite(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQueries.MY_TEAM] });
      queryClient.invalidateQueries({ queryKey: queryKeys.statsOverview() });
    },
  });
}

export function useResendInvite() {
  return useMutation<Membership, ApiError, string>({
    mutationFn: (membershipId) => membershipsService.resendInvite(membershipId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQueries.MY_TEAM] });
    },
  });
}

export function useDeactivateMember() {
  return useMutation<Membership, ApiError, string>({
    mutationFn: (membershipId) => membershipsService.deactivate(membershipId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQueries.MY_TEAM] });
    },
  });
}

export function useActivateMember() {
  return useMutation<Membership, ApiError, string>({
    mutationFn: (membershipId) => membershipsService.activate(membershipId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQueries.MY_TEAM] });
    },
  });
}

export function useRemoveMember() {
  return useMutation<void, ApiError, string>({
    mutationFn: (membershipId) => membershipsService.remove(membershipId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQueries.MY_TEAM] });
      queryClient.invalidateQueries({ queryKey: queryKeys.statsOverview() });
    },
  });
}
