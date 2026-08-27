import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { campaignsService } from '../../services';
import { EQueries, queryKeys } from '../_types';
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
  const qc = useQueryClient();

  return useMutation<Campaign, ApiError, CreateCampaignDto>({
    mutationFn: (dto) => campaignsService.create(dto),
    onSuccess: (campaign) => {
      qc.invalidateQueries({ queryKey: [EQueries.CAMPAIGNS] });
      qc.invalidateQueries({ queryKey: queryKeys.statsOverview() });
      qc.setQueryData(queryKeys.campaign(campaign.id), campaign);
    },
  });
}

export function useActivateCampaign() {
  const qc = useQueryClient();

  return useMutation<Campaign, ApiError, string>({
    mutationFn: (id) => campaignsService.activate(id),
    onSuccess: (campaign) => {
      qc.setQueryData(queryKeys.campaign(campaign.id), campaign);
      qc.invalidateQueries({ queryKey: [EQueries.CAMPAIGNS] });
      qc.invalidateQueries({ queryKey: queryKeys.statsOverview() });
    },
  });
}

export function useDeactivateCampaign() {
  const qc = useQueryClient();

  return useMutation<Campaign, ApiError, string>({
    mutationFn: (id) => campaignsService.deactivate(id),
    onSuccess: (campaign) => {
      qc.setQueryData(queryKeys.campaign(campaign.id), campaign);
      qc.invalidateQueries({ queryKey: [EQueries.CAMPAIGNS] });
      qc.invalidateQueries({ queryKey: queryKeys.statsOverview() });
    },
  });
}

export function useDeleteCampaign() {
  const qc = useQueryClient();

  return useMutation<void, ApiError, string>({
    mutationFn: (id) => campaignsService.remove(id),
    onSuccess: (_data, id) => {
      qc.removeQueries({ queryKey: queryKeys.campaign(id) });
      qc.invalidateQueries({ queryKey: [EQueries.CAMPAIGNS] });
      qc.invalidateQueries({ queryKey: queryKeys.statsOverview() });
    },
  });
}
