import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { promoCodesService } from '../../services';
import { EQueries, queryKeys } from '../_types';
import queryClient from '../queryClient';
import type { ApiError } from '../../types/api-error';
import type { GeneratePromoCodesDto, PromoCode } from '../../types/promo-code';
import type { PaginatedResult, PaginationParams } from '../../types/pagination';

export function usePromoCodesMine(params: PaginationParams = {}) {
  return useQuery<PaginatedResult<PromoCode>, ApiError>({
    queryKey: queryKeys.promoCodesMine(params),
    queryFn: () => promoCodesService.findMine(params),
    placeholderData: keepPreviousData,
  });
}

export function usePromoCodesForCampaign(
  campaignId: string | undefined,
  params: PaginationParams = {},
) {
  return useQuery<PaginatedResult<PromoCode>, ApiError>({
    queryKey: queryKeys.promoCodesForCampaign(campaignId ?? '', params),
    queryFn: () =>
      promoCodesService.findForCampaign(campaignId as string, params),
    enabled: !!campaignId,
    placeholderData: keepPreviousData,
  });
}

export function useGeneratePromoCodes() {
  return useMutation<PromoCode[], ApiError, GeneratePromoCodesDto>({
    mutationFn: (dto) => promoCodesService.generate(dto),
    onSuccess: (_codes, dto) => {
      queryClient.invalidateQueries({ queryKey: [EQueries.PROMO_CODES_MINE] });
      queryClient.invalidateQueries({
        queryKey: [EQueries.PROMO_CODES_CAMPAIGN, dto.campaignId],
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.statsOverview() });
    },
  });
}
