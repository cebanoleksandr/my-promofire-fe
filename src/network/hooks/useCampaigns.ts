import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { campaignsService } from '../../services';
import { EQueries, queryKeys } from '../_types';
import queryClient from '../queryClient';
import type { ApiError } from '../../types/api-error';
import type { Campaign, CreateCampaignDto } from '../../types/campaign';
import type { PaginatedResult, PaginationParams } from '../../types/pagination';

export function useCampaigns(params: PaginationParams = {}) {
  return useQuery<PaginatedResult<Campaign>, ApiError>({
    queryKey: queryKeys.campaigns(params),
    queryFn: () => campaignsService.findAll(params),
    placeholderData: keepPreviousData,
  });
}

export function useCampaign(id: string | undefined) {
  return useQuery<Campaign, ApiError>({
    queryKey: queryKeys.campaign(id ?? ''),
    queryFn: () => campaignsService.findOne(id as string),
    enabled: !!id,
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
