import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { membershipsService } from '../../services';
import type { GetMyTeamParams } from '../../services/memberships.service';
import { EQueries, queryKeys } from '../_types';
import queryClient from '../queryClient';
import type { ApiError } from '../../types/api-error';
import type {
  Membership,
  TeamMember,
  DistributorDetail,
  UpdateDistributorDetailDto,
  InviteDto,
} from '../../types/membership';
import type { PaginatedResult } from '../../types/pagination';

/** Команда текущего воркспейса (единственный эндпоинт с email). */
export function useMyTeam(params: GetMyTeamParams = {}) {
  return useQuery<PaginatedResult<TeamMember>, ApiError>({
    queryKey: queryKeys.myTeam(params),
    queryFn: () => membershipsService.getMyTeam(params),
    placeholderData: keepPreviousData,
  });
}

// Шапка страницы деталей Distributor'а (профиль + editable description)
export function useDistributor(id: string | undefined) {
  return useQuery<DistributorDetail, ApiError>({
    queryKey: queryKeys.distributor(id ?? ''),
    queryFn: () => membershipsService.getDistributor(id as string),
    enabled: !!id,
  });
}

export function useUpdateDistributorDetail() {
  return useMutation<
    DistributorDetail,
    ApiError,
    { id: string; dto: UpdateDistributorDetailDto }
  >({
    mutationFn: ({ id, dto }) => membershipsService.updateDistributor(id, dto),
    onSuccess: (distributor) => {
      queryClient.setQueryData(queryKeys.distributor(distributor.id), distributor);
      queryClient.invalidateQueries({ queryKey: [EQueries.MY_TEAM] });
    },
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
    onSuccess: (_data, membershipId) => {
      queryClient.invalidateQueries({ queryKey: [EQueries.MY_TEAM] });
      queryClient.invalidateQueries({ queryKey: queryKeys.distributor(membershipId) });
    },
  });
}

export function useActivateMember() {
  return useMutation<Membership, ApiError, string>({
    mutationFn: (membershipId) => membershipsService.activate(membershipId),
    onSuccess: (_data, membershipId) => {
      queryClient.invalidateQueries({ queryKey: [EQueries.MY_TEAM] });
      queryClient.invalidateQueries({ queryKey: queryKeys.distributor(membershipId) });
    },
  });
}

export function useRemoveMember() {
  return useMutation<void, ApiError, string>({
    mutationFn: (membershipId) => membershipsService.remove(membershipId),
    onSuccess: (_data, membershipId) => {
      queryClient.invalidateQueries({ queryKey: [EQueries.MY_TEAM] });
      queryClient.invalidateQueries({ queryKey: queryKeys.statsOverview() });
      queryClient.removeQueries({ queryKey: queryKeys.distributor(membershipId) });
    },
  });
}
