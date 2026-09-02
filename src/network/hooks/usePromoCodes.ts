import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { promoCodesService } from '../../services';
import { EQueries, queryKeys } from '../_types';
import queryClient from '../queryClient';
import type { ApiError } from '../../types/api-error';
import type {
  GeneratePromoCodesDto,
  PromoCode,
  PromoCodeListItem,
  UpdatePromoCodePayloadDto,
} from '../../types/promo-code';
import type { PaginatedResult, PaginationParams } from '../../types/pagination';
import type { DateRangeParams } from '../../types/date-range';

type PromoCodesParams = PaginationParams & DateRangeParams;

// Все коды воркспейса (скоуп по роли решает бэкенд)
export function usePromoCodes(params: PromoCodesParams = {}) {
  return useQuery<PaginatedResult<PromoCodeListItem>, ApiError>({
    queryKey: queryKeys.promoCodes(params),
    queryFn: () => promoCodesService.findAll(params),
    placeholderData: keepPreviousData,
  });
}

export function usePromoCodesMine(params: PromoCodesParams = {}) {
  return useQuery<PaginatedResult<PromoCodeListItem>, ApiError>({
    queryKey: queryKeys.promoCodesMine(params),
    queryFn: () => promoCodesService.findMine(params),
    placeholderData: keepPreviousData,
  });
}

export function usePromoCodesForCampaign(
  campaignId: string | undefined,
  params: PromoCodesParams = {},
) {
  return useQuery<PaginatedResult<PromoCodeListItem>, ApiError>({
    queryKey: queryKeys.promoCodesForCampaign(campaignId ?? '', params),
    queryFn: () =>
      promoCodesService.findForCampaign(campaignId as string, params),
    enabled: !!campaignId,
    placeholderData: keepPreviousData,
  });
}

function invalidatePromoCodeLists() {
  queryClient.invalidateQueries({ queryKey: [EQueries.PROMO_CODES] });
  queryClient.invalidateQueries({ queryKey: [EQueries.PROMO_CODES_MINE] });
  queryClient.invalidateQueries({ queryKey: [EQueries.PROMO_CODES_CAMPAIGN] });
}

// payload редактируется, только если у кампании payloadMutable === true (иначе 403)
export function useUpdatePromoCodePayload() {
  return useMutation<
    PromoCode,
    ApiError,
    { id: string; dto: UpdatePromoCodePayloadDto }
  >({
    mutationFn: ({ id, dto }) => promoCodesService.updatePayload(id, dto),
    onSuccess: () => {
      invalidatePromoCodeLists();
    },
  });
}

// Ручное отключение кода. displayStatus станет 'deactivated'
export function useDisablePromoCode() {
  return useMutation<PromoCode, ApiError, string>({
    mutationFn: (id) => promoCodesService.disable(id),
    onSuccess: () => {
      invalidatePromoCodeLists();
      queryClient.invalidateQueries({ queryKey: queryKeys.statsOverview() });
    },
  });
}

// Обратно включить можно только вручную отключённый код (не исчерпанный/истёкший)
export function useEnablePromoCode() {
  return useMutation<PromoCode, ApiError, string>({
    mutationFn: (id) => promoCodesService.enable(id),
    onSuccess: () => {
      invalidatePromoCodeLists();
      queryClient.invalidateQueries({ queryKey: queryKeys.statsOverview() });
    },
  });
}

export function useGeneratePromoCodes() {
  return useMutation<PromoCode[], ApiError, GeneratePromoCodesDto>({
    mutationFn: (dto) => promoCodesService.generate(dto),
    onSuccess: (_codes, dto) => {
      queryClient.invalidateQueries({ queryKey: [EQueries.PROMO_CODES] });
      queryClient.invalidateQueries({ queryKey: [EQueries.PROMO_CODES_MINE] });
      queryClient.invalidateQueries({
        queryKey: [EQueries.PROMO_CODES_CAMPAIGN, dto.campaignId],
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.statsOverview() });
    },
  });
}
