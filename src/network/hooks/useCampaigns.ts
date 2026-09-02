import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { campaignsService } from '../../services';
import { EQueries, queryKeys } from '../_types';
import queryClient from '../queryClient';
import type { ApiError } from '../../types/api-error';
import type {
  Campaign,
  CampaignDetail,
  CampaignListItem,
  CampaignStatusFilter,
  CreateCampaignDto,
  UpdateCampaignDto,
  AssignedDistributor,
} from '../../types/campaign';
import type { PaginatedResult, PaginationParams } from '../../types/pagination';

type CampaignListParams = PaginationParams & { status?: CampaignStatusFilter };

export function useCampaigns(params: CampaignListParams = {}) {
  return useQuery<PaginatedResult<CampaignListItem>, ApiError>({
    queryKey: queryKeys.campaigns(params),
    queryFn: () => campaignsService.findAll(params),
    placeholderData: keepPreviousData,
  });
}

export function useCampaign(id: string | undefined) {
  return useQuery<CampaignDetail, ApiError>({
    queryKey: queryKeys.campaign(id ?? ''),
    queryFn: () => campaignsService.findOne(id as string),
    enabled: !!id,
  });
}

// Редактирование полей кампании. Для isActive — useActivate/useDeactivateCampaign
export function useUpdateCampaign() {
  return useMutation<Campaign, ApiError, { id: string; dto: UpdateCampaignDto }>({
    mutationFn: ({ id, dto }) => campaignsService.update(id, dto),
    onSuccess: (campaign) => {
      queryClient.setQueryData(queryKeys.campaign(campaign.id), campaign);
      queryClient.invalidateQueries({ queryKey: [EQueries.CAMPAIGNS] });
    },
  });
}

export function useCreateCampaign() {
  return useMutation<Campaign, ApiError, CreateCampaignDto>({
    mutationFn: (dto) => campaignsService.create(dto),
    onSuccess: (campaign) => {
      queryClient.invalidateQueries({ queryKey: [EQueries.CAMPAIGNS] });
      queryClient.invalidateQueries({ queryKey: queryKeys.statsOverview() });
      queryClient.setQueryData(queryKeys.campaign(campaign.id), campaign);
    },
  });
}

export function useActivateCampaign() {
  return useMutation<Campaign, ApiError, string>({
    mutationFn: (id) => campaignsService.activate(id),
    onSuccess: (campaign) => {
      queryClient.setQueryData(queryKeys.campaign(campaign.id), campaign);
      queryClient.invalidateQueries({ queryKey: [EQueries.CAMPAIGNS] });
      queryClient.invalidateQueries({ queryKey: queryKeys.statsOverview() });
    },
  });
}

export function useDeactivateCampaign() {
  return useMutation<Campaign, ApiError, string>({
    mutationFn: (id) => campaignsService.deactivate(id),
    onSuccess: (campaign) => {
      queryClient.setQueryData(queryKeys.campaign(campaign.id), campaign);
      queryClient.invalidateQueries({ queryKey: [EQueries.CAMPAIGNS] });
      queryClient.invalidateQueries({ queryKey: queryKeys.statsOverview() });
    },
  });
}

// ── Назначенные на кампанию дистрибьюторы ─────────────────────────────
export function useCampaignDistributors(campaignId: string | undefined) {
  return useQuery<AssignedDistributor[], ApiError>({
    queryKey: queryKeys.campaignDistributors(campaignId ?? ''),
    queryFn: () => campaignsService.getAssignedDistributors(campaignId as string),
    enabled: !!campaignId,
  });
}

export function useAssignDistributor() {
  return useMutation<
    void,
    ApiError,
    { campaignId: string; distributorMembershipId: string }
  >({
    mutationFn: ({ campaignId, distributorMembershipId }) =>
      campaignsService.assignDistributor(campaignId, { distributorMembershipId }),
    onSuccess: (_data, { campaignId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.campaignDistributors(campaignId),
      });
    },
  });
}

export function useUnassignDistributor() {
  return useMutation<
    void,
    ApiError,
    { campaignId: string; distributorMembershipId: string }
  >({
    mutationFn: ({ campaignId, distributorMembershipId }) =>
      campaignsService.unassignDistributor(campaignId, distributorMembershipId),
    onSuccess: (_data, { campaignId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.campaignDistributors(campaignId),
      });
    },
  });
}

// Архивирует кампанию (soft-delete). Строка уедет в список status=archived,
// откуда её возвращает useRestoreCampaign
export function useDeleteCampaign() {
  return useMutation<void, ApiError, string>({
    mutationFn: (id) => campaignsService.remove(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: queryKeys.campaign(id) });
      queryClient.invalidateQueries({ queryKey: [EQueries.CAMPAIGNS] });
      queryClient.invalidateQueries({ queryKey: queryKeys.statsOverview() });
    },
  });
}

export function useRestoreCampaign() {
  return useMutation<Campaign, ApiError, string>({
    mutationFn: (id) => campaignsService.restore(id),
    onSuccess: (campaign) => {
      queryClient.setQueryData(queryKeys.campaign(campaign.id), campaign);
      queryClient.invalidateQueries({ queryKey: [EQueries.CAMPAIGNS] });
      queryClient.invalidateQueries({ queryKey: queryKeys.statsOverview() });
    },
  });
}
