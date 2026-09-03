import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { promoCodesService } from '../../services';
import { EQueries, queryKeys } from '../_types';
import queryClient from '../queryClient';
import type { ApiError } from '../../types/api-error';
import type {
  GeneratePromoCodesDto,
  PromoCode,
  PromoCodeDetail,
  PromoCodeListItem,
  PromoCodeListParams,
  UpdatePromoCodePayloadDto,
} from '../../types/promo-code';
import type { PaginatedResult, PaginationParams } from '../../types/pagination';
import type { DateRangeParams } from '../../types/date-range';

type PromoCodesParams = PaginationParams & DateRangeParams;

// Все коды воркспейса (скоуп по роли решает бэкенд). distributorMembershipId —
// сузить до кодов конкретного Distributor'а (страница деталей дистрибьютора)
export function usePromoCodes(
  params: PromoCodesParams & PromoCodeListParams = {},
) {
  return useQuery<PaginatedResult<PromoCodeListItem>, ApiError>({
    queryKey: queryKeys.promoCodes(params),
    queryFn: () => promoCodesService.findAll(params),
    placeholderData: keepPreviousData,
  });
}

// Детали одного кода: создатель, кампания, разбивка по интеграциям
export function usePromoCode(id: string | undefined) {
  return useQuery<PromoCodeDetail, ApiError>({
    queryKey: queryKeys.promoCode(id ?? ''),
    queryFn: () => promoCodesService.findOne(id as string),
    enabled: !!id,
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

// Мутации возвращают "сырой" PromoCode без displayStatus/creator/campaign —
// мёржим поверх уже загруженного PromoCodeDetail, а не затираем его целиком
function patchPromoCodeDetail(code: PromoCode) {
  queryClient.setQueryData<PromoCodeDetail>(queryKeys.promoCode(code.id), (prev) =>
    prev ? { ...prev, ...code } : undefined,
  );
}

// payload редактируется, только если у кампании payloadMutable === true (иначе 403)
export function useUpdatePromoCodePayload() {
  return useMutation<
    PromoCode,
    ApiError,
    { id: string; dto: UpdatePromoCodePayloadDto }
  >({
    mutationFn: ({ id, dto }) => promoCodesService.updatePayload(id, dto),
    onSuccess: (code) => {
      invalidatePromoCodeLists();
      patchPromoCodeDetail(code);
    },
  });
}

// Ручное отключение кода. displayStatus станет 'deactivated'
export function useDisablePromoCode() {
  return useMutation<PromoCode, ApiError, string>({
    mutationFn: (id) => promoCodesService.disable(id),
    onSuccess: (code) => {
      invalidatePromoCodeLists();
      patchPromoCodeDetail(code);
      queryClient.invalidateQueries({ queryKey: queryKeys.statsOverview() });
    },
  });
}

// Обратно включить можно только вручную отключённый код (не исчерпанный/истёкший)
export function useEnablePromoCode() {
  return useMutation<PromoCode, ApiError, string>({
    mutationFn: (id) => promoCodesService.enable(id),
    onSuccess: (code) => {
      invalidatePromoCodeLists();
      patchPromoCodeDetail(code);
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
